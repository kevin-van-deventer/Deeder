class DeedVolunteer < ApplicationRecord
    belongs_to :user
    belongs_to :deed
  
    validates :user_id, uniqueness: { scope: :deed_id, message: "has already volunteered for this deed" }
  end
  