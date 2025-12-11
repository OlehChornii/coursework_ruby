# app/models/webhook_log.rb
class WebhookLog < ApplicationRecord
  validates :event_id, presence: true, uniqueness: true
  validates :event_type, presence: true
  validates :payload, presence: true
  
  scope :recent, -> { order(created_at: :desc) }
  scope :by_event_type, ->(type) { where(event_type: type) }
  scope :successful, -> { where(processing_status: 'success') }
  scope :failed, -> { where(processing_status: 'failed') }
end