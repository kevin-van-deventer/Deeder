class MessagesController < ApplicationController
    before_action :authenticate_user
  
    def create
      chat_room = ChatRoom.find(params[:chat_room_id])
  
      unless chat_room.participants.include?(current_user)
        render json: { error: "Unauthorized" }, status: :forbidden
        return
      end
  
      message = chat_room.messages.create(user: current_user, content: params[:content])
      if message.persisted?
        ChatRoomChannel.broadcast_to(chat_room, message.as_json)
        render json: message, status: :created
      else
        render json: { error: message.errors.full_messages }, status: :unprocessable_entity
      end
    end
  end
  