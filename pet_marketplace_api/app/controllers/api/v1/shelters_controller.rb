# app/controllers/api/v1/shelters_controller.rb
module Api
  module V1
    class SheltersController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index, :show]
      before_action :set_shelter, only: [:show, :update]
      
      def index
        shelters = Shelter.includes(:user).order(:name)
        render json: shelters
      end
      
      def show
        shelter_data = @shelter.as_json.merge(pet_count: @shelter.pet_count)
        render json: shelter_data
      end
      
      def create
        shelter = Shelter.new(shelter_params)
        shelter.user = current_user
        
        if shelter.save
          render json: shelter, status: :created
        else
          render json: { error: shelter.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      def update
        require_owner!(@shelter)
        
        if @shelter.update(shelter_params)
          render json: @shelter
        else
          render json: { error: @shelter.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      private
      
      def set_shelter
        @shelter = Shelter.find(params[:id])
      end
      
      def shelter_params
        params.permit(:name, :registration_number, :description, :address, :phone, :email, :website)
      end
    end
  end
end