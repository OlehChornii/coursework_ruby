# app/controllers/api/v1/health_controller.rb
module Api
  module V1
    class HealthController < ApplicationController
      skip_before_action :authenticate_user!
      
      def index
        render json: {
          status: 'OK',
          timestamp: Time.current.iso8601,
          uptime: `uptime`.strip,
          environment: Rails.env,
          payment: {
            stripe: ENV['STRIPE_SECRET_KEY'].present?,
            webhook: ENV['STRIPE_WEBHOOK_SECRET'].present?,
            configured: StripeService.configured?
          },
          database: database_status
        }
      end
      
      private
      
      def database_status
        ActiveRecord::Base.connection.execute('SELECT 1')
        'connected'
      rescue
        'disconnected'
      end
    end
  end
end