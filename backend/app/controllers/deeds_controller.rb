class DeedsController < ApplicationController
    before_action :authenticate_user, except: [:index, :show]
    before_action :set_deed, only: [:destroy, :repost]
  
    # List all unfulfilled deeds
    def index
      if params[:user_id] # Check if fetching deeds for a specific user
        user = User.find(params[:user_id])
        deeds = user.requested_deeds.includes(:volunteers, :completed_by)
        # deeds = user.requested_deeds + user.volunteered_deeds
        # render json: deeds
      else
        deeds = Deed.includes(:volunteers).where("status = ? AND created_at >= ?", "unfulfilled", 24.hours.ago) # Default: only unfulfilled deeds
        # deeds = Deed.includes(:volunteers).where(status: 'unfulfilled') # Default: only unfulfilled deeds
      end
    
      render json: deeds.map { |deed| 
      deed.as_json(only: [:id, :description, :deed_type, :latitude, :longitude, :status, :address, :created_at]).merge(
        requester_id: deed.requester_id,
        volunteer_count: deed.volunteers.count,
        volunteers: deed.volunteers.as_json(only: [:id, :first_name, :last_name]),
        completed_by: deed.completed_by.as_json(only: [:id, :first_name, :last_name]),
        completion_status: deed.completion_status
      )
    }
    end
  
    def show
      deed = Deed.includes(:volunteers, :completed_by).find(params[:id])
    
      render json: deed.as_json(only: [:id, :description, :deed_type, :latitude, :longitude, :status, :created_at, :address])
                      .merge(
                        requester_id: deed.requester_id,
                        volunteer_count: deed.volunteers.count,
                        volunteers: deed.volunteers.as_json(only: [:id, :first_name, :last_name]),
                        completed_by: deed.completed_by&.as_json(only: [:id, :first_name, :last_name]),
                        completion_status: deed.completion_status
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
      @deed = Deed.find(params[:id])
  
      if @deed.destroy
        ActionCable.server.broadcast("deeds_channel", {
          unfulfilled_count: Deed.where(status: "unfulfilled").count,
          deeds: Deed.where(status: "unfulfilled")
        }) # ✅ Broadcast updated count
        head :no_content
      else
        render json: { error: "Failed to delete deed" }, status: :unprocessable_entity
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

        # ActionCable.server.broadcast("deeds_channel", {
        #   message: "#{@current_user.first_name} volunteered for a deed!",
        #   deed_id: deed.id,
        #   volunteer_count: deed.volunteers.count,
        #   volunteers: deed.volunteers.as_json(only: [:id, :first_name, :last_name])
        # })

        render json: { message: 'You have volunteered for this deed', deed: deed }, status: :ok
    end
  
    # Get deeds a user volunteered for
    # GET /users/:user_id/volunteered_deeds
    def volunteered_deeds
      user = User.find(params[:user_id])
      deeds = user.volunteered_deeds.includes(:requester, :completed_by)

      render json: deeds.map { |deed|
        deed.as_json(only: [:id, :description, :deed_type, :latitude, :longitude, :status, :address, :created_at, :completed_by_id]).merge(
          requester: deed.requester.as_json(only: [:id, :first_name, :last_name]),
          completed_by: deed.completed_by&.as_json(only: [:id, :first_name, :last_name])
        )
      }
    end

    # Mark a deed as completed by both users
    def complete
      deed = Deed.find(params[:id])
      user = @current_user

      return render json: { error: 'This deed is already completed' }, status: :unprocessable_entity if deed.status == 'fulfilled'

      # Ensure only the requester or a volunteer can confirm
      unless deed.requester_id == user.id || deed.volunteers.include?(user)
        return render json: { error: "You are not authorized to confirm this deed." }, status: :forbidden
      end

      # Create or update confirmation
      completion = DeedCompletion.find_or_initialize_by(deed: deed, user: user)
      completion.confirmed = true
      completion.save!

      # If both requester and volunteer confirmed, mark deed as fulfilled
      if deed.fully_confirmed?
        volunteer = deed.deed_completions.where.not(user_id: deed.requester_id).first&.user
        deed.update!(status: 'fulfilled', completed_by_id: volunteer.id)
        return render json: { message: "Deed fully confirmed and marked as completed!", deed: deed }, status: :ok
      end

      render json: { message: "Your confirmation has been recorded. Waiting for the other party to confirm.", deed: deed }, status: :ok
    end

    def confirm_completion
      deed = Deed.find(params[:id])
      volunteer = current_user
  
      # Check if user is a volunteer for this deed
      unless deed.volunteers.include?(volunteer)
        return render json: { error: "You are not a volunteer for this deed" }, status: :forbidden
      end
  
      # Mark deed completion
      completion = deed.deed_completions.find_or_initialize_by(user: volunteer)
      completion.confirmed = true
      completion.save!
  
      # Check if deed should now be marked as fulfilled
      deed.fully_confirmed?
  
      render json: { message: "Completion confirmed", completion_status: deed.completion_status }
    end

    # Repost a deed by updating its created_at timestamp
    def repost
      if @deed.requester_id == @current_user.id
        @deed.update(created_at: Time.current)
        render json: { message: "Deed reposted successfully for another 24 hours." }, status: :ok
      else
        render json: { error: "You can only repost your own deeds." }, status: :unauthorized
      end
    end

    def deed_params
      params.require(:deed).permit(:description, :deed_type, :status, :latitude, :longitude, :address, :created_at)
    end
  end
  