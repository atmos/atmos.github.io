--- 
wordpress_id: 80
layout: default
title: "Flatirons : A Merb OpenID Provider Part 1"
wordpress_url: http://atmos.org/?p=80
---

Flatirons OpenID Server
=======================

[What are the flatirons](http://www.powerset.com/explore/semhtml/Flatirons?query=what+are+the+flatirons)
you say?  They're a rock formation near my house in Colorado, they look like
this in the winter.

<a class="tt-flickr tt-flickr-Medium"
href="http://flickr.com/photos/molas/62517813"><img class="alignnone"
src="http://farm1.static.flickr.com/31/62517813_0d49863e68.jpg" alt=""
width="465" height="167" /></a>

It's also the name of the open source merb 1.0 based OpenID **Provider** that's
[available on github](http://github.com/atmos/flatirons/tree/master).
We recently started rolling out a customized OpenID **Provider** for all of our
internal apps.  Flatirons was how I familiarized myself with the
OpenID [spec](http://openid.net/specs/openid-authentication-2_0.html).

# The Low Down

I'm going to break this into two parts, one on the OpenID **Provider** and one
on the way we're testing in merb 1.0.  There appears to be a lack of examples
on writing specs in the merb 1.0 world and I assure you it rocks way more than
it used to.  This part will give you a brief overview of what's really involved
in the OpenID protocol.  Part 2 will cover testing the spec that's described
here.

# Paint a Perfect Picture

It's not perfect, but it should give you an idea about the request/response
life cycle for an OpenID Authentication.  Keep in mind that **User-Agent** in
these diagrams is normally a User's browser.  A **Consumer** is your new
micro-app that doesn't even have a concept of user passwords.  The **Provider**
is where flatirons comes into play, it's the OpenID to Merb layer that allows
you to take advantage of merb-auth's strategies.  The **Auth Backend** is
trivial to customize, consult the [merb-auth](http://github.com/wycats/merb/tree/master/merb-auth)
docs for more info.  Check it:

<a class="tt-flickr tt-flickr-Original"
href="http://www.flickr.com/photos/atmos/3054931483/"><img
class="aligncenter"
src="http://farm4.static.flickr.com/3036/3054931483_b2d220624a.jpg"
alt="flatirons" width="465" height="500" /></a>

# Identity Discovery

Identity Discovery is the first part of the **User-Agent** authentication.
The **Consumer** can request one of three options(<a
href="http://openid.net/specs/openid-authentication-2_0.html#discovery">the
spec</a>) but normally the **Provider** sends back a Yadis document that lets
the **Consumer** know where to go to start talking that crypto shit with the
**Provider**.  This is normally in the form of an xrds+xml response.

# Associate

This is where the magic starts.  "An association between the Relying Party
and the OpenID Provider establishes a shared secret between them, this is used
to verify subsequent protocol messages and reduce round trips."(<a
href="http://openid.net/specs/openid-authentication-2_0.html#associations">the
spec</a>)  The **Consumer** and the **Provider** negotiate some Diffie-Hellman
keys and use these for communicating for the rest of the auth life-cycle.

# Check ID Setup

Check ID Setup covers a few things, there's a few modes that you should really
investigate in the <a
href="http://openid.net/specs/openid-authentication-2_0.html#requesting_authentication">documentation</a>
if you're curious.  Suffice it to say there's two interesting modes that are a
part of the id setup, **checkid_setup** and **immediate**.  **Immediate** is
used less frequently and it's designed for authenticating in a manner that
isn't interactive(think ajax logins).  The **checkid_setup** mode is way more
common, it involves normal http requests, redirects, and pages where you enter
your username and password.

# Acceptance - "Do you trust me?"

Acceptance is a form on the **Provider** displaying the specific information
it's going to send to the **Consumer**.  The **User-Agent** specifies whether
or not this information is OK to send to the **Consumer**.  Normally users just
click OK here but this is where a full fledged **Provider** allows you to pick
one of many identities you have stored there.

# Identity Result

Once the **User-Agent** accepts the **Provider** as a trusted source, an
identity result is sent back to the **Consumer** from the **Provider**.  The
**Consumer** can then take this response and do whatever local bootstrapping
they need to for the user.  OpenID can send back more than just the identity
URL, but flatirons doesn't take advantage of these spec extensions yet.

# WTF, Why do I even care?

Since this is based on **merb-auth**, you have all of the strategies it
provides at your disposal.  Flatirons defaults to the salted password setup,
but you could easily hook this into whatever authentication backend that you
need.  If you're considering Ruby applications and need single sign on then
this is a good starting point regardless of your user store.  In a trusted
environment you can make this even more simple, whitelisting can simplify the
request/response life-cycle by removing the **Acceptance** step.  Depending on
your user store you can mask the interaction with the actual identity URL.
We're able to mask the concept of the identity url a **User-Agent** uses and we
just ask them for their email address.  Ours users don't even know what OpenID
is, it rocks.

# Where's the Code

[It's on github of course](http://github.com/atmos/flatirons).  In the next
couple of days I'll dissect the specs that validate the expectations defined
above.
