--- 
wordpress_id: 51
layout: post
title: Multi Environment Merb+DM Deployment with Vlad+Git
wordpress_url: http://atmos.org/?p=51
---
[Capistrano](http://capify.org) is one of those tools that came
along that changed the way people deploy code.  People went from whatever crazy
ass steps they took to push out new code to a formal, repeatable, and automated
process that pretty much any developer on a team could execute.  Your config
files are in ruby, it hooks into rails easily, we use capistrano to deploy the
650 or so applications that are live at [Engine Yard](http://engineyard.com),
what's not to love?  Over the last 18 months or so capistrano has matured, as
well as the underlying libraries it uses for communication, net-ssh and
net-sftp.  We ran into a handful of hiccups during this maturation that left a
bad taste in my mouth, mainly net-ssh weirdness or incompatibilities between
version 1.x and 2.x.  We had to support a LOT of capistrano deployments and
often times I'd find myself uninstalling cap and it's dependencies so I could
install the versions required for whatever client I was helping.

So a few months ago when I had to write a deployment recipe for one of our merb
apps I figured I'd try something new.  A while back the 
[Ruby Hit Squad](http://rubyhitsquad.com/) guys released 
[Vlad](http://rubyhitsquad.com/Vlad_the_Deployer.html), a
rake+ssh+open4 based deployment tool, and I figured it was finally worth
investigating.  We were already running merb+dm+jquery so I figured we might as
well continue with the anti-rails-stack approach. ;)  All I really needed was
support for the following:

* multiple environments
* ability to tail merb logs
* maintenance page during deploy
* interface with the god process manager
* optionally run migrations associated with this code push

After sifting through the documentation I figured out all of this was going to be possible.  Vlad extends the concept of a rake task with "remote_task".  They work like regular rake tasks for the most part, but you specify a array of :roles to the task to indicate which hosts the task should run on.  Inside of these tasks you can do things like execute commands with 'run' and upload files to the server with 'put'.  These remote tasks are your interface to actions on your servers.

DataMapper and Vlad don't play well together because of variable namespacing
issues with the word :repository, you'll need my 
[fork of vlad](http://github.com/atmos/vlad/tree/master) which
addresses this issue and adds support for god, merb, and maintenance pages.

To install my version of vlad is quite easy.

<script src="http://gist.github.com/17983.js">
</script> 

You also need to add the following line to the Rakefile in your merb root.

<script src="http://gist.github.com/17981.js">
</script>

I whipped up a recipe similar to following.  The contents of which belong in
config/deploy.rb in your app.

<script src="http://gist.github.com/17913.js">
</script>

If you're familiar with ruby or capistrano configs, you should be able to parse
this file.

The first thing you'll notice is a bunch of "set <strong>:</strong>symbol,
value" style calls, these setup variables for your deployment.  Two things
might stand out to the seasoned vet, we use a :code_repo variable instead of
<strong>:</strong>repository and the <strong>:</strong>revision is being set to
"origin/master".   The :code_repo stuff has to do with the aforementioned
DataMapper conflicts.  The :revision being set to the remote git branch is
simply legacy from being written with other scms in mind.

Next up are the two task definitions for :production/:staging, these setup
variables that are specific to the environment you're deploying to.

* **:app** is a place where an appserver runs, think where your mongrels or thin processes run, you can have a few these.
* **:deploy_host** is where your code is checked out, at EY we checkout code to a shared drive that all hosts in the environment have access to.  This way we only checkout once.
* **:merb_env** is the environment merb should be invoked with for things like migrations or 'merb -r' type stuff


Then there's three tasks that really are just for convenience and one that's important


'**deploy**' - A quick deployment to the specified environment, maintenance page goes up during checkout, god restarts your merbs on complete, maintenance page is removed.
'**long_deploy**' - Same as deploy above but also runs datamapper migrations for your app
'**tail**' - Tail the merb logs on all appservers
'**define_roles**' avoids the duplication of adding web and db for the :production/:environment roles, it's a useful rake task dep.  It basically says "run migrations and drop the maintenance file on this server", but it also makes sure you specify an environment before you run a deploy/long_deploy/tail.

Since you can chain rake tasks on the command line a deployment ends up taking the form of either:

* rake &lt;environment&gt; long_deploy
* rake &lt;environment&gt; deploy

So to deploy to staging you do this:

* rake staging long_deploy
* rake staging deploy ([example output](http://gist.github.com/17976) when run with --trace)


That's really all there is to it.  If you ever get errors, remember that rake
takes a --trace option.  If you have a daemon like sphinx, for example, it's
trivial to add a namespace :sphinx with a bunch of remote tasks.  Those remote
tasks might just call the appropriate rake tasks on the remote host, but you
can add them trivially to the list of dependencies for the :deploy task while
easily identifying the order in which all of the remote tasks will be executed.
In fact, the changes in my vlad fork are refactorings of namespace extensions
that I had created in my deploy.rb

For me, vlad has been cool, simple, and reliable.  Three things that make me smile. :)
