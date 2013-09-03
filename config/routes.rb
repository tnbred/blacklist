Blacklistv2::Application.routes.draw do
  devise_for :admin_users, ActiveAdmin::Devise.config
  ActiveAdmin.routes(self)
  devise_for :users


  authenticated :user do
    root to: 'lists#index', as: :authenticated_root
  end

  root to: 'home#index', as: :unauthenticated_root

  resources :lists
end
