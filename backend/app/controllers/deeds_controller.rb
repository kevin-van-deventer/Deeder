class DeedsController < ApplicationController
    before_action :authenticate_user, except: [:index, :show]
    before_action :set_deed, only: [:destroy]
  
    # List all unfulfilled deeds
    def index
      if params[:user_id] # Check if fetching deeds for a specific user
        user = User.find(params[:user_id])
        deeds = user.requested_deeds.includes(:volunteers, :completed_by)
        # deeds = user.requested_deeds + user.volunteered_deeds
        # render json: deeds
      else
        deeds = Deed.includes(:volunteers).where(status: 'unfulfilled') # Default: only unfulfilled deeds
      end
    
      render json: deeds.map { |deed| 
      deed.as_json(only: [:id, :description, :deed_type, :latitude, :longitude, :status, :address, :created_at]).merge(
        volunteer_count: deed.volunteers.count,
        volunteers: deed.volunteers.as_json(only: [:id, :first_name, :last_name]),
        completed_by: deed.completed_by.as_json(only: [:id, :first_name, :last_name])
      )
    }
    end
  
    def show
      deed = Deed.includes(:volunteers, :completed_by).find(params[:id])
    
      render json: deed.as_json(only: [:id, :description, :deed_type, :latitude, :longitude, :status, :created_at, :address])
                      .merge(
                        volunteer_count: deed.volunteers.count,
                        volunteers: deed.volunteers.as_json(only: [:id, :first_name, :last_name]),
                        completed_by: deed.completed_by.as_json(only: [:id, :first_name, :last_name])
                      )
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Deed not found" }, status: :not_found
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

    # DELETE /users/:user_id/deeds/:id
    def destroy
      if @deed.requester_id == @current_user.id
        @deed.destroy
        render json: { message: "Deed successfully deleted" }, status: :ok
      else
        render json: { error: "You can only delete deeds you created" }, status: :forbidden
      end
    end

    def set_deed
      @deed = Deed.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      render json: { error: "Deed not found" }, status: :not_found
    end
  
    # Volunteer for a deed
    def volunteer
      deed = Deed.find(params[:id])

      # Ensure the requester can't volunteer for their own deed
      if deed.requester_id == @current_user.id
        render json: { error: "You cannot volunteer for your own deed." }, status: :forbidden
        return
      end
  
       # Check if the user has already volunteered
      if deed.volunteers.include?(@current_user)
        render json: { error: 'You have already volunteered for this deed' }, status: :unprocessable_entity
        return
      end

        # Add the user to the volunteers list
        deed.volunteers << @current_user
        render json: { message: 'You have volunteered for this deed', deed: deed }, status: :ok
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
  
    # private
  
    def deed_params
        params.require(:deed).permit(:description, :deed_type, :status, :latitude, :longitude, :address, :created_at)
      end
      
  end
  