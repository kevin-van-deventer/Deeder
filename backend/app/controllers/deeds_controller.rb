class DeedsController < ApplicationController
    before_action :authenticate_user, except: [:index]
  
    # List all unfulfilled deeds
    def index
      deeds = Deed.includes(:volunteers).where(status: 'unfulfilled')
      render json: deeds.to_json(include: { volunteers: { only: [:id, :first_name, :last_name] } })
    end
  
    # Create a new deed
    def create
      deed = @current_user.requested_deeds.build(deed_params)
      if deed.save
        render json: { message: 'Deed created successfully', deed: deed }, status: :created
      else
        render json: { errors: deed.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # Volunteer for a deed
    def volunteer
      deed = Deed.find(params[:id])
  
      if deed.volunteers.include?(@current_user)
        render json: { error: 'You have already volunteered for this deed' }, status: :unprocessable_entity
      else
        deed.volunteers << @current_user
        render json: { message: 'You have volunteered for this deed', deed: deed }, status: :ok
      end
    end
  
    # Mark a deed as completed
    def complete
      deed = Deed.find(params[:id])
  
      if deed.status == 'fulfilled'
        render json: { error: 'This deed is already completed' }, status: :unprocessable_entity
      else
        deed.update(status: 'fulfilled', completed_by_id: @current_user.id)
        render json: { message: 'Deed marked as completed', deed: deed }, status: :ok
      end
    end
  
    private
  
    def deed_params
        params.require(:deed).permit(:description, :deed_type, :status)
      end
      
  end
  