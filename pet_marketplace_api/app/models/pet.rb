# app/models/pet.rb
class Pet < ApplicationRecord
  # Associations
  belongs_to :owner, class_name: 'User', optional: true
  belongs_to :breeder, optional: true
  belongs_to :shelter, optional: true
  has_many :order_items, dependent: :restrict_with_error
  has_many :orders, through: :order_items
  has_many :adoption_applications, dependent: :destroy
  
  # Validations
  validates :name, presence: true, length: { minimum: 2, maximum: 100 }
  validates :category, presence: true, inclusion: { in: %w[dog cat bird fish other] }
  validates :price, numericality: { greater_than_or_equal_to: 0, less_than_or_equal_to: 1_000_000 },
                    allow_nil: true
  validates :age_months, numericality: { only_integer: true, greater_than_or_equal_to: 0, less_than_or_equal_to: 600 },
                         allow_nil: true
  validates :description, length: { maximum: 2000 }
  validates :breed, length: { maximum: 100 }
  validates :status, inclusion: { in: %w[available reserved sold adopted pending rejected] }
  validates :gender, inclusion: { in: %w[male female unknown] }, allow_blank: true
  
  # Scopes
  scope :available, -> { where(status: 'available') }
  scope :for_adoption, -> { where(is_for_adoption: true) }
  scope :for_sale, -> { where(is_for_adoption: false) }
  scope :by_category, ->(category) { where(category: category) if category.present? && category != 'all' }
  scope :by_breed, ->(breed) { where(breed: breed) if breed.present? }
  scope :by_gender, ->(gender) { where(gender: gender) if gender.present? }
  scope :min_price, ->(price) { where('price >= ?', price) if price.present? }
  scope :max_price, ->(price) { where('price <= ?', price) if price.present? }
  scope :min_age, ->(age) { where('age_months >= ?', age) if age.present? }
  scope :max_age, ->(age) { where('age_months <= ?', age) if age.present? }
  scope :by_breeder, ->(breeder_id) { where(breeder_id: breeder_id) if breeder_id.present? }
  scope :by_shelter, ->(shelter_id) { where(shelter_id: shelter_id) if shelter_id.present? }
  scope :search, ->(query) { 
    where('name ILIKE ? OR description ILIKE ? OR breed ILIKE ?', 
          "%#{query}%", "%#{query}%", "%#{query}%") if query.present?
  }
  
  # Ordering scopes
  scope :order_by_recent, -> { order(created_at: :desc) }
  scope :order_by_oldest, -> { order(created_at: :asc) }
  scope :order_by_price_asc, -> { order(Arel.sql('price ASC NULLS LAST')) }
  scope :order_by_price_desc, -> { order(Arel.sql('price DESC NULLS LAST')) }
  scope :order_by_age_asc, -> { order(Arel.sql('age_months ASC NULLS LAST')) }
  scope :order_by_age_desc, -> { order(Arel.sql('age_months DESC NULLS LAST')) }
  scope :order_by_name, -> { order(name: :asc) }
  
  # Class methods
  def self.apply_sorting(sort_param)
    case sort_param
    when 'oldest'
      order_by_oldest
    when 'price_asc'
      order_by_price_asc
    when 'price_desc'
      order_by_price_desc
    when 'age_asc'
      order_by_age_asc
    when 'age_desc'
      order_by_age_desc
    when 'name'
      order_by_name
    else
      order_by_recent
    end
  end
  
  # Instance methods
  def available?
    status == 'available'
  end
  
  def sold?
    status == 'sold'
  end
  
  def adopted?
    status == 'adopted'
  end
  
  def mark_as_pending!
    update(status: 'pending')
  end
  
  def mark_as_sold!(buyer_id)
    update(status: 'sold', owner_id: buyer_id)
  end
  
  def mark_as_adopted!(adopter_id)
    update(status: 'adopted', owner_id: adopter_id, is_for_adoption: false)
  end
  
  def release!
    update(status: 'available', owner_id: nil)
  end
end