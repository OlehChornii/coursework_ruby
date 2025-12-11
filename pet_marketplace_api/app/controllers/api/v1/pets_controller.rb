# app/controllers/api/v1/pets_controller.rb
module Api
  module V1
    class PetsController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index, :show, :index_by_category, :breeds]
      before_action :set_pet, only: [:show, :update, :destroy]
      before_action :require_owner_or_admin, only: [:update, :destroy]
      
      # GET /api/v1/pets
      def index
        pets = Pet.available
        
        # Apply filters
        pets = pets.by_category(params[:category])
        pets = pets.by_breed(params[:breed])
        pets = pets.by_gender(params[:gender])
        pets = pets.min_price(params[:minPrice])
        pets = pets.max_price(params[:maxPrice])
        pets = pets.min_age(params[:min_age_months])
        pets = pets.max_age(params[:max_age_months])
        pets = pets.by_breeder(params[:breeder_id])
        pets = pets.by_shelter(params[:shelter_id])
        
        # Apply for adoption filter
        if params[:forAdoption].present?
          pets = params[:forAdoption] == 'true' ? pets.for_adoption : pets.for_sale
        end
        
        # Apply search
        search_term = params[:q] || params[:search]
        pets = pets.search(search_term) if search_term.present?
        
        # Apply sorting
        pets = pets.apply_sorting(params[:sort] || 'recent')
        
        # Pagination
        page = (params[:page] || 1).to_i
        page_size = (params[:page_size] || 12).to_i
        page_size = [[page_size, 1].max, 100].min # Limit between 1 and 100
        
        total_count = pets.count
        total_pages = (total_count.to_f / page_size).ceil
        
        pets = pets.offset((page - 1) * page_size).limit(page_size)
        
        render json: {
          data: pets,
          meta: {
            page: page,
            page_size: page_size,
            total_count: total_count,
            total_pages: total_pages
          }
        }
      end
      
      # GET /api/v1/pets/category/:category
      def index_by_category
        pets = Pet.available.where(category: params[:category])
        
        # Apply filters
        pets = pets.by_breed(params[:breed])
        pets = pets.by_gender(params[:gender])
        pets = pets.min_price(params[:minPrice])
        pets = pets.max_price(params[:maxPrice])
        pets = pets.min_age(params[:min_age_months])
        pets = pets.max_age(params[:max_age_months])
        pets = pets.search(params[:search]) if params[:search].present?
        
        # Apply sorting
        pets = pets.apply_sorting(params[:sort] || 'recent')
        
        render json: pets
      end
      
      # GET /api/v1/pets/:id
      def show
        pet_data = @pet.as_json.merge(
          owner_first_name: @pet.owner&.first_name,
          owner_last_name: @pet.owner&.last_name,
          owner_email: @pet.owner&.email,
          business_name: @pet.breeder&.business_name,
          shelter_name: @pet.shelter&.name
        )
        
        render json: pet_data
      end
      
      # GET /api/v1/pets/breeds/:category
      def breeds
        breeds = Breed.by_category(params[:category]).alphabetical
        render json: breeds
      end
      
      # POST /api/v1/pets
      def create
        pet = Pet.new(pet_params)
        pet.owner = current_user
        
        if pet.save
          Rails.logger.info("Pet created: #{pet.id} by user #{current_user.id}")
          render json: pet, status: :created
        else
          render json: { error: pet.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      # PUT /api/v1/pets/:id
      def update
        if @pet.update(pet_params)
          Rails.logger.info("Pet updated: #{@pet.id} by user #{current_user.id}")
          render json: @pet
        else
          render json: { error: @pet.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      # DELETE /api/v1/pets/:id
      def destroy
        if @pet.destroy
          Rails.logger.info("Pet deleted: #{@pet.id} by user #{current_user.id}")
          render json: { message: 'Pet deleted successfully' }
        else
          render json: { error: 'Failed to delete pet' }, status: :bad_request
        end
      end
      
      private
      
      def set_pet
        @pet = Pet.find(params[:id])
      end
      
      def require_owner_or_admin
        return if current_user.admin?
        
        unless @pet.owner_id == current_user.id
          Rails.logger.warn("Unauthorized pet access by user: #{current_user.id}")
          render json: { error: 'Pet not found or unauthorized' }, status: :forbidden
        end
      end
      
      def pet_params
        params.permit(
          :name, :category, :breed, :age_months, :gender,
          :description, :price, :is_for_adoption, :image_url,
          :breeder_id, :shelter_id, :status
        )
      end
    end
  end
end