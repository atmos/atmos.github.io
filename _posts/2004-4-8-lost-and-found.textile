--- 
layout: post
title: Lost and Found
---
<p>Work is cool so far.  We have these really nice machines that were apparently missing some libraries, so no one was developing on them.  I've been working on making an image for these machines, but I got burned by a bad Makefile.  There was an entry in a Makefile for one of our projects that resembled the following.'rm -rf ${VAR}/*'  Unfortunately it hadn't checked to see if ${VAR} was set, so it pretty much ran.'rm -rf /*'  I noticed a bunch of permission denied errors when it got to /dev and stopped it.  Unfortunately /bin was already gone, so that image was ruined.  I started over and the system is building as I type.  I should get to ghost it tomorrow if all goes well.</p>
<p>I've been working with <a href="http://tokyo.cored.org">Tokyo</a> a lot lately on themeing <a href="/docs/entice/index.html">Entice</a>.  His input has been extremely helpful, and I've almost found all the bugs he's reporting. :)  I think I'm pissing him off because I've been changing the internals while he's trying to theme it.  It's for the better.  I like the way his theme is coming together, it blows the default theme away.</p> 
