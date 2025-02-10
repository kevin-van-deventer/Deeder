class UsersController < ApplicationController
    skip_before_action :authenticate_user, only: [:create, :show, :update, :login] # <-- This allows public access
  
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
      
      # Fetch user details and display deeds counters
      def show
        user = User.find(params[:id])

        # deeds counter
        fulfilled_deeds = user.requested_deeds.where(status: "fulfilled").count
        unfulfilled_deeds = user.requested_deeds.where(status: "unfulfilled").count
        deeds_fulfilled_for_others = user.completed_deeds.count

        render json: user.as_json(only: [:id, :first_name, :last_name, :email]).merge({
          id_document_url: user.id_document.attached? ? url_for(user.id_document) : nil,
          fulfilled_deeds: fulfilled_deeds,
          unfulfilled_deeds: unfulfilled_deeds,
          deeds_fulfilled_for_others: deeds_fulfilled_for_others
        })
      end

      # Update a users details and file upload
      def update
        user = User.find(params[:id])
      
        if user.update(user_params)
          render json: { message: "User updated successfully", user: user.as_json(only: [:id, :first_name, :last_name, :email]) }
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
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
  