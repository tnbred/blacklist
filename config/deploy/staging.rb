##### Server specific settings #####
set :deploy_to, "/var/www/poa_stage"
set :rails_env, "staging"
set :branch, "master"
set :user, "poa_stage"
set :application, "poa_stage"
set :bundle_without, [:test, :cucumber, :development]
set :default_environment, { 'PATH' => "/home/poa_stage/.rbenv/shims:/home/poa_stage/.rbenv/bin:$PATH", 'JAVA_HOME' => "/usr/lib/jvm/java-6-sun/" }

### Serversettings and roles
# AppServer
role :app, "109.75.181.33", :primary => true
role :app, "109.75.181.35"

# Database
role :db, "109.75.181.33", :primary => true

# Web
role :web, "109.75.181.33", :primary => true
role :web, "109.75.181.35"