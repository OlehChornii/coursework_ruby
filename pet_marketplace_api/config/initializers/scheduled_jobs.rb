# config/initializers/scheduled_jobs.rb
# Using Sidekiq-cron or whenever gem for scheduling

# With Sidekiq-cron (add to Gemfile: gem 'sidekiq-cron')
if defined?(Sidekiq::Cron::Job)
  Sidekiq::Cron::Job.create(
    name: 'Cleanup Analytics - daily',
    cron: '0 2 * * *', # Every day at 2 AM
    class: 'CleanupAnalyticsJob'
  )
  
  Sidekiq::Cron::Job.create(
    name: 'Cleanup Chat Messages - daily',
    cron: '0 3 * * *', # Every day at 3 AM
    class: 'CleanupChatMessagesJob'
  )
  
  Sidekiq::Cron::Job.create(
    name: 'Database Backup - daily',
    cron: '0 4 * * *', # Every day at 4 AM
    class: 'DatabaseBackupJob'
  )
end