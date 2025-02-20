module ApplicationCable
  class Connection < ActionCable::Connection::Base
    identified_by :current_user

    def connect
      self.current_user = find_verified_user
      logger.add_tags "ActionCable", current_user.id
    end

    private

    def find_verified_user
      token = request.params[:token]

      if token.present?
        begin
          decoded_token = JWT.decode(token, Rails.application.secret_key_base, true, algorithm: 'HS256')[0]
          user = User.find_by(id: decoded_token["user_id"])

          return user if user.present?
        rescue JWT::DecodeError
          Rails.logger.warn "Invalid JWT Token: Connection rejected"
        end
      end

      reject_unauthorized_connection
    end
  end
end