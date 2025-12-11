# app/jobs/process_payment_webhook_job.rb
class ProcessPaymentWebhookJob < ApplicationJob
  queue_as :critical
  
  def perform(event_data)
    event_type = event_data['type']
    
    Rails.logger.info("Processing payment webhook: #{event_type}")
    
    case event_type
    when 'checkout.session.completed'
      process_checkout_completed(event_data['data']['object'])
      
    when 'payment_intent.succeeded'
      process_payment_succeeded(event_data['data']['object'])
      
    when 'payment_intent.payment_failed'
      process_payment_failed(event_data['data']['object'])
      
    when 'charge.refunded'
      process_refund(event_data['data']['object'])
    end
  rescue => e
    Rails.logger.error("Payment webhook processing failed: #{e.message}")
    raise
  end
  
  private
  
  def process_checkout_completed(session)
    order_id = session['metadata']['order_id']
    return unless order_id
    
    order = Order.find(order_id)
    order.mark_as_paid!(session['payment_intent'])
    
    order.pets.each { |pet| pet.mark_as_sold!(order.user_id) }
    
    # Send notification
    SendNotificationJob.perform_later(order.user_id, 'order_confirmed', { order_id: order.id })
  end
  
  def process_payment_succeeded(payment_intent)
    Rails.logger.info("Payment succeeded: #{payment_intent['id']}")
  end
  
  def process_payment_failed(payment_intent)
    order = Order.find_by(payment_intent_id: payment_intent['id'])
    return unless order
    
    order.mark_as_failed!
    order.pets.each(&:release!)
  end
  
  def process_refund(charge)
    payment_intent_id = charge['payment_intent']
    order = Order.find_by(payment_intent_id: payment_intent_id)
    return unless order
    
    order.mark_as_refunded!
    order.pets.each(&:release!)
  end
end