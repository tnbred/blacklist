set :default_stage, :production
set :stages, %w(demo staging production)

# Server config
set :repository, "git@54.229.155.71:root/blacklist.git"
set :ssh_options, {:forward_agent => true}
set :use_sudo, false
set :keep_releases, 5
set :application, "blacklist"

# Git config
set :scm, :git
set :scm_verbose, true
#set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :normalize_asset_timestamps, false

require 'capistrano/ext/multistage'
require 'bundler/capistrano'


### Callbacks

# Symplinks, cron & db dump
after "deploy:finalize_update", "deploy:symlink_directories_and_files"


namespace :deploy do

  desc 'Symlink shared directories and files'
  task :symlink_directories_and_files do
    run "mkdir -p #{shared_path}/config"
    run "mkdir -p #{shared_path}/data/logos"
    run "mkdir -p #{shared_path}/data/private_assets"
    run "ln -s #{shared_path}/config/database.yml #{release_path}/config/database.yml"
    run "ln -s #{shared_path}/bundle/.bundle #{release_path}/.bundle"
    run "ln -s #{shared_path}/data/logos #{release_path}/public/"
    run "ln -s #{shared_path}/data/private_assets #{release_path}/private_assets"
  end
end