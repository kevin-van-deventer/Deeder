class Deed < ApplicationRecord
    after_commit :broadcast_deeds_update, on: [:create, :update, :destroy]

    def broadcast_deeds_update
      unfulfilled_deeds = Deed.where(status: "unfulfilled")
      ActionCable.server.broadcast("deeds_channel", {
        unfulfilled_count: unfulfilled_deeds.count,
        deeds: unfulfilled_deeds.as_json(only: [:id, :description, :deed_type, :status, :address], methods: [:latitude_float, :longitude_float])
      })
    end

    # Add these methods to convert database fields to floats explicitly
    def latitude_float
      latitude.to_f
    end

    def longitude_float
      longitude.to_f
    end
    

    before_validation :set_default_status, on: :create

    def set_default_status
      self.status ||= "unfulfilled"
    end

    belongs_to :requester, class_name: 'User'
    belongs_to :completed_by, class_name: 'User', optional: true
  
    # confirm if both requester and deeder mark deed as fulfilled
    has_many :deed_completions, dependent: :destroy
    has_many :volunteers, through: :deed_completions, source: :user

    has_many :deed_volunteers
    has_many :volunteers, through: :deed_volunteers, source: :user

    has_one :chat_room, dependent: :destroy
  
    validates :description, presence: true, length: { maximum: 300 }
    validates :deed_type, inclusion: { in: ["one-time", "material"] }
    validates :status, inclusion: { in: ["fulfilled", "unfulfilled"] }
    validates :latitude, :longitude, presence: true
    validates :address, presence: true
    # Ensure at least 5 volunteers are assigned

    def enough_volunteers_confirmed?
      deed_completions.where(confirmed: true).count >= 5
    end
  
    # 🔹 Only mark the deed as fulfilled when 5+ volunteers confirm
    def fully_confirmed?
      if enough_volunteers_confirmed?
        update(status: "fulfilled")  # ✅ Auto-update status when condition is met
        broadcast_deeds_update
        return true
      end
      false
    end
  
    # 🔹 Dynamic method to show "Complete" or "In Progress" in the frontend
    def completion_status
      enough_volunteers_confirmed? ? "Complete" : "In Progress"
    end

    

  end
  