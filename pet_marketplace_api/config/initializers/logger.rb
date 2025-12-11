# config/initializers/logger.rb

# Create logs directory if it doesn't exist
logs_dir = Rails.root.join('log')
FileUtils.mkdir_p(logs_dir)

# Custom logger with multiple outputs
class CustomLogger
  def initialize
    @logger = Logger.new(STDOUT)
    @logger.level = Logger::INFO
    @logger.formatter = proc do |severity, datetime, progname, msg|
      formatted_msg = msg.is_a?(Hash) ? JSON.pretty_generate(msg) : msg
      "[#{datetime.strftime('%Y-%m-%d %H:%M:%S')}] #{severity}: #{formatted_msg}\n"
    end
    
    # File loggers
    @error_logger = Logger.new(
      Rails.root.join('log', 'error.log'),
      10, # Keep 10 files
      5_242_880 # 5MB each
    )
    
    @security_logger = Logger.new(
      Rails.root.join('log', 'security.log'),
      10,
      5_242_880
    )
    
    @performance_logger = Logger.new(
      Rails.root.join('log', 'performance.log'),
      5,
      5_242_880
    )
  end
  
  def info(message, meta = {})
    log_message = format_message(message, meta)
    @logger.info(log_message)
    Rails.logger.info(log_message) if Rails.logger
  end
  
  def warn(message, meta = {})
    log_message = format_message(message, meta)
    @logger.warn(log_message)
    Rails.logger.warn(log_message) if Rails.logger
  end
  
  def error(message, meta = {})
    log_message = format_message(message, meta)
    @logger.error(log_message)
    @error_logger.error(log_message)
    Rails.logger.error(log_message) if Rails.logger
  end
  
  def debug(message, meta = {})
    return unless Rails.env.development?
    log_message = format_message(message, meta)
    @logger.debug(log_message)
  end
  
  # Custom log methods
  def security(message, meta = {})
    log_message = format_message(message, { type: 'security' }.merge(meta))
    @security_logger.warn(log_message)
    warn(message, meta)
  end
  
  def audit(message, meta = {})
    log_message = format_message(message, { type: 'audit' }.merge(meta))
    info(log_message)
  end
  
  def performance(message, duration, meta = {})
    log_message = format_message(message, { 
      type: 'performance', 
      duration: duration 
    }.merge(meta))
    @performance_logger.info(log_message)
    
    # Warn if slow
    warn(message, meta.merge(duration: duration)) if duration > 1000
  end
  
  private
  
  def format_message(message, meta)
    return message if meta.empty?
    
    meta_str = meta.map { |k, v| "#{k}=#{v}" }.join(' ')
    "#{message} | #{meta_str}"
  end
end

# Make it globally accessible
$custom_logger = CustomLogger.new

# Add helper method to Rails
module LoggerHelper
  def app_logger
    $custom_logger
  end
end

# Include in ApplicationController and models
ActiveSupport.on_load(:action_controller) do
  include LoggerHelper
end

ActiveSupport.on_load(:active_record) do
  include LoggerHelper
end

# Configure Rails logger
if Rails.env.production?
  Rails.logger = Logger.new(STDOUT)
  Rails.logger.level = Logger::INFO
else
  Rails.logger.level = Logger::DEBUG
end

# Log rotation for Rails default logger
if Rails.env.production?
  Rails.application.config.logger = ActiveSupport::Logger.new(
    Rails.root.join('log', "#{Rails.env}.log"),
    10, # Keep 10 files
    10_485_760 # 10MB each
  )
end

# Log startup info
Rails.application.config.after_initialize do
  $custom_logger.info("=" * 50)
  $custom_logger.info("🐾 Pet Marketplace Server Starting")
  $custom_logger.info("Environment: #{Rails.env}")
  $custom_logger.info("Ruby version: #{RUBY_VERSION}")
  $custom_logger.info("Rails version: #{Rails.version}")
  $custom_logger.info("Stripe configured: #{ENV['STRIPE_SECRET_KEY'].present?}")
  $custom_logger.info("=" * 50)
end