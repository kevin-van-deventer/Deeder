class DeedCompletion < ApplicationRecord
    belongs_to :deed
    belongs_to :user
    validates :user_id, uniqueness: { scope: :deed_id } # Prevent duplicate confirmations
  end
  