Blacklistv2::Application.routes.draw do

  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users


  authenticated :user do
    root to: 'lists#index', as: :authenticated_root
  end

  root to: 'home#index', as: :unauthenticated_root

  resources :lists  do
    collection do
      get 'user_stat'
      get 'global_stat'
      get 'user_stat_api'
      get 'global_stat_api'
    end
  end

  resources :comments , :only => [:index, :create]

  resources :contacts , :only => [:new, :create]

  resources :votes, :only => [:create], :defaults => {:format => 'json'}
end
