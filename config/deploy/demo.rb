set :default_environment, {
    'PATH' => "$HOME/.rbenv/shims:$HOME/.rbenv/bin:$PATH",
    'JAVA_HOME' => "/usr/lib/jvm/java-6-openjdk"
}

require 'bundler/capistrano'

set :repository, "git@192.168.33.6:valipat/poa.git"
set :branch, "demo"
set :rails_env, "demo"
set :user, "poa"
set :deploy_to, "/srv/www/poa"
set :bundle_without, [:test, :cucumber]
set :default_shell, "/bin/bash --login"
set :application, "poa"

server "192.168.33.11", :app, :web, :sphinx, :db, :primary => true

after "deploy", "deploy:restart"

namespace :deploy do
  task :start, :roles => :app do
    run "cd #{current_path}; bundle exec unicorn_rails -c #{shared_path}/unicorn.rb -E demo -D"
  end

  task :stop, :roles => :app do
    run "[ -f #{shared_path}/pids/unicorn.pid ] && kill -QUIT $(cat #{shared_path}/pids/unicorn.pid)"
  end

  task :restart, :roles => :app do
    stop
    start
  end
end