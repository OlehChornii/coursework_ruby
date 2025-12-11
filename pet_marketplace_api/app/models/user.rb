# app/models/user.rb
class User < ApplicationRecord
  has_secure_password
  
  # Associations
  has_one :breeder, dependent: :destroy
  has_one :shelter, dependent: :destroy
  has_many :pets, foreign_key: :owner_id, dependent: :nullify
  has_many :articles, foreign_key: :author_id, dependent: :nullify
  has_many :orders, dependent: :destroy
  has_many :adoption_applications, dependent: :destroy
  
  # Validations
  validates :email, presence: true, 
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  
  validates :first_name, presence: true,
                         length: { minimum: 2, maximum: 50 },
                         format: { with: /\A[a-zA-Zа-яА-ЯіІїЇєЄ\s'\-]+\z/ }
  
  validates :last_name, presence: true,
                        length: { minimum: 2, maximum: 50 },
                        format: { with: /\A[a-zA-Zа-яА-ЯіІїЇєЄ\s'\-]+\z/ }
  
  validates :phone, format: { with: /\A(\+380|0)\d{9}\z/ },
                    allow_blank: true
  
  validates :password, length: { minimum: 8 },
                       format: { with: /\A(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+\z/,
                                message: "must contain uppercase, lowercase, number and special character" },
                       if: -> { new_record? || !password.nil? }
  
  validates :role, inclusion: { in: %w[user breeder shelter admin] }
  
  # Callbacks
  before_save :normalize_email
  
  # Scopes
  scope :admins, -> { where(role: 'admin') }
  scope :breeders, -> { where(role: 'breeder') }
  scope :shelters, -> { where(role: 'shelter') }
  
  # Instance methods
  def admin?
    role == 'admin'
  end
  
  def breeder?
    role == 'breeder'
  end
  
  def shelter?
    role == 'shelter'
  end
  
  def full_name
    "#{first_name} #{last_name}".strip
  end
  
  # Generate JWT token
  def generate_jwt
    payload = {
      id: id,
      email: email,
      role: role,
      exp: 7.days.from_now.to_i,
      iss: 'pet-marketplace',
      aud: 'pet-marketplace-users'
    }
    JWT.encode(payload, Rails.application.credentials.secret_key_base)
  end
  
  # Generate refresh token
  def generate_refresh_token
    payload = {
      id: id,
      type: 'refresh',
      exp: 30.days.from_now.to_i
    }
    JWT.encode(payload, Rails.application.credentials.jwt_refresh_secret || Rails.application.credentials.secret_key_base)
  end
  
  private
  
  def normalize_email
    self.email = email.to_s.downcase.strip
  end
end