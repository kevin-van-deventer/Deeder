# module ApplicationCable
#   class Connection < ActionCable::Connection::Base
#     identified_by :current_user

#     def connect
#       self.current_user = find_verified_user
#       logger.add_tags "ActionCable", current_user.id
#     end

#     private

#     def find_verified_user
#       token = request.params[:token]

#       if token.present?
#         begin
#           decoded_token = JWT.decode(token, Rails.application.credentials.secret_key_base, true, { algorithm: 'HS256' })[0]
#           user = User.find_by(id: decoded_token["user_id"]) || reject_unauthorized_connection

#           return user if user.present?
#         rescue JWT::ExpiredSignature
#           reject_unauthorized_connection
#         rescue JWT::DecodeError
#           reject_unauthorized_connection
#         end
#       end
#       reject_unauthorized_connection
#     end
#   end
# end