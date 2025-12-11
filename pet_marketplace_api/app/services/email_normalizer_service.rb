# app/services/email_normalizer_service.rb
class EmailNormalizerService
  GMAIL_DOMAINS = ['gmail.com', 'googlemail.com'].freeze
  
  class << self
    def normalize(email)
      return nil if email.blank?
      
      email = email.to_s.downcase.strip
      local, domain = email.split('@')
      
      return email unless local && domain
      
      # Gmail-specific normalization
      if GMAIL_DOMAINS.include?(domain)
        # Remove dots from local part
        local = local.gsub('.', '')
        # Remove everything after +
        local = local.split('+').first
        # Always use gmail.com
        domain = 'gmail.com'
      end
      
      "#{local}@#{domain}"
    end
  end
end