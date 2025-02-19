class Message < ApplicationRecord
  belongs_to :chat_room
  belongs_to :user
  validates :content, presence: true

  after_create_commit { broadcast_message }

  private

  def broadcast_message
    return unless content.present?
    ChatRoomChannel.broadcast_to(chat_room, {
      sender_id: user.id,
      content: content
    })
  end

  def render_message
    ApplicationController.renderer.render(partial: 'messages/message', locals: { message: self })
  end
end
