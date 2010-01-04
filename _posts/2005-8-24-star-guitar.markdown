--- 
layout: post
title: Star Guitar
---
I've been really bugged by the "has_and_belongs_to_many":http://api.rubyonrails.com/classes/ActiveRecord/Associations/ClassMethods.html#M000430 association rails the past few days.  I'm leveraging it for image tagging, and I can't seem to pinpoint why it's sorting my associations correctly in one instance, but returning seemingly unsorted associations in another.  Since I've already added the DND reordering of tagged images in the admin interface I really wanna see the fruits of my labor!  Once I get the stupid habtm issue resolved, I have to Ajax the bunch which should be relatively braindead.  All of this applies very cleanly to current "typo":http://typo.leetsoft.com which makes me a very happy camper. *UPDATE*: Apparently disabling "Eager Loading":http://rails.rubyonrails.com/classes/ActiveRecord/Associations/ClassMethods.html of my associations fixed the ordering problem right up.  Weird...

On a side note I did some straight up "erb":http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/ hacking today at work.  We have these annoying as "Excel":http://www.microsoft.com/office/excel 'templates' at work that require much more interaction than I'd like.  Now you just execute a simple ruby script, answer a few questions and you get a nice "XHTML":http://www.w3.org/TR/xhtml1/ format.  It's a lot less loud and obnoxious color-wise.
