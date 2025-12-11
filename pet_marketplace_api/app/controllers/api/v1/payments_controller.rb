# app/controllers/api/v1/payments_controller.rb
module Api
  module V1
    class PaymentsController < ApplicationController
      include ActionController::RequestForgeryProtection
      
      protect_from_forgery with: :null_session
      
      skip_before_action :verify_authenticity_token, only: [:webhook, :create_session]
      skip_before_action :authenticate_user!, only: [:webhook]
      
      # POST /api/v1/payments/create-session
      def create_session
        unless ENV['STRIPE_SECRET_KEY'].present?
          return render json: { 
            error: 'Payment service is not configured. Please contact administrator.' 
          }, status: :service_unavailable
        end
        
        ActiveRecord::Base.transaction do
          items = params[:items] || []
          shipping_address = params[:shipping_address]
          
          if items.empty?
            return render json: { error: 'No items provided' }, status: :bad_request
          end
          
          total_price = items.sum { |item| item[:price].to_f }
          
          order = Order.create!(
            user: current_user,
            total_price: total_price,
            shipping_address: shipping_address,
            status: 'pending',
            payment_status: 'pending'
          )
          
          items.each do |item|
            OrderItem.create!(
              order: order,
              pet_id: item[:pet_id],
              price: item[:price]
            )
            
            Pet.find(item[:pet_id]).mark_as_pending!
          end
          
          # Create Stripe checkout session
          session = StripeService.create_checkout_session(
            items: items,
            order_id: order.id,
            email: current_user.email
          )
          
          order.update!(stripe_session_id: session.id)
          
          Rails.logger.info("Payment session created: #{session.id} for order #{order.id}")
          
          render json: {
            sessionId: session.id,
            url: session.url,
            orderId: order.id
          }
        end
      rescue Stripe::StripeError => e
        Rails.logger.error("Stripe error: #{e.message}")
        render json: { 
          error: 'Failed to create payment session',
          details: Rails.env.development? ? e.message : nil
        }, status: :internal_server_error
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :bad_request
      end
      
      # POST /api/v1/payments/webhook
      def webhook
        payload = request.body.read
        sig_header = request.headers['Stripe-Signature']
        
        begin
          event = Stripe::Webhook.construct_event(
            payload, sig_header, ENV['STRIPE_WEBHOOK_SECRET']
          )
        rescue JSON::ParserError => e
          Rails.logger.error("Webhook JSON parse error: #{e.message}")
          return render json: { error: 'Invalid payload' }, status: :bad_request
        rescue Stripe::SignatureVerificationError => e
          Rails.logger.error("Webhook signature verification failed: #{e.message}")
          return render json: { error: 'Invalid signature' }, status: :bad_request
        end
        
        begin
          process_webhook_event(event)
          render json: { received: true }, status: :ok
        rescue => e
          Rails.logger.error("Webhook processing error: #{e.message}")
          render json: { error: 'Webhook processing failed' }, status: :internal_server_error
        end
      end
      
      # GET /api/v1/payments/verify
      def verify
        session_id = params[:session_id]
        
        if session_id.blank?
          return render json: { error: 'Session ID required' }, status: :bad_request
        end
        
        session = Stripe::Checkout::Session.retrieve(session_id)
        order_id = session.metadata.order_id
        
        order = current_user.orders.find(order_id)
        
        render json: {
          order: order,
          paymentStatus: session.payment_status
        }
      rescue Stripe::StripeError => e
        Rails.logger.error("Verify payment error: #{e.message}")
        render json: { 
          error: 'Failed to verify payment',
          details: Rails.env.development? ? e.message : nil
        }, status: :internal_server_error
      end
      
      # GET /api/v1/payments/receipt
      def receipt
        order_id = params[:order_id]
        
        if order_id.blank?
          return render json: { error: 'order_id required' }, status: :bad_request
        end
        
        order = Order.find(order_id)
        
        webhook_log = if order.payment_intent_id.present?
          WebhookLog.where("payload->>'payment_intent' = ?", order.payment_intent_id)
                   .where("payload->>'receipt_url' IS NOT NULL")
                   .order(created_at: :desc)
                   .first
        else
          WebhookLog.where("payload->>'checkout_session' = ? OR payload->>'session' = ? OR payload->>'id' = ?",
                          order.stripe_session_id, order.stripe_session_id, order.stripe_session_id)
                   .where("payload->>'receipt_url' IS NOT NULL")
                   .order(created_at: :desc)
                   .first
        end
        
        if webhook_log && webhook_log.payload['receipt_url']
          render json: {
            receipt_url: webhook_log.payload['receipt_url'],
            event_type: webhook_log.event_type,
            found_at: webhook_log.created_at
          }
        else
          render json: { 
            receipt_url: nil, 
            message: 'Receipt not yet available' 
          }
        end
      rescue ActiveRecord::RecordNotFound
        render json: { error: 'Order not found' }, status: :not_found
      rescue => e
        Rails.logger.error("Receipt fetch error: #{e.message}")
        render json: { 
          error: 'Failed to fetch receipt',
          details: e.message
        }, status: :internal_server_error
      end
      
      private
      
      def process_webhook_event(event)
        ActiveRecord::Base.transaction do
          # Log the webhook event
          WebhookLog.create!(
            event_id: event.id,
            event_type: event.type,
            payload: event.as_json,
            processed_at: Time.current,
            processing_status: 'success'
          )
          
          Rails.logger.info("Processing webhook event: #{event.type} (#{event.id})")
          
          case event.type
          when 'checkout.session.completed'
            handle_checkout_completed(event.data.object)
          when 'payment_intent.succeeded'
            handle_payment_succeeded(event.data.object)
          when 'payment_intent.payment_failed'
            handle_payment_failed(event.data.object)
          when 'charge.refunded'
            handle_refund(event.data.object)
          else
            Rails.logger.info("Unhandled event type: #{event.type}")
          end
        end
      rescue => e
        WebhookLog.create!(
          event_id: event.id,
          event_type: event.type,
          payload: event.as_json,
          processing_status: 'failed',
          error_message: e.message
        )
        raise
      end
      
      def handle_checkout_completed(session)
        order_id = session.metadata&.order_id
        
        unless order_id
          Rails.logger.warn("Checkout completed without order_id: #{session.id}")
          return
        end
        
        order = Order.find(order_id)
        order.mark_as_paid!(session.payment_intent)
        
        # Assign pets to buyer
        order.pets.each do |pet|
          pet.mark_as_sold!(order.user_id)
        end
        
        Rails.logger.info("Order #{order_id} marked as paid and pets assigned to user #{order.user_id}")
      end
      
      def handle_payment_succeeded(payment_intent)
        Rails.logger.info("Payment succeeded: #{payment_intent.id}")
      end
      
      def handle_payment_failed(payment_intent)
        order = Order.find_by(payment_intent_id: payment_intent.id)
        
        if order
          order.mark_as_failed!
          
          # Release pets
          order.pets.each(&:release!)
          
          Rails.logger.info("Order #{order.id} payment failed, pets released")
        else
          Rails.logger.warn("Payment failed but no order found: #{payment_intent.id}")
        end
      end
      
      def handle_refund(charge)
        payment_intent_id = charge.payment_intent
        
        order = Order.find_by(payment_intent_id: payment_intent_id)
        
        if order
          order.mark_as_refunded!
          
          # Release pets
          order.pets.each(&:release!)
          
          Rails.logger.info("Order #{order.id} refunded; pets released")
        else
          Rails.logger.warn("Refund received but no order found: #{payment_intent_id}")
        end
      end
    end
  end
end