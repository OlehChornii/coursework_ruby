# app/controllers/api/v1/adoptions_controller.rb
module Api
  module V1
    class AdoptionsController < ApplicationController
      before_action :set_application, only: [:show, :cancel]
      
      def create
        application = AdoptionApplication.new(application_params)
        application.user = current_user
        
        pet = Pet.find(application.pet_id)
        
        unless pet.is_for_adoption && pet.available?
          return render json: { error: 'Ця тварина недоступна для всиновлення' }, status: :bad_request
        end
        
        if application.save
          render json: application, status: :created
        else
          render json: { error: application.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      def user_applications
        applications = current_user.adoption_applications
                                  .includes(:pet, :shelter)
                                  .recent
        
        applications_data = applications.map do |app|
          app.as_json.merge(
            pet_name: app.pet&.name,
            pet_breed: app.pet&.breed,
            pet_age_months: app.pet&.age_months,
            pet_gender: app.pet&.gender,
            pet_description: app.pet&.description,
            pet_image_url: app.pet&.image_url,
            shelter_name: app.shelter&.name,
            shelter_phone: app.shelter&.phone,
            shelter_email: app.shelter&.email
          )
        end
        
        render json: applications_data
      end
      
      def show
        application_data = @application.as_json.merge(
          pet_id: @application.pet.id,
          pet_name: @application.pet.name,
          pet_breed: @application.pet.breed,
          pet_age_months: @application.pet.age_months,
          pet_gender: @application.pet.gender,
          pet_description: @application.pet.description,
          pet_image_url: @application.pet.image_url,
          shelter_id: @application.shelter&.id,
          shelter_name: @application.shelter&.name,
          shelter_phone: @application.shelter&.phone,
          shelter_email: @application.shelter&.email,
          shelter_address: @application.shelter&.address
        )
        
        render json: application_data
      end
      
      def check_existing
        pet_id = params[:pet_id]
        
        application = current_user.adoption_applications
                                 .where(pet_id: pet_id, status: %w[pending approved])
                                 .order(created_at: :desc)
                                 .first
        
        render json: application
      end
      
      def cancel
        if @application.status != 'pending'
          return render json: { 
            error: 'Можна скасувати тільки заявки зі статусом "очікує розгляду"' 
          }, status: :bad_request
        end
        
        @application.cancel!
        render json: @application
      end
      
      private
      
      def set_application
        @application = current_user.adoption_applications.find(params[:id])
      end
      
      def application_params
        params.permit(:pet_id, :shelter_id, :message)
      end
    end
  end
end