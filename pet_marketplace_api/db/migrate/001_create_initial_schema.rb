class CreateInitialSchema < ActiveRecord::Migration[7.0]
  def change
    # Create ENUM types
    execute <<-SQL
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status_enum') THEN
          CREATE TYPE order_status_enum AS ENUM (
            'pending',
            'confirmed',
            'processing',
            'shipped',
            'delivered',
            'cancelled',
            'refunded'
          );
        END IF;
      END$$;

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status_enum') THEN
          CREATE TYPE payment_status_enum AS ENUM (
            'pending',
            'paid',
            'failed',
            'refunded',
            'partially_refunded'
          );
        END IF;
      END$$;
    SQL

    # Users table
    create_table :users do |t|
      t.string :email, null: false, index: { unique: true }
      t.string :password_digest, null: false
      t.string :first_name, limit: 100
      t.string :last_name, limit: 100
      t.string :phone, limit: 20
      t.string :role, limit: 20, default: 'user'
      
      t.timestamps
    end
    
    add_index :users, :email

    # Breeders table
    create_table :breeders do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.string :business_name, null: false
      t.string :license_number, limit: 100
      t.boolean :license_verified, default: false
      t.text :description
      t.text :address
      t.string :website
      
      t.timestamps
    end

    # Shelters table
    create_table :shelters do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.string :name, null: false
      t.string :registration_number, limit: 100
      t.text :description
      t.text :address
      t.string :phone, limit: 20
      t.string :email
      t.string :website
      
      t.timestamps
    end

    # Breeds reference table
    create_table :breeds do |t|
      t.string :name, limit: 100, null: false
      t.string :category, limit: 20, null: false
      t.text :description
      t.text :characteristics
      t.string :image_url, limit: 500
    end

    # Pets table
    create_table :pets do |t|
      t.string :name, limit: 100, null: false
      t.string :category, limit: 20, null: false
      t.string :breed, limit: 100
      t.integer :age_months
      t.string :gender, limit: 10
      t.text :description
      t.decimal :price, precision: 10, scale: 2
      t.boolean :is_for_adoption, default: false
      t.references :owner, foreign_key: { to_table: :users }
      t.references :breeder, foreign_key: true
      t.references :shelter, foreign_key: true
      t.string :status, limit: 20, default: 'available'
      t.string :image_url, limit: 500
      
      t.timestamps
    end
    
    add_index :pets, :category
    add_index :pets, :status
    add_index :pets, :is_for_adoption

    # Articles table
    create_table :articles do |t|
      t.string :title, null: false
      t.string :category, limit: 20, null: false
      t.text :content, null: false
      t.references :author, foreign_key: { to_table: :users }
      t.string :image_url, limit: 500
      t.boolean :published, default: false
      
      t.timestamps
    end
    
    add_index :articles, :category

    # Orders table
    create_table :orders do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.decimal :total_price, precision: 10, scale: 2, null: false
      t.text :shipping_address
      t.string :payment_intent_id
      t.string :stripe_session_id
      t.datetime :paid_at
      t.datetime :refunded_at
      
      t.timestamps
    end
    
    # Add ENUM columns separately for PostgreSQL
    execute <<-SQL
      ALTER TABLE orders ADD COLUMN status order_status_enum DEFAULT 'pending';
      ALTER TABLE orders ADD COLUMN payment_status payment_status_enum DEFAULT 'pending';
    SQL
    
    add_index :orders, :payment_intent_id
    add_index :orders, :stripe_session_id
    
    # Add comments
    execute <<-SQL
      COMMENT ON COLUMN orders.payment_status IS 'Status of payment: pending, paid, failed, refunded, partially_refunded';
      COMMENT ON COLUMN orders.payment_intent_id IS 'Stripe payment intent ID';
      COMMENT ON COLUMN orders.stripe_session_id IS 'Stripe checkout session ID';
      COMMENT ON TABLE orders IS 'Orders with inline payment columns';
    SQL

    # Order items table
    create_table :order_items do |t|
      t.references :order, foreign_key: { on_delete: :cascade }
      t.references :pet, foreign_key: true
      t.decimal :price, precision: 10, scale: 2, null: false
    end

    # Adoption applications table
    create_table :adoption_applications do |t|
      t.references :user, foreign_key: { on_delete: :cascade }
      t.references :pet, foreign_key: { on_delete: :cascade }
      t.references :shelter, foreign_key: true
      t.string :status, limit: 20, default: 'pending'
      t.text :message
      t.text :admin_notes
      
      t.timestamps
    end

    # Webhook logs table
    create_table :webhook_logs do |t|
      t.string :event_id, null: false, index: { unique: true }
      t.string :event_type, limit: 100, null: false
      t.jsonb :payload, null: false
      t.datetime :processed_at, default: -> { 'NOW()' }
      t.string :processing_status, limit: 50, default: 'success'
      t.text :error_message
      t.integer :retry_count, default: 0
      
      t.timestamps
    end
    
    add_index :webhook_logs, :event_id
    add_index :webhook_logs, :event_type
    add_index :webhook_logs, :created_at
  end
end