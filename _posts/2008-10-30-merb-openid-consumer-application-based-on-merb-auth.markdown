--- 
wordpress_id: 71
layout: post
title: Merb OpenID Consumer Application based on Merb-Auth
wordpress_url: http://atmos.org/?p=71
---
We've been playing around with <a href="http://openid.net/">openid</a> this week so I figured it was worth spending some time to test <a href="http://merbist.com/2008/10/29/yet-another-rc-release-merb-10-rc3/">the latest merb 1.0 release candidate</a>.

Say hello to the <a href="http://github.com/atmos/merb-openid-example/tree/master">merb-openid-example</a> app.  It is a simple openid consumer application based on <a href="http://github.com/wycats/merb/tree/master/merb-auth">merb-auth</a>.  One of merb-auth's <a href="http://github.com/wycats/merb/tree/master/merb-auth/merb-auth-more/lib/merb-auth-more/strategies/basic/openid.rb#L10">built in strategies is openid</a>, getting things going is simply a matter of enabling the appropriate authentication strategies.

This application is intended to run against merb 0.9.12(1.0rc4).  Here's a quick checklist of what was involved in getting merb-auth working with the openid strategy.
<ul>
	<li>sudo gem install merb</li>
	<li>setup the merb-auth strategy</li>
	<li>add the <strong>openid </strong>and <strong>signup</strong> named routes</li>
	<li>modify the user model to handle openid attributes</li>
	<li>add the <strong>ensure_authenticated</strong> before filter</li>
</ul>
 
To setup merb I normally uninstall every trace of merb that's on my system.  The 0.9.x branches tend to conflict if you have multiple merb versions installed.  I tend to do the following(note it uninstalls ALL merb gems):
<code>gem list merb | awk '/merb/ {print $1}' | xargs sudo gem uninstall -aI</code>
Then I just install the merb meta package
<code>sudo gem install merb</code>

Setting up the merb-auth strategy requires you to familiarize yourself with the merb/merb-auth/strategies.rb file.  In a newly generated merb application this file should setup a salted password base authentication scheme, we want to change it so it looks like the following:
<script src="http://gist.github.com/21213.js"></script>

Next we need to setup two named routes that the openid auth strategy will use in order to make the openid authentication happen.  I created a separate controller(<a href="http://github.com/atmos/merb-openid-example/tree/master/app/controllers/authentication.rb">authentication.rb</a>) to handle these requirements.  All you really need to know about the two named routes, <strong>openid</strong> and <strong>signup</strong>, is that <strong>signup</strong> should not require authentication and the <strong>openid</strong> route should.

The default user.rb that you get from merb-gen will need a few minor adjustments to work with openid.  First you'll have to add a few attributes if you intend to cache them locally, and after that you'll need to disable the password validations that are automatically enabled by the salted password strategy(even if you disabled it).  My user.rb looks like this.

<script src="http://gist.github.com/21218.js"></script>

Once all that's done you should be able to just throw the before filter into your <a href="http://github.com/atmos/merb-openid-example/tree/master/app/controllers/application.rb">application.rb</a> and you'll be ready to start using merb-auth with the openid strategy.

The example application works outta the box, just run the merb command.  It also has specs which show off a bug that still exists in rc4 where controllers are <strong>not</strong> honoring :only/:exclude parameters that are passed to before filters.  

I'd like for this to remain a simple app that we can keep as a community example.  If this gets outta date please fork it and send me a pull request on github.
