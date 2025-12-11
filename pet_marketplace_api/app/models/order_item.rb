# app/models/order_item.rb
class OrderItem < ApplicationRecord
  belongs_to :order
  belongs_to :pet
  
  validates :price, presence: true, numericality: { greater_than: 0 }
end