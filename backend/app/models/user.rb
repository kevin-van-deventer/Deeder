class User < ApplicationRecord
    has_secure_password # Enables bcrypt for authentication
    has_one_attached :id_document # Uses Active Storage for file uploads

    validates :first_name, :last_name, :email, presence: true
    validates :email, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }

    # require "active_storage/validations"

    validates :id_document, content_type: ['image/png', 'image/jpeg', 'application/pdf'], size: { less_than: 5.megabytes }

    has_many :requested_deeds, foreign_key: :requester_id, class_name: 'Deed'
    has_many :completed_deeds, foreign_key: :completed_by_id, class_name: 'Deed'

    has_many :deed_volunteers
    has_many :volunteered_deeds, through: :deed_volunteers, source: :deed

end 