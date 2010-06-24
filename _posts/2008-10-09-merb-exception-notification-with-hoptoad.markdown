--- 
layout: post
title: Merb Exception Notification with HopToad
---

Exceptions
----------

One of my frustrations over the past few months has been the lack of a quality exception notifier plugin for <a href="http://merbivore.com">merb</a>. The <a href="http://github.com/newbamboo/merb_exceptions/tree/master">New Bamboo Merb Exceptions</a> gem has been around for a while now, but it has been consistently broken or tailored to versions of merb that I'm not currently running.  So for the last few months we used a hacked version of new bamboo's merb_exceptions in production, and it worked pretty well until the exception refactoring that went down in merb landed in mid-august. There's a slightly more recent post on the <a href="http://merbist.com/2008/10/01/exception-handling-in-merb/">Merbist</a> about the merb_exceptions plugin being consumed into the official merb plugins repo, this is quite cool. :)

Call to Arms
------------

Last night I saw a <a href="http://twitter.com/benburkert/statuses/952186855">tweet</a> by <a href="http://benburkert.com/">benburkert</a> about hoptoad.  I know Ben from the Merb/DM community and figured he had to be using hoptoad with merb.  <a href="http://www.hoptoadapp.com/welcome">Hoptoad</a> is an exception notifier/logger service provided by the good folks at <a href="http://www.thoughtbot.com/">ThoughBot</a>.  It's kind of like a nice combination of the classic rails <a href="http://svn.rubyonrails.org/rails/plugins/exception_notification/README">Exception Notifier</a> and technoweenie/dreamer3's <a href="http://github.com/defunkt/exception_logger/tree/master">exception_logger</a> plugin.  A quick search on <a href="http://github.com">github</a> revealed an existing <a href="http://github.com/joakimk/hoptoad_notifier_merb/tree/master">merb plugin for hoptoad</a>.  SCORE.

Problems
------------
The downside was that this was written right when hoptoad was released, and the way that the Exceptions controller behaves changed(for the better) shortly after the initial plugin was released.  So I forked the repo and it took about 30 minutes to update the code to work with the version of merb we're running(0.9.7).  I've sent a pull request to the author and I'm hoping he'll consume my changes, but in the meantime you can grab it from <a href="http://github.com/atmos/hoptoad_notifier_merb/tree/master">my public fork of the plugin</a>.  I also updated the README to be a little more informative on how to get things going.
<strong>UPDATE</strong>:
I went ahead and made the code a proper merb plugin w/ specs and such, it's available <a href="http://github.com/atmos/merb_hoptoad_notifier/tree/master">here</a>.
