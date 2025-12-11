# app/models/article.rb
class Article < ApplicationRecord
  belongs_to :author, class_name: 'User'
  
  validates :title, presence: true
  validates :category, presence: true, inclusion: { in: %w[dog cat other] }
  validates :content, presence: true
  
  scope :published, -> { where(published: true) }
  scope :unpublished, -> { where(published: false) }
  scope :by_category, ->(category) { where(category: category) if category.present? }
  scope :recent, -> { order(created_at: :desc) }
  
  def publish!
    update(published: true)
  end
  
  def unpublish!
    update(published: false)
  end
end