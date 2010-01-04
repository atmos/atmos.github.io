--- 
wordpress_id: 155
layout: post
title: Gem Bundling - Where Merb Needs HELP
wordpress_url: http://atmos.org/?p=155
---
<strong>UPDATE</strong>: 

<blockquote>This has been more or less resolved in merb 1.0.6.  It's not too painful to upgrade your apps to it.  Here's the <a href="http://github.com/atmos/flatirons/commit/1f517a36e4067450ee9ed36099498fe0d3da7d3c">flatirons upgrade commit on github.</a>  The new bundling can also be used with older versions of merb.  Check the release notes on <a href="http://yehudakatz.com/2008/12/16/merb-105-and-106/">Yehuda's Blog</blockquote>



Have you ever seen this error?
<div><script src="http://gist.github.com/31460.js"></script></div>
This happens all the time if you follow merb development for a month or two.  The current state of 'supported' merb gem bundling is weak sauce.

Here's three areas I consistently waste time on because I chose merb+dm
<ul>
	<li><strong>Ease of collaboration</strong>.  I stopped counting the number of hours I've lost trying to get a merb app running on a co-workers machine or vice versa.  Once you spend 2-3 hours swearing at version mismatch errors it wears on your drive to believe the software choice is a good decision.</li>
	<li><strong>Ease of deployment</strong>. I bet 9 out of 10 merb developers develop code on some sort of Mac and deploy on a Linux box.  "I stick it in vendor"™ fails miserably when it comes to binary gems.  Think mongrel, hpricot, nokogiri, libxml-ruby, thin, etc; all of these need to be compiled on atleast the same OS.  As a developer I should not care about this issue.</li>
	<li><strong>Ease of Maintenance</strong>.  If I need to install a new gem or update an existing one it shouldn't be a pain in the ass.  Period.</li>
</ul>
Just to be clear, when I talk about merb bundling from here on out, I'm talking specifically about <strong>thor merb:gem:redeploy</strong>.  Our group doesn't use this approach in any of the apps we are in charge of managing at EY currently. Here's why.
<h3>Quick Run Down</h3>
This is how you might use merb bundling.

<script src="http://gist.github.com/31458.js"></script>
 

You're basically given a <strong>gems/</strong> folder with a <strong>cache</strong> and <strong>specifications</strong> folder inside of it.  Thor uses the files in these folders to install the gems on fresh checkouts, or your co-workers machine.  Everything you need, and I mean EVERYTHING, is in that gems/cache folder.  "Rake? Rspec? All 19 or so merb gems?" You bet, they're all in there.  "What if you need to do a minor version bump because merb did a point release?"  Upgrade em all!
<h3>EASE OF COLLABORATION FAIL</h3>
Every time I collaborate with someone on a project where the gems are bundled via merb I feel like we waste 1-2 hours.  If we need to bump a gem version number or add a new dependency, it should be trivial and routinely isn't.  One of my coworkers recently told me "oh it's so easy, <strong>thor merb:gem:redeploy</strong> or <strong>thor merb:gem:rebuild</strong>. Something like that."  If you can't remember the command,  it's not easy.  Every rails user remembers <strong>script/server</strong> and <strong>script/generate</strong>.  You might also hear "Oh! Maybe your merb.thor is outta date!  They changed some namespace stuff, it'll work if you just run this!"
<div><script src="http://gist.github.com/31457.js"></script></div>
.....  You've gotta be kidding me, bonus points if you know what the -L is for.  At least it's pretty well covered on the <a href="http://wiki.merbivore.com/howto/installation/thor">thor wiki page</a>.  If your app is pre 1.0, you might as well generate a new project.  It's like you're being punished for being an early adopter..  By the way, does anyone know why the seattle.rb projects <strong>always</strong> throw errors?
<div><script src="http://gist.github.com/31415.js"></script></div>
<h3>EASE OF DEPLOYMENT FAIL</h3>
When you go to deploy your application, you need to make sure those gems are up to date!  So you run <strong>thor merb:gem:redeploy</strong> on each deployment.  Why does everything reinstall everytime though?  In our production environments we have a gems directory that persists between deployments and only installs gems <strong>as needed</strong>, we symlink this directory into our Merb.root and our deployments are quite fast.  We also don't have to check our gems into our SCM at all, but that's a different story.

If you're into continuous integration you should know that without proper .gitignore files it's really easy to get your CI system into a state where it stops pulling changes.  If your rebuilt gems in gems/ have minor changes, git will exit with a non-zero status and most CI systems(integrity,cc.rb) abort; then they run your OLD CODE.  Since the <strong>specifications</strong> directory must be checked into gems/ for thor bundling to work, you can't even run CI against your app without hacking your CI software...
<h3>EASE OF MAINTENANCE FAIL</h3>
Today I had to help update a co-worker upgrade to a new version of an internal gem.  Here's how we did it, how awesome is this?
<div><script src="http://gist.github.com/31442.js"></script></div>
Updating a gem should not require that much SCM specific interaction.  Checking gems into my SCM makes me want to cry.  I think it'd be really cool to just change a config file and make this happen.  That's not too much to ask, is it?  I definitely see the win involved with "everything you need to get this specific commit up and running is contained in the app" but there has gotta be a better way.  Is merb 1.0.1 gonna go away from the gem servers sometime soon?  Does rubyforge go down so often that checking <strong>EVERY</strong> gem in is a huge win?  Do you really work offline from a fresh repo frequently?

If you have some <strong>CRAZY AWESOME CODE</strong> that you can't open source, setup a gem server.  This might be something that you spin up for the lifetime of your deployment process and <strong>gem install</strong> against, or something behind basic auth that enables multiple developers to collaborate against the exact same versions of private gems.  I like reproducibility as much as the next guy, but checking every gem my app depends on into my repo frustrates me.
<h3>A Temporary Alternative</h3>
Earlier this year, around the merb 0.9.3-0.9.9 days, we used to actually do a git pull and repackaged everything into the system gems on each deployment.  As we started pushing code more often we realized how silly this approach was so we decided to stick with one working set of system gems.  Despite our best efforts we were still plagued by "already initialized" errors whenever a new version of dm or merb came out.  This is how <a href="http://github.com/atmos/rubundler">rubundler</a> was born.  Rubundler is:
<ul>
	<li>Not a long term replacement for thor bundling, it's a band-aid.</li>
	<li>Does not require checking gems into your SCM at all</li>
	<li>Can go from <strong>no system gems</strong> to a working merb app if you have a net connection</li>
	<li>Requires people to familiarize themselves with the gems they actually use</li>
	<li>Works with continuous integration servers</li>
	<li>Makes for swift deployments</li>
	<li>Gracefully handles version bumps in gems you depend on</li>
	<li>Makes collaboration simple</li>
        <li>Works with more than just merb, we test some of our internal gems with it</li>
</ul>
As I told <a href="http://yehudakatz.com/">Yehuda</a> yesterday when I was asking for thor bundling help in #merb.  I'm not trying to peddle rubundler.  Rubundler isn't the right solution, but it sucks less than the current 'supported'  solution.  I think people should be aware of an alternative and I think the community will be healthier if folks stand up and say "Hey!  This is rubbish!"  Stop taking every assumption your framework authors consider 'correct' and see if it's 'correct' for you.

I did get confirmation on IRC last night that Yehuda is working on rewriting this stuff.  Hopefully it'll be more 'correct' for the general community in the coming weeks.  In the meantime, if you waste an hour or so messing with gems and merb/dm, rubundler might be a good temp fix for you too.
