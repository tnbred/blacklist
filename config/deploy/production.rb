##### Server specific settings #####
set :deploy_to, "/var/www/blacklist"
set :rails_env, "production"
set :branch, "production"
set :user, "blacklist"
set :application, "blacklist"
set :bundle_without, [:test, :cucumber, :development]
set :default_environment, { 'PATH' => "/home/blacklist/.rbenv/shims:/home/blacklist/.rbenv/bin:$PATH", 'JAVA_HOME' => "/usr/lib/jvm/java-6-sun/" }

### Serversettings and roles
# AppServer
server "54.229.155.71", :app, :db, :webserver