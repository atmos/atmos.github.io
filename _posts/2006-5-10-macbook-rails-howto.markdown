--- 
layout: post
title: Macbook Rails Howto
---
I had a feeling I'd be learning a thing or two when I switched to an Intel mac.  Surprisingly other than having to compile darwinports from scratch the rest felt just like the way my PowerPC based setup went.  My first macbook I got had a "weird noise":http://www.red-sweater.com/blog/107/macbook-pro-noise-update that was emitted from the dvd drive area, "QuietMBP":http://www.red-sweater.com/blog/downloads/QuietMBP1.1.zip would silence it but I took it back and got another anyways.  It annoyed me because the noise started just after I had gotten my dev environment setup on it.  During the first iteration I googled a little and didn't see any obvious howtos out there, but digging through some mailing list posts and the like I managed to get everything up and running.  The second time I set everything up I figured I'd keep track of how I setup my rails  environment on my new "macbook pro":http://www.apple.com/macbookpro/.

One thing that annoyed me was the case insensitive file system that comes as the default on your new mac.  When I got the second macbook I went straight for my restore cds, repartitioned the drive into two drives, and formatted them case sensitive journaled hfs+ partitions.  You can do this by booting off  your restore media and using disk utility.  You then do the normal install options.

Once the install completes install xcode off of disk1 from your restore media.  Next you need to install "darwinports":http://darwinports.opendarwin.org/getdp/ from source. I basically did the following so things would stay in /opt/local like I was used to

<pre>
mbp%  ./configure --prefix=/opt/local;make; sudo make install
mbp% echo "PATH=/opt/local/bin:\$PATH; export PATH" >> ~/.zshrc
mpb% exit
</pre>

After that just open up a new terminal and have darwinports go out to the net to sync up the available packages

<pre>sudo port -d selfupdate</pre>

The first thing I always grab outta darwinports is ruby, for some reason the following line always fails the first on rubygems the first time, rerunning the command seems to fix it up nicely.

<pre>
mbp% sudo port install rb-rubygems
# yes a second time, rubygems always barfs on me
mbp% sudo port install rb-rubygems
</pre>

While I'm considerably more fond of "Postgres":http://www.postgresql.org these days I wanted to build out mysql for small projects and random other things.  The following builds you mysql5 and the ruby drive for communicating with it.  If you wanna lock your mysql down after these steps(and you should) that's documented tons of other places on the web.

<pre>
mbp% sudo port install mysql5 +server
# to start mysql at boot time on your machine
mbp% sudo launchctl load -w /Library/LaunchDaemons/org.darwinports.mysql5.plist
# install the ruby gem for mysql
mbp% sudo port install rb-mysql5
# setup your mysql install
mbp% sudo -u mysql mysql_install_db5
echo 'alias mysql=mysql5' >> ~/.zshrc
</pre>

I use Postgres in my day job and wanted to build out the latest version of postgres 8 next.  It's pretty similar to the above example.  "xal":http://blog.leetsoft.com has a great article for "setting up pg outta darwinports":http://blog.leetsoft.com/articles/2005/12/14/postgres8-quick-install and I'd suggest taking a look if anything bombs on you here..

<pre>
mbp% sudo port install postgresql8 +server
# add pg to your path
mbp% echo "PATH=/opt/local/bin:/opt/local/lib/pgsql8/bin:\$PATH; export PATH" >> ~/.zshrc
mbp% mkdir -p ~/Databases/Postgres
mbp% echo "PGDATA=\$HOME/Databases/Postgres; export PGDATA" >> ~/.zshrc
mbp% exit
# open a new terminal by hitting apple n
mbp% initdb
mbp% sudo gem install ruby-postgres -- --with-pgsql-lib-dir=/opt/local/lib/pgsql8 --with-pgsql-include-dir=/opt/local/include/pgsql8
# hit 1, the latest version of the driver
mbp% pg_ctl start
mbp% exit
</pre>

Now there's a handful of other odds and ends that follow, svn, fastcgi, rmagick.

<pre>
# install subversion cause you can't live without it
mbp% sudo port install subversion
# install fastcgi, rb-fcgi will get fastcgi AND the ruby lib for it
mbp% sudo port install rb-fcgi
# install rb-rmagick, it's going to install imagemagick and all its deps, the the ruby lib for it
mbp% sudo port install rb-rmagick
# install lighty w/ ssl support
mbp% sudo port install lighttpd +ssl
</pre>

Last but not least there are a shitload of gems you just can't live without.
<pre>sudo gem install rails rake capistrano zentest mongrel --include-dependencies</pre>

At this point you should have a fully functional rails development environment on your new macbook.  Here are a few other apps that should make developing rails apps easier.
* "Quicksilver":http://quicksilver.blacktree.com/ I really didn't understand this at first, but I'm completely hooked now.  I launch almost everything from it, and it hooks into more stuff on your system than you'd realize at first.
* "Textmate":http://www.macromates.com/ This editor was a breath of fresh air to me.  For years I wrote in "vim":http://www.vim.org and loved it, but in the last few months I've grown very fond of this editor and the integration with rails is spectacular.
* "AdiumX":http://www.adiumx.com/  As a long time linux user I wondered where my "gaim":http://gaim.sf.net was on osx, it's called Adium and it's built on libgaim.
* "Firefox":http://www.mozilla.com/firefox/ I actually use Safari or Webkit for my casual browsing but firefox has a bunch of extensions that make life so much easier
** "Firebug":https://addons.mozilla.org/addon.php?id=1843  You'll be wondering how you ever worked without it.
** "Web Developer":https://addons.mozilla.org/firefox/60/ Nice for tweaking CSS in realtime and various other tasks.

Hope this helps someone out there. :)
