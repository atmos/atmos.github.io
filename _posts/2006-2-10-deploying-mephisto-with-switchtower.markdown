--- 
layout: post
title: Deploying Mephisto with Switchtower
---
Below where i used 'pb%' I'm referencing my local machine, and where I use 'nexus%' I'm referencing my webhost.

Checkout the latest trunk version of mephisto
<pre>
pb% svn co http://techno-weenie.net/svn/projects/mephisto/
pb% cd mephisto/trunk/
pb% cp config/deploy.example.rb config/deploy.rb
</pre>

edit config/deploy.rb suite your tastes, I modified all the following parameters in deploy.rb

<pre>
set :repository, "http://techno-weenie.net/svn/projects/mephisto/trunk"
set :rails_version, 3568
role :web, 'www.atmos.org'
role :app, 'www.atmos.org'
role :db, 'www.atmos.org', :primary => true

set :deploy_to, '/home/atmos/mephisto'

desc "Checks out rails rev ##{rails_version}"
task :after_symlink do
  run <<-CMD
    cd #{current_release} &&
    rake init REVISION=#{rails_version} RAILS_PATH=/home/atmos/rails
  CMD
end
</pre>

You should use ssh keys, otherwise in the following steps your password will
echo back to your terminal.  If you aren't already using ssh keys, read these "SSH Keys 1":http://www-128.ibm.com/developerworks/library/l-keyc.html, "SSH Keys 2":http://www-128.ibm.com/developerworks/library/l-keyc2/, "SSH Keys 3":http://www-128.ibm.com/developerworks/linux/library/l-keyc3/.
<pre>
pb% `eval ssh-agent`; ssh-add ~/.ssh/id_dsa
</pre>

Setup your database.yml, lighttpd.conf, and dispatch.fcgi so it'll work on your remote server, you need to atleast setup your production db info, your lighty config should prolly have absolute pathing, and your dispatch.fcgi should have the correct path to ruby on your remote host.
<pre>
pb% cp config/database.example.yml config/database.yml
</pre>

Next you wanna use switchtower to setup all the remote directories that mephisto will be deploying to.
<pre>
pb% rake remote_exec ACTION=setup
(in /Users/atmos/Source/mephisto/trunk)
loading configuration /opt/local/lib/ruby/gems/1.8/gems/switchtower-0.10.0/lib/switchtower/recipes/standard.rb
loading configuration ./config/deploy.rb
executing task setup
executing "mkdir -p -m 775 /home/atmos/mephisto/releases /home/atmos/mephisto/shared/system &&\n    mkdir -p -m 777 /home/atmos/mephisto/shared/log"
servers: ["www.atmos.org"]
processing command
[www.atmos.org] executing command
command finished
</pre>

Copy files that we want to keep between different mephisto releases to the remote shared directory, also any stylesheets or images used in your stylesheets will be copied to your public/stylesheets/ directory automatically if you create a folder called style under ~/mephisto/shared/
<pre>
scp config/database.yml  www.atmos.org:mephisto/shared/
scp config/lighttpd.conf www.atmos.org:mephisto/shared/
scp public/dispatch.fcgi www.atmos.org:mephisto/shared/
scp ~/mycustomstyle/atmos.css www.atmos.org:mephisto/shared/style/
</pre>

Time to deploy our code, give it a second
<pre>
pb% rake remote_exec ACTION=deploy_with_migrations
(in /Users/atmos/Source/mephisto/trunk)
loading configuration /opt/local/lib/ruby/gems/1.8/gems/switchtower-0.10.0/lib/switchtower/recipes/standard.rb
loading configuration ./config/deploy.rb
executing task deploy
transaction: start
[.... shitload of stuff snipped ....]
transaction: commit
executing task restart
executing "ruby /home/atmos/mephisto/current/script/process/reaper -d /home/atmos/mephisto/current/public/dispatch.fcgi"
servers: ["www.atmos.org"]
processing command
[www.atmos.org] executing command
[out :: www.atmos.org] Couldn't find any process matching: /home/atmos/mephisto/current/public/dispatch.fcgi
command finished
</pre>

You need to "Bootstrap the spinner":http://manuals.rubyonrails.com/read/chapter/100#page268 this first time through so ssh into your remote host.  While your there install mephisto with the provided rake task, start lighty up, and create yourself an initial user.
<pre>
pb% ssh www.atmos.org
nexus% ruby /home/atmos/mephisto/current/script/process/spinner -c '/home/atmos/mephisto/current/script/process/spawner -p 10000 -i 1' -d
nexus% lighttpd -f /home/atmos/mephisto/shared/lighttpd.conf
nexus% cd mephisto/current
nexus% RAILS_ENV="production" rake install_mephisto
(in /home/atmos/mephisto/releases/20060211001603)
nexus% ruby script/console production
Loading production environment.
>> User.create(:login => 'atmos', :email => 'foo@bar.com', :password => 'wewtsauce', :password_confirmation => 'wewtsauce')
=> #<User:0x40aea500 ... @base=#<User:0x40aea500 ...>>, @password="wewtsauce">
>> exit
nexus% exit
Connection to www.atmos.org closed.
pb%
</pre>

Now for good measure restart using remote_exec
<pre>
pb% rake remote_exec ACTION=restart
(in /Users/atmos/Source/mephisto/trunk)
loading configuration /opt/local/lib/ruby/gems/1.8/gems/switchtower-0.10.0/lib/switchtower/recipes/standard.rb
loading configuration ./config/deploy.rb
executing task restart
executing "ruby /home/atmos/mephisto/current/script/process/reaper -d /home/atmos/mephisto/current/public/dispatch.fcgi"
servers: ["www.atmos.org"]
processing command
[www.atmos.org] executing command
[out :: www.atmos.org] Restarting [25053] /usr/bin/ruby1.8 /home/atmos/mephisto/current/public/dispatch.fcgi
[out :: www.atmos.org] Restarting [16136] ruby /home/atmos/mephisto/current/public/dispatch.fcgi
command finished
</pre>

Not just visit your site, www.atmos.org/admin/ in my case.

You might say, "man that's a shitload of stuff to setup just for a fucking weblog..."  However, that's the most energy you're going to put forth for a while.  In a week or two if technoweenie adds some super dope feature...
<pre>
pb% cd ~/Source/mephisto/trunk
pb% rake remote_exec ACTION=deploy_with_migrations
pb%
</pre>

Is your current blog/cms thingie that easy to upgrade?  Likely not. :)
