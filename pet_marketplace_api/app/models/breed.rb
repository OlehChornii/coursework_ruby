# app/models/breed.rb
class Breed < ApplicationRecord
  validates :name, presence: true, length: { maximum: 100 }
  validates :category, presence: true, inclusion: { in: %w[dog cat] }
  
  scope :dogs, -> { where(category: 'dog') }
  scope :cats, -> { where(category: 'cat') }
  scope :by_category, ->(category) { where(category: category) }
  scope :alphabetical, -> { order(name: :asc) }
end