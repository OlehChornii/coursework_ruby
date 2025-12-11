# app/models/breeder.rb
class Breeder < ApplicationRecord
  belongs_to :user
  has_many :pets, dependent: :nullify
  
  validates :business_name, presence: true
  validates :license_number, length: { maximum: 100 }
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp }, allow_blank: true
  
  scope :verified, -> { where(license_verified: true) }
  scope :unverified, -> { where(license_verified: false) }
  
  def verify!
    update(license_verified: true)
  end
end