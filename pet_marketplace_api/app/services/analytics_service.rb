# app/services/analytics_service.rb
class AnalyticsService
  DATA_DIR = Rails.root.join('storage', 'analytics')
  ANALYTICS_FILE = DATA_DIR.join('analytics.json')
  AGGREGATES_FILE = DATA_DIR.join('analytics_aggregates.json')
  
  MAX_RECORDS = 10_000
  MAX_HOURLY_RECORDS = 168  # 7 days
  MAX_DAILY_RECORDS = 30
  
  class << self
    def initialize_storage
      FileUtils.mkdir_p(DATA_DIR)
      
      unless File.exist?(ANALYTICS_FILE)
        File.write(ANALYTICS_FILE, JSON.pretty_generate([]))
        Rails.logger.info('Created new analytics.json file')
      end
      
      unless File.exist?(AGGREGATES_FILE)
        File.write(AGGREGATES_FILE, JSON.pretty_generate({
          hourly: {},
          daily: {},
          endpoints: {}
        }))
        Rails.logger.info('Created new analytics_aggregates.json file')
      end
    end
    
    def safe_read_json(filepath, default_value)
      return default_value unless File.exist?(filepath)
      
      JSON.parse(File.read(filepath), symbolize_names: true)
    rescue JSON::ParserError => e
      Rails.logger.warn("Failed to parse #{filepath}: #{e.message}")
      default_value
    rescue => e
      Rails.logger.error("Failed to read #{filepath}: #{e.message}")
      default_value
    end
    
    def safe_write_json(filepath, data)
      temp_file = "#{filepath}.tmp"
      
      File.write(temp_file, JSON.pretty_generate(data))
      File.rename(temp_file, filepath)
    rescue Errno::EACCES, Errno::EPERM => e
      # Windows-specific handling
      Rails.logger.warn("Rename failed (#{e.class}), using fallback")
      
      begin
        File.delete(filepath) if File.exist?(filepath)
        File.rename(temp_file, filepath)
      rescue => retry_error
        Rails.logger.warn("Retry failed: #{retry_error.message}")
        # Final fallback: copy and delete
        FileUtils.cp(temp_file, filepath)
        File.delete(temp_file) if File.exist?(temp_file)
      end
    ensure
      File.delete(temp_file) if File.exist?(temp_file)
    end
    
    def record(entry)
      initialize_storage
      
      data = safe_read_json(ANALYTICS_FILE, [])
      data << entry.stringify_keys
      
      # Keep only last N records
      trimmed_data = data.last(MAX_RECORDS)
      
      safe_write_json(ANALYTICS_FILE, trimmed_data)
      
      # Update aggregates asynchronously
      update_aggregates(entry)
    rescue => e
      Rails.logger.error("Analytics record error: #{e.message}")
    end
    
    def update_aggregates(entry)
      aggregates = safe_read_json(AGGREGATES_FILE, {
        hourly: {},
        daily: {},
        endpoints: {}
      })

      timestamp = Time.parse(entry[:timestamp] || entry['timestamp']) rescue Time.current
      hour_key = timestamp.strftime('%Y-%m-%dT%H')
      day_key = timestamp.strftime('%Y-%m-%d')

      # Ensure keys are strings (defensive)
      aggregates[:hourly] = Hash[aggregates[:hourly].map { |k, v| [k.to_s, v] }]
      aggregates[:daily]  = Hash[aggregates[:daily].map  { |k, v| [k.to_s, v] }]

      # Update hourly aggregates
      aggregates[:hourly][hour_key] ||= {
        requests: 0,
        errors: 0,
        total_duration: 0,
        avg_duration: 0
      }

      hourly = aggregates[:hourly][hour_key]
      hourly[:requests] += 1
      hourly[:errors] += 1 if entry[:status].to_i >= 400
      hourly[:total_duration] += entry[:duration].to_i
      hourly[:avg_duration] = (hourly[:total_duration] / hourly[:requests].to_f).round

      # Update daily aggregates
      aggregates[:daily][day_key] ||= {
        requests: 0,
        errors: 0,
        total_duration: 0,
        avg_duration: 0
      }

      daily = aggregates[:daily][day_key]
      daily[:requests] += 1
      daily[:errors] += 1 if entry[:status].to_i >= 400
      daily[:total_duration] += entry[:duration].to_i
      daily[:avg_duration] = (daily[:total_duration] / daily[:requests].to_f).round

      # Update endpoint aggregates
      endpoint = entry[:path].to_s.split('?').first
      aggregates[:endpoints][endpoint] ||= {
        requests: 0,
        errors: 0,
        total_duration: 0,
        avg_duration: 0
      }

      endpoint_stats = aggregates[:endpoints][endpoint]
      endpoint_stats[:requests] += 1
      endpoint_stats[:errors] += 1 if entry[:status].to_i >= 400
      endpoint_stats[:total_duration] += entry[:duration].to_i
      endpoint_stats[:avg_duration] = (endpoint_stats[:total_duration] / endpoint_stats[:requests].to_f).round

      # Trim old data — use sort_by with explicit key to avoid Array<=> issues
      begin
        aggregates[:hourly] = aggregates[:hourly].to_a
          .sort_by { |k, _v| k.to_s }   # SQL-ISO timestamp strings sort lexicographically
          .last(MAX_HOURLY_RECORDS)
          .to_h

        aggregates[:daily] = aggregates[:daily].to_a
          .sort_by { |k, _v| k.to_s }
          .last(MAX_DAILY_RECORDS)
          .to_h
      rescue => e
        Rails.logger.error("[AnalyticsService] Trim aggregates failed: #{e.class} #{e.message}\n#{e.backtrace.first(10).join("\n")}")
      end

      safe_write_json(AGGREGATES_FILE, aggregates)
    rescue => e
      Rails.logger.error("[AnalyticsService] Update aggregates error: #{e.class} #{e.message}\n#{e.backtrace.first(20).join("\n")}")
    end

    def get_timeseries(metric = 'requests', range = '24h')
      initialize_storage

      aggregates = safe_read_json(AGGREGATES_FILE, {
        hourly: {},
        daily: {},
        endpoints: {}
      })

      data =
        if range == '24h'
          aggregates[:hourly].to_a
            .sort_by { |k, _| k.to_s }
            .last(24)
            .map do |key, value|
              {
                timestamp: key.to_s,
                value: (value[metric.to_sym] || value[:requests] || 0).to_i
              }
            end
        else
          aggregates[:daily].to_a
            .sort_by { |k, _| k.to_s }
            .last(30)
            .map do |key, value|
              {
                timestamp: key.to_s,
                value: (value[metric.to_sym] || value[:requests] || 0).to_i
              }
            end
        end

      series = data.map { |d| d[:value] }
      trend = detect_trends(series)

      {
        metric: metric,
        range: range,
        data: data,
        trend: trend
      }
    rescue => e
      Rails.logger.error("[AnalyticsService] Get timeseries error: #{e.class} #{e.message}\n#{e.backtrace.first(20).join("\n")}")
      nil
    end

    def get_top_endpoints(endpoints, limit = 10)
      return [] unless endpoints.is_a?(Hash)

      endpoints
        .to_a
        .sort_by { |_, stats| -(stats[:requests] || 0) }
        .first(limit)
        .map do |path, stats|
          reqs = (stats[:requests] || 0)
          errs = (stats[:errors] || 0)
          avg_dur = (stats[:avg_duration] || stats[:avgDuration] || 0).to_f
          error_rate = reqs > 0 ? (errs.to_f / reqs * 100).round(2) : 0

          {
            path: path.to_s,
            requests: reqs,
            errors: errs,
            avgDuration: avg_dur.round,
            errorRate: error_rate
          }
        end
    end
    
    def get_overview(params = {})
      initialize_storage
      
      data = safe_read_json(ANALYTICS_FILE, [])
      aggregates = safe_read_json(AGGREGATES_FILE, {
        hourly: {},
        daily: {},
        endpoints: {}
      })
      
      # Filter last 24 hours
      cutoff_time = 24.hours.ago
      last_24h = data.select do |entry|
        timestamp = Time.parse(entry['timestamp'] || entry[:timestamp])
        timestamp >= cutoff_time
      end
      
      total_requests = last_24h.size
      error_requests = last_24h.count { |e| e['status'].to_i >= 400 }
      
      avg_duration = if total_requests > 0
        total_duration = last_24h.sum { |e| e['duration'].to_i }
        total_duration / total_requests
      else
        0
      end
      
      error_rate = total_requests > 0 ? (error_requests.to_f / total_requests * 100).round(2) : 0
      
      unique_users = last_24h.map { |e| e['userId'] || e[:userId] }.compact.uniq.size
      
      {
        period: '24h',
        totalRequests: total_requests,
        errorRequests: error_requests,
        errorRate: error_rate,
        avgDuration: avg_duration.round,
        uniqueUsers: unique_users,
        topEndpoints: get_top_endpoints(aggregates[:endpoints], 5)
      }
    rescue => e
      Rails.logger.error("Get overview error: #{e.message}")
      nil
    end
    
    def detect_trends(series)
      return { direction: 'stable', confidence: 'low', movingAverage: series } if series.size < 3
      
      # Calculate moving average
      moving_average = series.each_with_index.map do |_, i|
        if i < 2
          series[i]
        else
          (series[i] + series[i - 1] + series[i - 2]) / 3.0
        end
      end
      
      # Analyze recent trend
      recent_window = [6, series.size].min
      recent = series.last(recent_window)
      half_point = (recent_window / 2.0).floor
      
      first_half = recent.first(half_point)
      second_half = recent.last(recent_window - half_point)
      
      avg_first = first_half.sum / first_half.size.to_f
      avg_second = second_half.sum / second_half.size.to_f
      
      percent_change = ((avg_second - avg_first) / (avg_first.zero? ? 1 : avg_first)) * 100
      
      direction = 'stable'
      confidence = 'low'
      
      if percent_change.abs > 20
        confidence = 'high'
        direction = percent_change > 0 ? 'rising' : 'falling'
      elsif percent_change.abs > 10
        confidence = 'medium'
        direction = percent_change > 0 ? 'rising' : 'falling'
      end
      
      # Detect anomalies
      mean = series.sum / series.size.to_f
      variance = series.sum { |val| (val - mean) ** 2 } / series.size.to_f
      std_dev = Math.sqrt(variance)
      
      anomalies = series.each_with_index
        .select { |val, _| (val - mean).abs > 2 * std_dev }
        .map { |_, idx| idx }
      
      {
        direction: direction,
        confidence: confidence,
        percentChange: percent_change.round(2),
        movingAverage: moving_average,
        anomalies: anomalies
      }
    end
  end
end