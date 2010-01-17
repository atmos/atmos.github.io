--- 
layout: post
title: Autotest and Growl
---
Sat at a coffee shop this evening with "Rick Bradley":http://www.rickbradley.com and he whipped up a neat little integration between "growl":http://growl.info/ and "autotest":http://www.zenspider.com/ZSS/Products/ZenTest/.  You can throw "this code":http://pastie.caboo.se/12848 into your ~/.autotest file to get nice growl notifications.  I can't get it working properly with "redgreen":http://on-ruby.blogspot.com/2006/06/more-fun-with-redgreen.html, so if anyone can figure it out, please share.

Using Labrat's post in the comments I tweaked his version and now have a "working copy using redgreen":http://pastie.caboo.se/12964

*UPDATE*: After talking with Ryan at rubyconf this is the completely wrong way to work with growl.  Eric Hodel has written it properly using the new plugin stuff in zentest, and the above approach will create issues.
