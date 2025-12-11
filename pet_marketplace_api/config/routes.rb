# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      # Health check
      get 'health', to: 'health#index'
      
      # Users & Authentication
      post 'users/register', to: 'users#register'
      post 'users/login', to: 'users#login'
      post 'users/refresh-token', to: 'users#refresh_token'
      post 'users/logout', to: 'users#logout'
      get 'users/profile', to: 'users#profile'
      put 'users/profile', to: 'users#update_profile'
      post 'users/change-password', to: 'users#change_password'
      
      # Pets
      resources :pets do
        collection do
          get 'category/:category', action: :index_by_category
          get 'breeds/:category', action: :breeds
        end
      end
      
      # Orders
      get 'orders/user', to: 'orders#user_orders'
      resources :orders, only: [:show, :create]
      
      # Payments
      post 'payments/create-session', to: 'payments#create_session'
      post 'payments/webhook', to: 'payments#webhook'
      get 'payments/verify', to: 'payments#verify'
      get 'payments/receipt', to: 'payments#receipt'
      
      # Breeders
      resources :breeders, only: [:index, :show, :create, :update]
      
      # Shelters
      resources :shelters, only: [:index, :show, :create, :update]
      
      # Articles
      resources :articles
      
      # Adoptions
      resources :adoptions, only: [:create, :show] do
        collection do
          get 'user', action: :user_applications
          get 'check/:pet_id', action: :check_existing
        end
        member do
          put 'cancel', action: :cancel
        end
      end
      
      # Admin
      namespace :admin do
        get 'pets/pending', to: 'admin#pending_pets'
        put 'pets/:id/approve', to: 'admin#approve_pet'
        put 'pets/:id/reject', to: 'admin#reject_pet'
        
        get 'adoptions', to: 'admin#adoption_applications'
        put 'adoptions/:id', to: 'admin#update_adoption_status'
        
        put 'breeders/:id/verify', to: 'admin#verify_breeder'
        
        # Analytics
        get 'analytics/overview', to: 'analytics#overview'
        get 'analytics/timeseries', to: 'analytics#timeseries'
        get 'analytics/top-endpoints', to: 'analytics#top_endpoints'
      end
    end
  end
end