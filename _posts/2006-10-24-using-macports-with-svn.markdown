--- 
layout: post
title: Using MacPorts with SVN
---
I use "Macports":http://www.macports.org (formerly Darwinports) to get free unix software onto my Macbook most of the time.  It's how I build ruby, mysql, postgres, etc.  A while back I was working on a project that required rmagick, and for some reason darwinports was broken.  I *really* needed it that evening, so I went into #darwinports on freenode.  After bitching for a while someone said it worked fine for them because they were working out of CVS.  I didn't know you could, but apparently by working out of CVS you get the fixes before the syncs hit the mirrors.  He was nice enough to explain it to me, and I got rmagick built.  Since then darwinports has apparently become Macports, and they've moved from CVS to SVN.  My darwinports install had grown outdated and today I updated to their new SVN.  Here's how you can keep up to date without having to wait on the mirrors to sync.

Checkout the macports svn repo to a directory on your system that you're not going to delete, I keep mine in ~/Source.  Once you've got it checked out, build it!

<pre>
cd ~/Source
svn co http://svn.macports.org/repository/macports/trunk/
mv trunk macports
cd macports/base
./configure --prefix=/opt/local;make; sudo make install
</pre>

After that all you have to do is configure macports to check your copy of svn for application sources.
<pre>
sudo vim /opt/local/etc/ports/sources.conf
# add the following line at the bottom, commenting out whatever else is there
file:///Users/atmos/Source/macports/dports
</pre>

Now if you ever go to build anything and the files can't be found, or you *KNOW* there's a newer version of the software you can simply run 'svn up' from the dports directory.  If anyone at macports has checked in build fixes or updated sources, it'll grab those and life is good.
