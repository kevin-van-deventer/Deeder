module ApplicationCable
    class Connection < ActionCable::Connection::Base
      identified_by :current_user
  
      def connect
        self.current_user = find_verified_user
        logger.add_tags "ActionCable", "User #{current_user.id}" # ✅ Log successful connection
        logger.info "[ActionCable] WebSocket connection established for user #{current_user.id}"
      end
  
      private
  
      def find_verified_user
        token = request.params[:token]
        if (token)
          decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })[0]
          user_id = decoded_token["user_id"]
          verified_user = User.find_by(id: user_id)
          return verified_user if verified_user
        end
        reject_unauthorized_connection
      rescue JWT::ExpiredSignature, JWT::DecodeError
        reject_unauthorized_connection
      end
  end
end
  