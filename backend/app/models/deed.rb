class Deed < ApplicationRecord

    before_validation :set_default_status, on: :create

    def set_default_status
    self.status ||= "unfulfilled"
    end

    belongs_to :requester, class_name: 'User'
    belongs_to :completed_by, class_name: 'User', optional: true
  
    # confirm if both requester and deeder mark deed as fulfilled
    has_many :deed_completions, dependent: :destroy
    has_many :volunteers, through: :deed_completions, source: :user
    def requester_confirmed?
      deed_completions.exists?(user_id: requester_id, confirmed: true)
    end
    def volunteer_confirmed?
      deed_completions.where.not(user_id: requester_id).where(confirmed: true).exists?
    end
    def fully_confirmed?
      requester_confirmed? && volunteer_confirmed?
    end


    has_many :deed_volunteers
    has_many :volunteers, through: :deed_volunteers, source: :user
  
    validates :description, presence: true, length: { maximum: 300 }
    validates :deed_type, inclusion: { in: ["one-time", "material"] }
    validates :status, inclusion: { in: ["fulfilled", "unfulfilled"] }
    validates :latitude, :longitude, presence: true
    validates :address, presence: true # Ensure an address is always included
  end
  