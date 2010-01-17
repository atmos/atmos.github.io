--- 
layout: post
title: Simple Merb/Monit Site
---
I set out to play with "merb":http://merbivore this weekend and figured I'd try to whip up a little web app in the process.  What I came up with was "monitr":http://monitr.atmos.org.  It'll generate a monit file for you based on a supplied mongrel_cluster.yml file.  It also generates a monit entry for nginx, which isn't quite as useful as the mongrel cluster one.

Merb is very cool.  Ezra's done a wonderful job keeping it simple.   Most questions I had I ended up answering myself by simply examining the code, the few other questions were quickly fielded by the people in #merb on irc.  I don't expect merb to take down rails or anything, but it's a really nice alternative when you don't need the kitchen sink.
