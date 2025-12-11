# app/controllers/api/v1/admin/analytics_controller.rb
module Api
  module V1
    module Admin
      class AnalyticsController < ApplicationController
        before_action :require_admin!
        
        def overview
          data = AnalyticsService.get_overview(params)
          
          if data
            render json: {
              success: true,
              data: data
            }
          else
            render json: { error: 'Failed to retrieve analytics overview' }, status: :internal_server_error
          end
        end
        
        def timeseries
          metric = params[:metric] || 'requests'
          range = params[:range] || '24h'
          
          valid_metrics = %w[requests errors avgDuration]
          valid_ranges = %w[24h 7d 30d]
          
          unless valid_metrics.include?(metric)
            return render json: { 
              error: 'Invalid metric',
              validMetrics: valid_metrics 
            }, status: :bad_request
          end
          
          unless valid_ranges.include?(range)
            return render json: { 
              error: 'Invalid range',
              validRanges: valid_ranges 
            }, status: :bad_request
          end
          
          data = AnalyticsService.get_timeseries(metric, range)
          
          if data
            render json: {
              success: true,
              data: data
            }
          else
            render json: { error: 'Failed to retrieve timeseries data' }, status: :internal_server_error
          end
        end
        
        def top_endpoints
          limit = (params[:limit] || 10).to_i
          
          if limit < 1 || limit > 50
            return render json: { error: 'Invalid limit (must be 1-50)' }, status: :bad_request
          end
          
          overview = AnalyticsService.get_overview
          
          if overview
            render json: {
              success: true,
              data: overview[:topEndpoints]
            }
          else
            render json: { error: 'Failed to retrieve endpoints data' }, status: :internal_server_error
          end
        end
      end
    end
  end
end