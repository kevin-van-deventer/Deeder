class ChatRoom < ApplicationRecord
  belongs_to :deed
  has_many :messages, dependent: :destroy

  # ✅ Get the requester and all volunteers as participants
  def participants
    [deed.requester] + deed.volunteers
  end
end
