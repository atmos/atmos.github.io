--- 
layout: post
title: Typo Overlay Madness
---
When I pushed my galleries out onto my server last Sunday I couldn't get it to upload any files.  I'd forgotten they might not have the "ruby exif" package I was using to parse the exif tags.  I sent them a support email, about 24 hours later I got an email saying they'd try to install it for me when they weren't so busy.  It took about another 24 hours to show up on the servers and then I discovered new problems.

I suddenly had an issue where the exif parsing was raising exceptions I couldn't track. This ended up falling back to a recent design choice, serializing ALL available exif info.  Instead of just keeping track of the exif info I want displayed on my site, I'm serializing all of the exif info present in the image.  It'll be very useful if I decide to delete the high res uploaded copy after I do all the thumbnailing etc.  The other cool thing is people can override the exif partial really easily thanks to "slaird's":http://www.scottstuff.net/ recent improvements to the template engine.  You can now override any view component via your theme, quite powerful stuff. :)

NOW, I'm getting the wonderful "String not matched" session but that I'd only seen in webrick in development mode.  It's happened like 4-5 times on me this morning.  The "typo":http://typo.leetsoft.com folks think it's embedded deep in rails, but I'm starting to think it's something in the admin interface in typo itself.

If you want to play with the first demo, you can access it via "exhibits":http://www.atmos.org/exhibits/
