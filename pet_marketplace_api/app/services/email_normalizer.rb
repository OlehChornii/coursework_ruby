# app/services/email_normalizer.rb
class EmailNormalizer
  GMAIL_DOMAINS = ['gmail.com', 'googlemail.com'].freeze
  
  class << self
    def normalize(email)
      return nil if email.blank?
      
      email = email.to_s.downcase.strip
      local, domain = email.split('@')
      
      return email unless local && domain
      
      if GMAIL_DOMAINS.include?(domain)
        local = local.gsub('.', '').split('+').first
        domain = 'gmail.com'
      end
      
      "#{local}@#{domain}"
    end
  end
end