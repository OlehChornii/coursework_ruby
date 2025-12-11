# app/controllers/application_controller.rb
class ApplicationController < ActionController::API
  before_action :authenticate_user!
  
  rescue_from ActiveRecord::RecordNotFound, with: :record_not_found
  rescue_from ActiveRecord::RecordInvalid, with: :record_invalid
  rescue_from ActionController::ParameterMissing, with: :parameter_missing
  
  attr_reader :current_user
  
  private
  
  def authenticate_user!
    token = extract_token_from_header
    
    if token.blank?
      return render json: { error: 'Authentication token required' }, status: :unauthorized
    end
    
    begin
      decoded = JWT.decode(
        token,
        Rails.application.credentials.secret_key_base,
        true,
        { algorithm: 'HS256' }
      ).first
      
      @current_user = User.find(decoded['id'])
      
      Rails.logger.info("User authenticated: #{@current_user.email} (ID: #{@current_user.id}, Role: #{@current_user.role})")
      
    rescue JWT::ExpiredSignature
      Rails.logger.warn('Token has expired')
      render json: { error: 'Token has expired' }, status: :unauthorized
    rescue JWT::DecodeError => e
      Rails.logger.warn("Invalid token: #{e.message}")
      render json: { error: 'Invalid token' }, status: :unauthorized
    rescue ActiveRecord::RecordNotFound
      Rails.logger.warn('User not found for token')
      render json: { error: 'User not found' }, status: :unauthorized
    end
  end
  
  def require_admin!
    unless current_user&.admin?
      Rails.logger.warn("Unauthorized admin access attempt by user: #{current_user&.id}")
      render json: { error: 'Admin access required' }, status: :forbidden
    end
  end
  
  def require_owner!(resource)
    unless current_user&.admin? || resource_belongs_to_current_user?(resource)
      Rails.logger.warn("Unauthorized resource access by user: #{current_user&.id}")
      render json: { error: 'You can only modify your own resources' }, status: :forbidden
    end
  end
  
  def optional_authentication
    token = extract_token_from_header
    
    return if token.blank?
    
    begin
      decoded = JWT.decode(
        token,
        Rails.application.credentials.secret_key_base,
        true,
        { algorithm: 'HS256' }
      ).first
      
      @current_user = User.find(decoded['id'])
    rescue JWT::DecodeError, ActiveRecord::RecordNotFound
      # Silently fail for optional auth
      @current_user = nil
    end
  end
  
  def extract_token_from_header
    auth_header = request.headers['Authorization']
    return nil if auth_header.blank?
    
    if auth_header.start_with?('Bearer ')
      auth_header.sub('Bearer ', '')
    else
      nil
    end
  end
  
  def resource_belongs_to_current_user?(resource)
    case resource
    when User
      resource.id == current_user.id
    when Pet, Article
      resource.owner_id == current_user.id || resource.author_id == current_user.id
    when Order, AdoptionApplication
      resource.user_id == current_user.id
    when Breeder, Shelter
      resource.user_id == current_user.id
    else
      false
    end
  end
  
  def record_not_found(exception)
    Rails.logger.warn("Record not found: #{exception.message}")
    render json: { error: 'Record not found' }, status: :not_found
  end
  
  def record_invalid(exception)
    Rails.logger.warn("Invalid record: #{exception.message}")
    render json: { 
      error: 'Validation failed',
      details: exception.record.errors.full_messages
    }, status: :bad_request
  end
  
  def parameter_missing(exception)
    Rails.logger.warn("Parameter missing: #{exception.message}")
    render json: { error: exception.message }, status: :bad_request
  end
end