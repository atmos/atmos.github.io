--- 
wordpress_id: 144
layout: post
title: Merb 1.0 Controller Testing
wordpress_url: http://atmos.org/?p=144
---
This was originally going to be part of "testing flatirons" but it got kinda
long and I felt it'd be most useful to community if I made it a standalone
article.  I've had the pleasure of experimenting with everything I cover in
this write-up, and the state of merb's testing environment is getting better.
Since merb is at 1.0 these days this rundown should be valid for at least a few
more months.  I'm gonna run through what I know about how you test in merb, and
in the next few days I'll dissect [flatirons](http://github.com/atmos/flatirons).
Here's what I'll be covering in this write up:

### Request
* dispatch_to
* get/post/put/delete
* request

### Requests with Authentication
* dispatch_to / http verb tests
* requests w/ given blocks

### RSpec Matchers FTW
* have_selector
* have_xpath
* Roll Your Own

### 1.1 dispatch_to

This method allows you to unit test controllers.  It also makes your co-workers
cry, swear to kill you, and rewrite your code.

<script src="http://gist.github.com/30271.js">
</script>

It seems harmless enough.  **dispatch_to** takes 4 parameters and an optional
block.  The 3rd parameter is the actual params hash that the action will see.
The 4th is your http environment and how you modify things like HTTP_ACCEPT to
change content type.  When you call this method it instantiates the Class and
calls the Action with your http params, you bypass routing and have the option
to stub/mock to your heart's content.  The response from **dispatch_to**
returns an instance of the class, in this case it's the Sessions controller.
The response also has a few instance methods that might be useful to check in
your testing:

* **#status** - the http response code
* **#body** - the document returned from the action
* **#headers** - the http headers returned
* **#session**- the session for the request

