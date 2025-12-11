# app/controllers/api/v1/breeders_controller.rb
module Api
  module V1
    class BreedersController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index, :show]
      before_action :set_breeder, only: [:show, :update]
      
      def index
        breeders = Breeder.verified.includes(:user).order(:business_name)
        render json: breeders
      end
      
      def show
        breeder_data = @breeder.as_json.merge(
          email: @breeder.user.email,
          phone: @breeder.user.phone,
          pet_count: @breeder.pets.count
        )
        render json: breeder_data
      end
      
      def create
        breeder = Breeder.new(breeder_params)
        breeder.user = current_user
        
        if breeder.save
          render json: breeder, status: :created
        else
          render json: { error: breeder.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      def update
        require_owner!(@breeder)
        
        if @breeder.update(breeder_params)
          render json: @breeder
        else
          render json: { error: @breeder.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      private
      
      def set_breeder
        @breeder = Breeder.find(params[:id])
      end
      
      def breeder_params
        params.permit(:business_name, :license_number, :description, :address, :website)
      end
    end
  end
end