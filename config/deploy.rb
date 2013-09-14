set :default_stage, :staging
set :stages, %w(demo staging production)

# Server config
set :repository, "git@git.belighted.com:valipat/poagenerator.git"
set :ssh_options, {:forward_agent => true}
set :use_sudo, false
set :keep_releases, 5

# Git config
set :scm, :git
set :scm_verbose, true
#set :deploy_via, :remote_cache
set :git_enable_submodules, 1
set :normalize_asset_timestamps, false



### Callbacks
# Maintenance on

# Symplinks, cron & db dump
after "deploy:finalize_update", "deploy:symlink_directories_and_files"
after "deploy:symlink", "deploy:update_database_cronjobs"

# Maintenance off

namespace :deploy do
  %w(start restart).each { |name| task name do passenger.restart end }

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

  desc 'Update the database cronjobs'
  task :update_database_cronjobs, :roles => :db do
    run "cd #{release_path} && bundle exec whenever --update-crontab #{application}_#{rails_env} --set 'environment=#{rails_env}&role=database'"
  end

end
namespace :maintenance do
  desc 'Disable the application and show the maintenance page'
  task :enable, :roles => :app do
    run "cp #{current_path}/public/maintenance.html #{shared_path}/system/maintenance.html"
  end

  desc 'Enable the application and remove the maintenance page'
  task :disable, :roles => :app do
    run "rm #{shared_path}/system/maintenance.html"
  end
end

namespace :passenger do
  desc 'Restart the application'
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end
end

namespace :db do
  desc 'Dump the database to db/<env>_data.sql on the remote server'
  task :remote_dump, :roles => :db do
    run "cd #{current_path} && " + "bundle exec rake RAILS_ENV=#{rails_env} db:dump[\"/tmp/db_dump_poa_#{rails_env}.sql\"]"
  end
end

namespace :delayed_jobs do
  desc 'Start delayed_job daemon'
  task :start do
    run "cd #{current_path} && RAILS_ENV=#{rails_env} bundle exec script/delayed_job start --number_of_workers=5 --prefix poagen-#{rails_env}"
  end

  desc 'Stop delayed_job daemon'
  task :stop do
    run "cd #{current_path} && RAILS_ENV=#{rails_env} bundle exec script/delayed_job stop"
  end
end

require './config/boot'
require 'airbrake/capistrano'
