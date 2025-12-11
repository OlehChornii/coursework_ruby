# lib/tasks/database.rake
namespace :db do
  desc "Reset database and reseed"
  task reset_and_seed: :environment do
    puts "Dropping database..."
    Rake::Task['db:drop'].invoke
    
    puts "Creating database..."
    Rake::Task['db:create'].invoke
    
    puts "Running migrations..."
    Rake::Task['db:migrate'].invoke
    
    puts "Seeding database..."
    Rake::Task['db:seed'].invoke
    
    puts "Database reset complete!"
  end
  
  desc "Backup database to file"
  task backup: :environment do
    timestamp = Time.now.strftime('%Y%m%d_%H%M%S')
    backup_dir = Rails.root.join('backups')
    FileUtils.mkdir_p(backup_dir)
    
    backup_file = backup_dir.join("backup_#{timestamp}.sql")
    
    config = Rails.configuration.database_configuration[Rails.env]
    
    cmd = "pg_dump -h #{config['host']} -U #{config['username']} -d #{config['database']} > #{backup_file}"
    
    puts "Creating backup: #{backup_file}"
    system(cmd)
    
    if $?.success?
      puts "Backup created successfully!"
    else
      puts "Backup failed!"
    end
  end
end