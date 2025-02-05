class Deed < ApplicationRecord

    before_validation :set_default_status, on: :create

    def set_default_status
    self.status ||= "unfulfilled"
    end

    belongs_to :requester, class_name: 'User'
    belongs_to :completed_by, class_name: 'User', optional: true
  
    has_many :deed_volunteers
    has_many :volunteers, through: :deed_volunteers, source: :user
  
    validates :description, presence: true, length: { maximum: 300 }
    validates :deed_type, inclusion: { in: ["one-time", "material"] }
    validates :status, inclusion: { in: ["fulfilled", "unfulfilled"] }
  end
  