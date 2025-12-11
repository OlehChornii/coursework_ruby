# app/models/shelter.rb
class Shelter < ApplicationRecord
  belongs_to :user
  has_many :pets, dependent: :nullify
  has_many :adoption_applications, dependent: :nullify
  
  validates :name, presence: true
  validates :registration_number, length: { maximum: 100 }
  validates :phone, format: { with: /\A(\+380|0)\d{9}\z/ }, allow_blank: true
  validates :email, format: { with: URI::MailTo::EMAIL_REGEXP }, allow_blank: true
  validates :website, format: { with: URI::DEFAULT_PARSER.make_regexp }, allow_blank: true
  
  def pet_count
    pets.count
  end
end