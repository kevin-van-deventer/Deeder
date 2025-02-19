Rails.application.routes.draw do
  mount ActionCable.server => "/cable"

  # User Routes
  resources :users, only: [:create, :show, :update] do
    resources :deeds, only: [:index, :create, :show, :destroy] # User-specific deeds
    get 'volunteered_deeds', to: 'deeds#volunteered_deeds' # Fetch deeds user volunteered for
  end

  get '/users/:id', to: 'users#show'
  
  # resources :deeds do
  #   member do
  #     post 'complete'
  #   end
  # end
  
  # Routes for deeds that aren't tied to a specific user
  # General Deed Routes
  resources :deeds, only: [:index, :create, :show, :destroy] do
    member do
      post 'complete' # Mark deed as complete (by both requester and volunteer)
      post 'volunteer' # Volunteer for a deed
      post 'repost'  # Creates a route like POST /deeds/:id/repost
      # post: 'confirm_completion'
    end
  end

  # resources :chat_rooms, only: [:create, :show]

  # Authentication
  post '/login', to: 'users#login'

end
