class ApplicationController < ActionController::API
    before_action :authenticate_user
    before_action :set_cors_headers

    attr_reader :current_user
    
        def authenticate_user
            header = request.headers['Authorization']
            token = header.split(' ').last if header
            begin
                decoded = JWT.decode(token, Rails.application.secret_key_base)[0]
                @current_user = User.find(decoded["user_id"])
            rescue ActiveRecord::RecordNotFound, JWT::DecodeError
                render json: { error: 'Unauthorized' }, status: :unauthorized
        end

        def set_cors_headers
            response.set_header('Access-Control-Allow-Origin', 'https://deeder.vercel.app')
            response.set_header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD')
            response.set_header('Access-Control-Allow-Headers', 'Origin, Content-Type, Accept, Authorization, X-Requested-With')
            response.set_header('Access-Control-Allow-Credentials', 'true')  # If using authentication
        end

    end
end
