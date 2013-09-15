##### Server specific settings #####
set :deploy_to, "/srv/www/blacklist"
set :rails_env, "production"
set :branch, "production"
set :user, "blacklist"
set :application, "blacklist"
set :bundle_without, [:test, :cucumber, :development]
set :default_environment, { 'PATH' => "/home/blacklist/.rbenv/shims:/home/blacklist/.rbenv/bin:$PATH", 'JAVA_HOME' => "/usr/lib/jvm/java-6-sun/" }

### Serversettings and roles
# AppServer
server "54.229.155.71", :app, :db, :webserver, :primary => true

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