In my experience **dispatch_to** leads to really brittle tests when things
start to get a little more complex.  While I'm a **HUGE** fan of
[rr](http://github.com/btakita/rr), I'm finding that mocks are mostly
complicating my day to day work. I wanna see my code work from beginning
to end, even if it means my test suite takes a little longer.  The merb-core
team advises against using **dispatch_to**.  If you're going to be using merb
for the foreseeable future, do not get in the habit of using this.  Seriously.

### 1.2 get/post/put/delete

The standard HTTP verbs are available as request helpers in your test
environment too.  It's kinda like **dispatch_to** but it actually goes through
the router.  Insted of giving a Class and an Action to call, you give the same
path you would request in a browser.  The optional 2nd and 3rd parameters to
this function are the request parameters and http environment respectively.
This also has a block syntax that you'll see later in this tutorial.  Here's
what the above request looks like using the HTTP verb helpers.

<script src="http://gist.github.com/30274.js">
</script>

The response from **get** / **post** / **put** / **delete** has the same
instance methods available that **dispatch_to** has since they both return the
actual controller that was executed.

This is cooler than **dispatch_to** because it goes through the router and we
can make sure that our pretty "/login" url is properly configured in the
router.

### 1.3 request

**request** is short and sweet.  It's a programmatic browser experience of
sorts.  At first glance it doesn't seem much better than <strong>get</strong>
but it actually preserves states between a series of requests.  We'll see why
this kicks ass later in the tutorial.  Here's how you display the login form
with the request helper.

<script src="http://gist.github.com/30275.js">
</script>

The response from **request** is a struct that provides the following instance
methods.  In general I try not to call these instance methods, it tends to be
more clean when you write **matchers** against the response object itself.

* #status - the http response code
* #body - the document returned from the action
* #headers - the http headers returned
* #url - the url that was requested
* #original_env - i think this is how stuff persists between requests.  I've never actually called this for anything.

## 2.0 Testing with Authentication

###2.1 merb-auth and all that jazz

So you're supposed to be using merb-auth if you need authentication in your app.  So how do you test it?

###2.2 dispatch_to and HTTP verbs with Authentication

Both **dispatch_to** and **get** can take an optional block that allows you to spec and mock things on the controller. If you need to
stub out authentication both helpers are easily spec'd like this.  

<script src="http://gist.github.com/30278.js">
</script>

While adding the mocks and stubs might yield some immediate results, it tends
to be a maintenance nightmare.  You either end up with a bunch of duplicated
stuff in each spec or you end up wrapping these methods with things like
employee_get/employee_put etc.

<script src="http://gist.github.com/30280.js">
</script>

Even with this bit of abstraction it becomes a royal PITA to test real use
cases.  Since each spec tests the controller action in isolation you open
yourself up to the possibility of having bugs in your tests that are directly
related to keeping your mocks/specs synced up with your real code.  "Does the
signup process really work from start to finish?" "I don't really know what
that chunk of code does, but I know it returns true or false."  It becomes very
easy to bypass chunks of code in certain situations without really
understanding how things integrate.  The request helper shines bright in this
situation.

### 2.3 requests with given blocks

The **request** helper allows you to preserve the normal browser
experience by making successive calls to **request** and
preserving the user session.  So here's how you authenticate against merb-auth:

<script src="http://gist.github.com/30281.js">
</script>

It sucks that you had to explicitly call that request to "/login" but it's
kinda nice to be able to comprehend the user experience that led up to the
point where the code in question was tested.  Someone logged in and then they
could view their account settings.

Either Merb or RSpec provide you with this **given** block to
setup pre conditions that the spec relies on.  They're kinda like
shared_examples but if you're using **request** you can build
entire use cases up and attach them to describe blocks.  Your session persists
between requests, instant WIN!  I added this to the bottom of my
**spec/spec_helper.rb** to allow for authenticated requests.

<script src="http://gist.github.com/30282.js">
</script>

After that your test code starts to look like this  

<script src="http://gist.github.com/30364.js">
</script>

If you're super awesome you can pass "cookie jars" along with your requests to
restore certain states.  I think they'll be really useful in situations where
specs start taking forever because of the amount of setup required to get to a
certain state.  Thus far our specs aren't taking a long time so I guess I'll
cross this bridge when our spec suite starts taking forever.

One other thing to keep in mind is that your HTTP_HOST environmental variable
is http://example.org.  So don't be surprised if you see this popping up in
your tests.

## 3. RSpec Matchers

Remember how both the <strong>dispatch_to</strong> and <strong>request</strong>
responses have a few instance methods that are useful in testing?  Notice that
we didn't explicitly call them in any of the spec examples above?  It's because
we're using the rspec matchers that merb provides.  Not only should you be
using the ones that merb provides, you should be writing custom ones for your
app.  Here's the matchers that I use from merb on a daily basis.

### 3.1 HTTP Response Checks

* **be_successful** This basically checks that response.status was 200.  It was a successful request. :D
* **redirect** This checks that response.status was 302.  It's your normal HTTP redirect code.
* **redirect_to** This not only checks that response.status was 302 but it takes a string for the **path** portion of the redirection.  If you need to check query parameters you're going to have to write your own matcher.  We have one in one of our apps now, **redirect_to_with_params** that does exactly this, we're hoping to give it back to the merb community shortly.

### Markup Validation

**have_selector** is what you should be using to validate HTML markup.  It
allows you to specify [CSS 3 Selectors](http://www.w3.org/TR/css3-selectors)
to identify the presence of certain markup.  If you're into that
[jquery](http://jquery.com) thing, it's great practice for selectors
in js too.  Let's say we want to check for the presence of the 'Hello World'
string in the following example.

<script src="http://gist.github.com/30365.js">
</script> 

In your spec you'd have something like the following:  

<script src="http://gist.github.com/30366.js">
</script>

It's pretty straightforward, find the div with an h2 that has the dom id of
'hello' and contains the string 'Hello World'.  Now is a good time to review
the example specs above, hopefully you can visualize the markup that those
specs require now.

**have_xpath** is the slightly older cousin of have_selector.  Instead of CSS 3
Selectors you specify an [xpath](http://www.w3.org/TR/xpath) that should be
present in the response document.  I've gotten in the habit of only using this
for XML documents.  Let's see the Hello World example done with xpath.

<script src="http://gist.github.com/30367.js">
</script>

### 3.3 Roll Your Own
Rolling your own RSpec matchers is the super pimp stuff.  You can cut down on
duplication in your tests by coming up with an expressive name for certain
situations, their responses, and the markup that's returned. Here's a little
matcher we wrote in flatirons that handles unauthenticated requests returned by
merb-auth.

<script src="http://gist.github.com/30368.js">
</script>

We put this matcher into our spec/spec_helper.rb file and included it into our
rspec environment with the following code.

<script src="http://gist.github.com/30369.js">
</script>

So that's about it for the merb controller testing intro.  Now that we've
discussed the basics of testing we can get back into
[flatirons](http://github.com/atmos/flatirons) and talk about how things are
tested in that app.

I'm sure I made some errors in here, please offer up corrections in the
comments and I'll try to work the fixes into the article soonish.
