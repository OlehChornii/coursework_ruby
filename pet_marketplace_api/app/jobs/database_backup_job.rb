# app/jobs/database_backup_job.rb
class DatabaseBackupJob < ApplicationJob
  queue_as :default
  
  def perform
    Rails.logger.info("Starting database backup job")
    
    timestamp = Time.now.strftime('%Y%m%d_%H%M%S')
    backup_dir = Rails.root.join('backups')
    FileUtils.mkdir_p(backup_dir)
    
    backup_file = backup_dir.join("backup_#{timestamp}.sql")
    
    config = Rails.configuration.database_configuration[Rails.env]
    
    cmd = "pg_dump -h #{config['host']} -U #{config['username']} -d #{config['database']} > #{backup_file}"
    
    success = system(cmd)
    
    if success
      Rails.logger.info("Database backup created: #{backup_file}")
      
      # Cleanup old backups (keep only last 7)
      cleanup_old_backups(backup_dir, 7)
    else
      Rails.logger.error("Database backup failed")
    end
  rescue => e
    Rails.logger.error("Database backup job failed: #{e.message}")
    raise
  end
  
  private
  
  def cleanup_old_backups(backup_dir, keep_count)
    backups = Dir.glob(backup_dir.join('backup_*.sql'))
                .sort
                .reverse
    
    backups[keep_count..-1]&.each do |old_backup|
      File.delete(old_backup)
      Rails.logger.info("Deleted old backup: #{old_backup}")
    end
  end
end