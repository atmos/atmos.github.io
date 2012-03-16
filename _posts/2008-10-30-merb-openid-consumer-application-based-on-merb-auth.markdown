--- 
wordpress_id: 71
layout: default
title: Merb OpenID Consumer Application based on Merb-Auth
wordpress_url: http://atmos.org/?p=71
---

Merb OpenID Consumer
====================

We've been playing around with [openid](http://openid.net/) this week so I figured it was worth spending some time to test
[the latest merb 1.0 rc](http://merbist.com/2008/10/29/yet-another-rc-release-merb-10-rc3/).

Say hello to the [merb-openid-example](http://github.com/atmos/merb-openid-example/tree/master)
app.  It is a simple openid consumer application based on [merb-auth](http://github.com/wycats/merb/tree/master/merb-auth).  One
of merb-auth's [built in strategies is openid](http://github.com/wycats/merb/tree/master/merb-auth/merb-auth-more/lib/merb-auth-more/strategies/basic/openid.rb#L10)
, getting things going is simply a matter of enabling the appropriate
authentication strategies.

This application is intended to run against merb 0.9.12(1.0rc4).  Here's a
quick checklist of what was involved in getting merb-auth working with the
openid strategy.

* sudo gem install merb
* setup the merb-auth strategy
* add the **openid** and **signup** named routes
* modify the user model to handle openid attributes
* add the **ensure_authenticated** filter

To setup merb I normally uninstall every trace of merb that's on my system.
The 0.9.x branches tend to conflict if you have multiple merb versions
installed.  I tend to do the following(note it uninstalls ALL merb gems):

`gem list merb | awk '/merb/ {print $1}' | xargs sudo gem uninstall -aI`

Then I just install the merb meta package

`sudo gem install merb`

Setting up the merb-auth strategy requires you to familiarize yourself with the
merb/merb-auth/strategies.rb file.  In a newly generated merb application this
file should setup a salted password base authentication scheme, we want to
change it so it looks like the following:

<script src="http://gist.github.com/21213.js">
</script>

Next we need to setup two named routes that the openid auth strategy will use
in order to make the openid authentication happen.  I created a separate
controller([authentication.rb](http://github.com/atmos/merb-openid-example/tree/master/app/controllers/authentication.rb))

to handle these requirements.  All you really need to know about the two named
routes, **openid** and **signup**, is that **signup** should not require
authentication and the **openid** route should.

The default user.rb that you get from merb-gen will need a few minor
adjustments to work with openid.  First you'll have to add a few attributes if
you intend to cache them locally, and after that you'll need to disable the
password validations that are automatically enabled by the salted password
strategy(even if you disabled it).  My user.rb looks like this.

<script src="http://gist.github.com/21218.js">
</script>

Once all that's done you should be able to just throw the before filter into
your [application.rb](http://github.com/atmos/merb-openid-example/tree/master/app/controllers/application.rb)
and you'll be ready to start using merb-auth with the openid strategy.

The example application works outta the box, just run the merb command.  It
also has specs which show off a bug that still exists in rc4 where controllers
are **not** honoring :only/:exclude parameters that are passed to
before filters.

I'd like for this to remain a simple app that we can keep as a community
example.  If this gets outta date please fork it and send me a pull request on
github.
