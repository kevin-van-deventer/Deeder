Rails.application.routes.draw do

  resources :users, only: [:create, :show, :update] do
    resources :deeds, only: [:index, :create, :show, :destroy]
  end

  post '/login', to: 'users#login'

  # Routes for deeds that aren't tied to a specific user
  resources :deeds, only: [:index, :create, :show, :destroy]
  post '/deeds/:id/volunteer', to: 'deeds#volunteer'
  post '/deeds/:id/complete', to: 'deeds#complete'
  post "/deeds/:id/fulfill", to: "deeds#fulfill"
  

  # get '/users/:user_id/deeds', to: 'deeds#index' # Fetch all deeds by user
end
