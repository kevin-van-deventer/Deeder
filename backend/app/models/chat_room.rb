class ChatRoom < ApplicationRecord
    belongs_to :deed
    has_many :messages, dependent: :destroy
  
    def participants
      [deed.requester] + deed.volunteers
    end
  end