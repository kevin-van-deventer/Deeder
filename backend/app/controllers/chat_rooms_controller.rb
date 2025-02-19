class ChatRoomsController < ApplicationController
    before_action :authenticate_user!
    before_action :set_chat_room, only: [:show]
  
    def show
      # ✅ Only the requester or a volunteer can access the chat
      unless @chat_room.deed.requester == current_user || @chat_room.deed.volunteers.include?(current_user)        render json: { error: "You are not authorized to join this chat." }, status: :forbidden
        render json: { error: "You are not authorized to join this chat." }, status: :forbidden
        return
      end
  
      render json: { chat_room: @chat_room, messages: @chat_room.messages }
    end
  
    def create
      deed = Deed.find(params[:deed_id])
  
      # ✅ Only create a chat room if the requester or volunteer is involved
      unless deed.requester == current_user || deed.volunteers.include?(current_user)
        render json: { error: "You are not authorized to start this chat." }, status: :forbidden
        return
      end
  
      chat_room = ChatRoom.find_or_create_by(deed: deed)
      render json: { chat_room: chat_room }
    end
  
    private
  
    def set_chat_room
      @chat_room = ChatRoom.find(params[:id])
    end
  end