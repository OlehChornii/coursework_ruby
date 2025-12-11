# app/models/order.rb
class Order < ApplicationRecord
  belongs_to :user
  has_many :order_items, dependent: :destroy
  has_many :pets, through: :order_items
  
  validates :total_price, presence: true, numericality: { greater_than: 0 }
  validates :shipping_address, presence: true
  
  scope :pending, -> { where(status: 'pending') }
  scope :paid, -> { where(payment_status: 'paid') }
  scope :recent, -> { order(created_at: :desc) }
  
  def mark_as_paid!(payment_intent_id)
    update(
      status: 'confirmed',
      payment_status: 'paid',
      payment_intent_id: payment_intent_id,
      paid_at: Time.current
    )
  end
  
  def mark_as_refunded!
    update(
      status: 'refunded',
      payment_status: 'refunded',
      refunded_at: Time.current
    )
  end
  
  def mark_as_failed!
    update(
      status: 'cancelled',
      payment_status: 'failed'
    )
  end
end