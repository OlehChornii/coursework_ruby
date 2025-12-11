# app/controllers/api/v1/articles_controller.rb
module Api
  module V1
    class ArticlesController < ApplicationController
      skip_before_action :authenticate_user!, only: [:index, :show]
      before_action :set_article, only: [:show, :update, :destroy]
      
      def index
        articles = Article.published.includes(:author)
        articles = articles.by_category(params[:category]) if params[:category].present?
        articles = articles.recent
        
        articles_data = articles.map do |article|
          article.as_json.merge(
            author_first_name: article.author.first_name,
            author_last_name: article.author.last_name
          )
        end
        
        render json: articles_data
      end
      
      def show
        article_data = @article.as_json.merge(
          author_first_name: @article.author.first_name,
          author_last_name: @article.author.last_name
        )
        render json: article_data
      end
      
      def create
        article = Article.new(article_params)
        article.author = current_user
        
        if article.save
          render json: article, status: :created
        else
          render json: { error: article.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      def update
        require_owner!(@article)
        
        if @article.update(article_params)
          render json: @article
        else
          render json: { error: @article.errors.full_messages.join(', ') }, status: :bad_request
        end
      end
      
      def destroy
        require_owner!(@article)
        
        if @article.destroy
          render json: { message: 'Article deleted successfully' }
        else
          render json: { error: 'Failed to delete article' }, status: :bad_request
        end
      end
      
      private
      
      def set_article
        @article = Article.find(params[:id])
      end
      
      def article_params
        params.permit(:title, :category, :content, :image_url, :published)
      end
    end
  end
end