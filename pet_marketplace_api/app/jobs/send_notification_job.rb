# app/jobs/send_notification_job.rb
class SendNotificationJob < ApplicationJob
  queue_as :default
  
  def perform(user_id, notification_type, data = {})
    user = User.find(user_id)
    
    case notification_type
    when 'order_confirmed'
      # Send order confirmation email
      # OrderMailer.confirmation(user, data[:order_id]).deliver_later
      Rails.logger.info("Order confirmation notification sent to user #{user_id}")
      
    when 'adoption_approved'
      # Send adoption approval email
      # AdoptionMailer.approval(user, data[:application_id]).deliver_later
      Rails.logger.info("Adoption approval notification sent to user #{user_id}")
      
    when 'adoption_rejected'
      # Send adoption rejection email
      # AdoptionMailer.rejection(user, data[:application_id]).deliver_later
      Rails.logger.info("Adoption rejection notification sent to user #{user_id}")
      
    when 'pet_available'
      # Send pet availability notification
      Rails.logger.info("Pet availability notification sent to user #{user_id}")
    end
  rescue ActiveRecord::RecordNotFound => e
    Rails.logger.error("User not found for notification: #{e.message}")
  rescue => e
    Rails.logger.error("Notification job failed: #{e.message}")
    raise
  end
end