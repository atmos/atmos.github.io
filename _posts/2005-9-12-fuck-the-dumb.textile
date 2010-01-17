--- 
layout: post
title: Fuck The Dumb
---
Since I started at my current employer a little over a year ago I had a really dope manager.  He'd been dealing with the insanity that we call work for the past four years, and was really a pleasant dude to work under.  He schooled me to the inner workings of the corporate environment we support and he's a no bullshit, technical kinda guy.  However he's moving on to other stuff(inside the same company), and right now things are kinda up in the air.  The guy who's replaced him is a former release manager, a cool dude, but not someone with the same level of technical expertise.  How does this all tie into my script rewrite?  It does cause no one is going to tell me "no you can't do that" right now. :]

So in a "redhanded":http://redhanded.hobix.com attempt to sneak ruby through the system I'm ditching all this old legacy perl in favor of ruby.  I guess I won't be ditching it as much as I'm going to slow phase it all out in favor of the newer stuff.  My perl scripts work fantastically, and it's debateable that I could find something else to fix around here instead but this is what I feel like doing.

The way I develop stuff has changed so much in the last year or so, unit tests have warped my approach to writing things.

"Net-SSH":http://net-ssh.rubyforge.net is going to be a driving force behind this new suite.  My old code simply piped ssh commands through forward ticks<pre>`ssh foo@bar.com "perl /path/to/some/local.pl"`</pre> and had very little error checking.  With "sync-shell":http://net-ssh.rubyforge.org/chapter-5.html#s4 however I've had considerably better luck with error checking especially if I have to pipe a few commands input/output from one to the other.  I'm gonna stick with the on script dispatching to little worker scripts on remote hosts, as I feel that is the most effective approach for how we all work.  It'll also allow me to implement a slew of new utilities to monitor application and server health on a scale that our enterprise monitoring doesn't currently allow.  

Regardless I'm excited about it, being excited about code is like Christmas was when you I a kid, magical.  Well, atleast it is for me.
