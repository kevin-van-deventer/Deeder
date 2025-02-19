class ChatRoomChannel < ApplicationCable::Channel
  def subscribed
    @chat_room = ChatRoom.find(params[:id])

    if @chat_room.deed.requester == current_user || @chat_room.deed.volunteers.include?(current_user)
      stream_for @chat_room
    else
      reject
    end
  end

  def receive(data)
    message = @chat_room.messages.create!(content: data["message"], user: current_user)
  end
end
