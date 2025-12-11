# app/services/stripe_service.rb
class StripeService
  def self.create_checkout_session(items:, order_id:, email:)
    # Побудова line_items для Stripe
    line_items = items.map do |item|
      {
        price_data: {
          currency: "uah", # або "usd" — залежить від вашого продукту / конфігурації
          product_data: {
            name: item[:name] || item["name"],
            description: item[:description] || item["description"]
          },
          unit_amount: (item[:price].to_f * 100).to_i # копійки/копійки
        },
        quantity: 1
      }
    end

    session = Stripe::Checkout::Session.create(
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: line_items,
      customer_email: email,
      metadata: {
        order_id: order_id.to_s
      },
      success_url: ENV.fetch("FRONTEND_URL", "http://localhost:3000") + "/checkout/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: ENV.fetch("FRONTEND_URL", "http://localhost:3000") + "/checkout/cancel"
    )

    session
  end
end