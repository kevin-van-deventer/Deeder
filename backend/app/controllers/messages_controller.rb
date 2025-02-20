class MessagesController < ApplicationController
    before_action :authenticate_user
  
    def create
      chat_room = ChatRoom.find(params[:chat_room_id])
      # @message = @chat_room.messages.create(message_params.merge(user_id: current_user.id))
  
      unless chat_room.participants.include?(current_user)
        render json: { error: "Unauthorized" }, status: :forbidden
        return
      end
  
      message = chat_room.messages.create(user: current_user, content: params[:content])

      if message.save
        # Broadcast the message to the channel
      ChatRoomChannel.broadcast_to(chat_room, {
        # content: @message.content,
        sender_id: message.user_id,
        created_at: message.created_at
      })
        render json: message, status: :created
      else
        render json: { error: message.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  