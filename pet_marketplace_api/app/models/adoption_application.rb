# app/models/adoption_application.rb
class AdoptionApplication < ApplicationRecord
  belongs_to :user
  belongs_to :pet
  belongs_to :shelter, optional: true
  
  validates :status, inclusion: { in: %w[pending approved rejected cancelled] }
  
  scope :pending, -> { where(status: 'pending') }
  scope :approved, -> { where(status: 'approved') }
  scope :rejected, -> { where(status: 'rejected') }
  scope :recent, -> { order(created_at: :desc) }
  
  validate :check_duplicate_application, on: :create
  
  def approve!
    transaction do
      update!(status: 'approved')
      pet.mark_as_adopted!(user_id)
      
      # Reject other pending applications for the same pet
      AdoptionApplication.where(pet_id: pet_id)
                        .where.not(id: id)
                        .pending
                        .update_all(
                          status: 'rejected',
                          admin_notes: 'Тварину вже всиновлено іншим користувачем'
                        )
    end
  end
  
  def reject!
    update!(status: 'rejected')
    
    # Check if there are other pending applications
    other_pending = AdoptionApplication.where(pet_id: pet_id)
                                      .where.not(id: id)
                                      .pending
                                      .count
    
    # If no other pending applications, make pet available again
    pet.update(status: 'available') if other_pending.zero? && !pet.adopted?
  end
  
  def cancel!
    raise 'Can only cancel pending applications' unless pending?
    update!(status: 'cancelled')
  end
  
  private
  
  def check_duplicate_application
    existing = AdoptionApplication.where(
      user_id: user_id,
      pet_id: pet_id,
      status: %w[pending approved]
    ).exists?
    
    errors.add(:base, 'Ви вже подали заявку на цю тварину') if existing
  end
end