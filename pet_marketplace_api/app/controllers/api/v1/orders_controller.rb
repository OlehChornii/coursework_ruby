# app/controllers/api/v1/orders_controller.rb
module Api
  module V1
    class OrdersController < ApplicationController
      before_action :set_order, only: [:show]
      before_action :require_owner_or_admin, only: [:show]
      
      # GET /api/v1/orders/user
      def user_orders
        orders = current_user.orders.includes(order_items: :pet).recent
        
        orders_data = orders.map do |order|
          order.as_json.merge(
            items: order.order_items.map do |item|
              {
                pet_id: item.pet_id,
                price: item.price,
                pet_name: item.pet&.name,
                pet_image: item.pet&.image_url
              }
            end
          )
        end
        
        render json: orders_data
      end
      
      # GET /api/v1/orders/:id
      def show
        order_data = @order.as_json.merge(
          user_email: @order.user.email,
          items: @order.order_items.map do |item|
            {
              pet_id: item.pet_id,
              price: item.price,
              pet_name: item.pet&.name,
              pet_category: item.pet&.category,
              pet_breed: item.pet&.breed,
              pet_image: item.pet&.image_url
            }
          end
        )
        
        render json: order_data
      end
      
      # POST /api/v1/orders
      def create
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
          
          Rails.logger.info("Order created: #{order.id} for user #{current_user.id}")
          
          render json: order, status: :created
        end
      rescue ActiveRecord::RecordInvalid => e
        render json: { error: e.message }, status: :bad_request
      end
      
      private
      
      def set_order
        @order = Order.find(params[:id])
      end
      
      def require_owner_or_admin
        return if current_user.admin? || @order.user_id == current_user.id
        
        render json: { error: 'Order not found' }, status: :not_found
      end
    end
  end
end