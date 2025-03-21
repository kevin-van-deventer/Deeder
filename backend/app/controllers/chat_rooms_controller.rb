class ChatRoomsController < ApplicationController
  before_action :authenticate_user
  before_action :set_chat_room, only: [:show]

  def show
    unless @chat_room.deed.requester == current_user || @chat_room.deed.volunteers.include?(current_user)
      render json: { error: "Unauthorized" }, status: :forbidden
      return
    end

    render json: { chat_room: @chat_room, messages: @chat_room.messages }
  end

  def create
    deed = Deed.find(params[:deed_id])
    recipient = User.find(params[:recipient_id])

    unless deed.requester == current_user || deed.volunteers.include?(current_user)
      render json: { error: "Unauthorized" }, status: :forbidden
      return
    end

    chat_room = ChatRoom.find_or_create_by(deed: deed)

    unless [deed.requester, *deed.volunteers].include?(recipient)
      render json: { error: "Recipient is not part of this deed." }, status: :forbidden
      return
    end

    render json: { chat_room: chat_room, messages: chat_room.messages }
  end

  private

  def set_chat_room
    @chat_room = ChatRoom.find(params[:id])
  end
end
