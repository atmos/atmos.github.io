--- 
wordpress_id: 49
layout: post
title: Adding God to /etc/inittab on a Linux box
wordpress_url: http://atmos.org/?p=49
---
We've been using monit at <a href="http://www.engineyard.com">Engine Yard</a> on thousands of machines with a great deal of success.  Sometimes it can get itself into a weird situation where it lets you down, but by far it does its job exceptionally.  When I was setting up process monitoring for a merb app of my own; the logging capabilities of monit really let me down.  I had weird stuff happening because the environment was being cleared and I couldn't track down exactly WHY my merbs kept aborting.  So I gave <a href="http://god.rubyforge.org">God</a> a try and I really like it.  I run god under init and here's the basics for setting it up on an EY slice or any Linux box for that matter.
<ul>
	<li>ensure that you're on rubygems 1.3.0, older versions would load WAY too many things and it behaves like rubbish on most EY slices</li>
	<li><code>gem install god</code></li>
	<li><code>mkdir /etc/god</code></li>
	<li><code>echo "God.load \"/etc/god/*.god\"" &gt; /etc/god/god.config</code></li>
	<li>Add the following two lines to /etc/inittab:
<code>god:345:respawn:/usr/bin/god -c /etc/god/god.config --log-level error -D
god0:06:wait:/usr/bin/god quit</code></li>
	<li><code>telinit q</code></li>
</ul>
Now all you have to do is drop god configs in /etc/god and you're good to go.  You should be able to see some meaningful log output in /var/log/syslog.

Some of my coworkers are still hesitant about it because of the memory consumption and leaks they've seen.  I kill god once a day with a cron job. :)

<code>0 0 * * * /usr/bin/killall -9 god</code>

p.s. Anyone have a better god config for merb processes?  Here's <a href="http://gist.github.com/17980">mine</a>.
