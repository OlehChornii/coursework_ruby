# app/jobs/cleanup_analytics_job.rb
class CleanupAnalyticsJob < ApplicationJob
  queue_as :default
  
  def perform
    Rails.logger.info("Starting analytics cleanup job")
    
    cutoff_date = 30.days.ago
    data_file = Rails.root.join('storage', 'analytics', 'analytics.json')
    
    if File.exist?(data_file)
      data = JSON.parse(File.read(data_file))
      before_count = data.size
      
      filtered = data.select do |entry|
        timestamp = Time.parse(entry['timestamp'])
        timestamp >= cutoff_date
      end
      
      File.write(data_file, JSON.pretty_generate(filtered))
      
      deleted_count = before_count - filtered.size
      Rails.logger.info("Analytics cleanup: removed #{deleted_count} old records")
    end
  rescue => e
    Rails.logger.error("Analytics cleanup job failed: #{e.message}")
    raise
  end
end