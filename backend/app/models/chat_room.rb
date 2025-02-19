class ChatRoom < ApplicationRecord
    belongs_to :deed
    has_many :messages, dependent: :destroy
  
    # ✅ Only requester & volunteers can participate
    def participants
      [deed.requester] + deed.volunteers
    end
  end