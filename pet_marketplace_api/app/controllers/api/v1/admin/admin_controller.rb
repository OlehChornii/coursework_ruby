# app/controllers/api/v1/admin/admin_controller.rb
module Api
  module V1
    module Admin
      class AdminController < ::ApplicationController
        # Спільні before_action для адмін-простору, якщо потрібно
        before_action :require_admin!, if: -> { respond_to?(:require_admin!, true) }

        private

        # Для безпечного виклику: якщо метод визначений в ApplicationController
        def require_admin!
          super if defined?(super)
        rescue NoMethodError
          # якщо немає реалізації — просто нічого не робимо
        end
      end
    end
  end
end