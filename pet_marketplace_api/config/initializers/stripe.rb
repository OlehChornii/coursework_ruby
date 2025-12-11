# config/initializers/stripe.rb
if ENV['STRIPE_SECRET_KEY'].present?
  Stripe.api_key = ENV['STRIPE_SECRET_KEY']
  Rails.logger.info('✅ Stripe configured')
else
  Rails.logger.warn('⚠️  Stripe not configured')
end