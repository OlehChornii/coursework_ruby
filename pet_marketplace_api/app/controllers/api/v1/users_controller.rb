# app/controllers/api/v1/users_controller.rb
module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_user!, only: [:register, :login, :refresh_token]
      
      # POST /api/v1/users/register
      def register
        user = User.new(register_params)
        
        if user.save
          token = user.generate_jwt
          refresh_token = user.generate_refresh_token
          
          Rails.logger.info("New user registered: #{user.id} - #{user.email}")
          
          render json: {
            user: user.as_json(except: [:password_digest]),
            token: token,
            refreshToken: refresh_token,
            message: 'Registration successful'
          }, status: :created
        else
          Rails.logger.warn("Registration failed: #{user.errors.full_messages.join(', ')}")
          render json: { error: user.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      # POST /api/v1/users/login
      def login
        user = User.find_by(email: params[:email]&.downcase&.strip)
        
        if user&.authenticate(params[:password])
          token = user.generate_jwt
          refresh_token = user.generate_refresh_token
          
          Rails.logger.info("User logged in: #{user.id} - #{user.email}")
          
          render json: {
            user: user.as_json(except: [:password_digest]),
            token: token,
            refreshToken: refresh_token,
            message: 'Login successful'
          }
        else
          Rails.logger.warn("Failed login attempt for: #{params[:email]}")
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/users/refresh-token
      def refresh_token
        refresh_token = params[:refreshToken]
        
        if refresh_token.blank?
          return render json: { error: 'Refresh token required' }, status: :bad_request
        end
        
        begin
          decoded = JWT.decode(
            refresh_token,
            Rails.application.credentials.jwt_refresh_secret || Rails.application.credentials.secret_key_base,
            true,
            { algorithm: 'HS256' }
          ).first
          
          unless decoded['type'] == 'refresh'
            return render json: { error: 'Invalid refresh token' }, status: :unauthorized
          end
          
          user = User.find(decoded['id'])
          new_token = user.generate_jwt
          new_refresh_token = user.generate_refresh_token
          
          Rails.logger.info("Token refreshed for user: #{user.id}")
          
          render json: {
            token: new_token,
            refreshToken: new_refresh_token
          }
        rescue JWT::DecodeError => e
          Rails.logger.error("Token refresh error: #{e.message}")
          render json: { error: 'Invalid or expired refresh token' }, status: :unauthorized
        rescue ActiveRecord::RecordNotFound
          render json: { error: 'User not found' }, status: :unauthorized
        end
      end
      
      # GET /api/v1/users/profile
      def profile
        render json: current_user.as_json(
          except: [:password_digest],
          methods: [:full_name]
        )
      end
      
      # PUT /api/v1/users/profile
      def update_profile
        if current_user.update(profile_params)
          Rails.logger.info("Profile updated for user: #{current_user.id}")
          
          render json: current_user.as_json(
            except: [:password_digest],
            methods: [:full_name]
          )
        else
          render json: { error: current_user.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      # POST /api/v1/users/change-password
      def change_password
        if current_user.authenticate(params[:currentPassword])
          if current_user.update(password: params[:newPassword])
            Rails.logger.info("Password changed for user: #{current_user.id}")
            render json: { message: 'Password changed successfully' }
          else
            render json: { error: current_user.errors.full_messages.join(', ') }, status: :bad_request
          end
        else
          Rails.logger.warn("Failed password change - wrong current password for user: #{current_user.id}")
          render json: { error: 'Current password is incorrect' }, status: :unauthorized
        end
      end
      
      # POST /api/v1/users/logout
      def logout
        # In Rails, we'll use token blacklisting through Redis or just rely on token expiration
        # For now, we'll just return success (client should delete the token)
        Rails.logger.info("User logged out: #{current_user.id}")
        render json: { message: 'Logged out successfully' }
      end
      
      private
      
      def register_params
        params.permit(:email, :password, :first_name, :last_name, :phone)
      end
      
      def profile_params
        params.permit(:first_name, :last_name, :phone)
      end
    end
  end
end