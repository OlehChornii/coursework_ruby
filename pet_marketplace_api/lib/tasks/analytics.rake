# lib/tasks/analytics.rake
namespace :analytics do
  desc "Cleanup old analytics data"
  task cleanup: :environment do
    puts "Cleaning up old analytics data..."
    
    # Cleanup analytics older than 30 days
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
      
      puts "Removed #{before_count - filtered.size} old analytics records"
    end
    
    puts "Analytics cleanup complete!"
  end
  
  desc "Generate analytics report"
  task report: :environment do
    overview = AnalyticsService.get_overview
    
    if overview
      puts "\n" + "=" * 50
      puts "Analytics Report (Last 24 hours)"
      puts "=" * 50
      puts "Total Requests: #{overview[:totalRequests]}"
      puts "Error Requests: #{overview[:errorRequests]}"
      puts "Error Rate: #{overview[:errorRate]}%"
      puts "Avg Duration: #{overview[:avgDuration]}ms"
      puts "Unique Users: #{overview[:uniqueUsers]}"
      puts "\nTop Endpoints:"
      overview[:topEndpoints].each_with_index do |endpoint, i|
        puts "  #{i + 1}. #{endpoint[:path]} (#{endpoint[:requests]} requests, #{endpoint[:avgDuration]}ms avg)"
      end
      puts "=" * 50
    else
      puts "Failed to generate analytics report"
    end
  end
end