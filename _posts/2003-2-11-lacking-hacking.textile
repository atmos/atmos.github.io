--- 
layout: post
title: Lacking Hacking
---
<p>I've been all stressed and gross lately.  a bunch of stuff at work was really dependent on me finishing or implementing things, and a lot deadlines converged at once.  I've migrated our <a href="http://www.beowulf.org">Beowulf</a> cluster at work to a new image running <a href="http://www.debian.org">Debian</a> which should work any time we ever need to make a Beowulf cluster again.  Actually, It might need a new kernel sometime though...)</p>
<p>I got a pci firewire card from best buy for like 35$  Plugged it in, compiled the kernel modules, and it worked exactly as expected.  So of course I immediately tested <a href="http://gtkpod.sf.net">gtkpod</a> with it and it worked great.  The sbp2 module seems to work much better with my desktop(i386) than with my laptop(ppc).  I ended up getting an 80gig instead of a 100gig drive, but it does have the 8MB buffer I wanted.  It gets pretty nice hdparm results.=)<PRE>

alchemist:~# hdparm -tT /dev/hda

/dev/hda:
Timing buffer-cache reads:   128 MB in  0.47 seconds =272.34 MB/sec
Timing buffered disk reads:  64 MB in  1.38 seconds = 46.38 MB/sec
alchemist:~#
</PRE>
My desktop is actually the nicest machine I use these days, just need to get a new cdr.  I got a new book too, <a href="http://www.amazon.com/exec/obidos/tg/detail/-/0201549794/qid=1045002344/sr=8-1/ref=sr_8_1/002-7554980-2788863?v=glance&s=books&n=507846">The Design and Implementation of the 4.4BSD Operating System</a>.  Should be a very cool read if I can find some free time.  Speaking of free time...  Friends, girl, school, work, and trying to hack on opensource stuff leaves me with almost no free time lately.  Those five things are all kinda getting shortchanged.  I'm workin on trying to balance those out a little better.
</p>
<p>My car's transmission died the other day.  Been carpooling with Allison since that happened, hopefully I'll have my car back this week cause her car guzzles gas.  Having a girlfriend remains surprisingly cool, I still really dig her.</p>
