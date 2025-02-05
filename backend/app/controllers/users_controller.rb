class UsersController < ApplicationController
    skip_before_action :authenticate_user, only: [:create, :login] # <-- This allows public access
  
    require 'jwt'
  
    # User Registration (Sign Up)
    def create
        user = User.new(user_params)
      
        if user.save
          token = generate_token(user)
          render json: { 
            message: 'User created successfully', 
            token: token, 
            user: user.as_json(only: [:id, :first_name, :last_name, :email]) # Prevents recursion
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
    end
  
    # User Login
    def login
        user = User.find_by(email: params[:email])
      
        if user&.authenticate(params[:password])
          token = generate_token(user)
          render json: { 
            message: 'Login successful', 
            token: token, 
            user: user.as_json(only: [:id, :first_name, :last_name, :email]) # Prevents recursion issue
          }, status: :ok
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end
      
  
    private
  
    def user_params
        params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation, :id_document)
    end
      
  
    def generate_token(user)
      payload = { user_id: user.id, exp: (Time.now + 24.hours).to_i }
      JWT.encode(payload, Rails.application.secret_key_base, 'HS256')
    end
  end
  