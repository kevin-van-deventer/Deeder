module ApplicationCable
    class Connection < ActionCable::Connection::Base
      identified_by :current_user
  
      def connect
        self.current_user = find_verified_user
        # logger.add_tags "ActionCable", current_user.id
      end
  
      private
  
      def find_verified_user
        token = request.params[:token]
  
        if token.present?
          begin
            decoded_token = JWT.decode(token, Rails.application.secrets.secret_key_base, true, algorithm: 'HS256')
          user_id = decoded_token[0]["user_id"]
            if verified_user = User.find_by(id: user_id)
              return verified_user
            end
  
            # return user if user.present?
          rescue JWT::DecodeError
            reject_unauthorized_connection
          end
        end
  
        reject_unauthorized_connection
      end
    end
  end
  