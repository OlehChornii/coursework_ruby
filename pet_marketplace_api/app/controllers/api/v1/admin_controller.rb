# app/controllers/api/v1/admin_controller.rb
module Api
  module V1
    class AdminController < ApplicationController
      before_action :require_admin!
      
      def pending_pets
        pets = Pet.where(status: 'pending')
                 .includes(:owner)
                 .order(created_at: :desc)
        
        pets_data = pets.map do |pet|
          pet.as_json.merge(
            first_name: pet.owner&.first_name,
            last_name: pet.owner&.last_name,
            email: pet.owner&.email
          )
        end
        
        render json: pets_data
      end
      
      def approve_pet
        pet = Pet.find(params[:id])
        pet.update!(status: 'available')
        render json: pet
      end
      
      def reject_pet
        pet = Pet.find(params[:id])
        pet.update!(status: 'rejected')
        render json: pet
      end
      
      def adoption_applications
        applications = AdoptionApplication.includes(:pet, :user, :shelter)
                                         .recent
        
        applications_data = applications.map do |app|
          app.as_json.merge(
            pet_name: app.pet&.name,
            first_name: app.user.first_name,
            last_name: app.user.last_name,
            email: app.user.email,
            phone: app.user.phone,
            shelter_name: app.shelter&.name
          )
        end
        
        render json: applications_data
      end
      
      def update_adoption_status
        application = AdoptionApplication.find(params[:id])
        status = params[:status]
        admin_notes = params[:admin_notes]
        
        unless %w[pending approved rejected].include?(status)
          return render json: { error: 'Невалідний статус' }, status: :bad_request
        end
        
        application.admin_notes = admin_notes if admin_notes.present?
        
        if status == 'approved'
          application.approve!
        elsif status == 'rejected'
          application.reject!
        else
          application.update!(status: status)
        end
        
        # Reload with associations
        application_data = application.reload.as_json.merge(
          pet_name: application.pet.name,
          user_first_name: application.user.first_name,
          user_last_name: application.user.last_name,
          user_email: application.user.email
        )
        
        render json: application_data
      end
      
      def verify_breeder
        breeder = Breeder.find(params[:id])
        breeder.verify!
        render json: breeder
      end
    end
  end
end