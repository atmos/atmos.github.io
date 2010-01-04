--- 
wordpress_id: 33
layout: post
title: Link to Unimplemented
wordpress_url: http://atmos.org/?p=33
---
I ran across <a href="http://www.robbyonrails.com/articles/2008/03/27/tip-link-to-unimplemented">this post</a> by <a href="http://www.robbyonrails.com">Robby Russell</a> a while back and really liked the idea.  It reminded me a little bit of an older post by <a href="http://entp.com">Courtenay</a> where he came up with the <a href="http://blog.caboo.se/articles/2007/3/29/tongue-in-cheek-icon-set">Tongue in Cheek Icon Set</a>.  The general idea is that you're not done with the application, there's non-functional pieces of the UI that are at least partially exposed, and you need to make sure the client knows that these things aren't complete.

In Robby's post he implemented a simple javascript function that could be called via a custom link helper.Nice and simple.  Here's the js:
<script src="http://gist.github.com/13902.js"></script>And here's the ruby to invoke it: <script src="http://gist.github.com/13903.js"></script>

I've grown pretty fond of <a href="http://jquery.com/">Jquery</a> since I spent the better part of the year working with <a href="http://yehudakatz.com/">Yehuda</a> on a merb app.  When I'd whip up some js in the style above he'd sit down with me and show me how wrong I was.  So when I needed to actually use something like 'link to unimplemented' in my app last night I went about it in a slightly different way.

It's actually really simple.  You just attach an 'unimplemented' class to any anchor that you don't want folks to follow.  It's cool because you can attach the real URL to the anchor and when the time comes to use it you simply remove the class.  Here's the js.
<script src="http://gist.github.com/13907.js"></script>
Here's some haml taking advantage of it.
<div class="thumbnail"><a href="http://skitch.com/atmos/amw8/untitled.haml"><img src="http://img.skitch.com/20080930-jmequreem78w49djyrj56w733.preview.jpg" alt="untitled.haml" /></a><br /><span style="font-family: Lucida Grande, Trebuchet, sans-serif, Helvetica, Arial; font-size: 10px; color: #808080">Uploaded with <a href="http://plasq.com/">plasq</a>'s <a href="http://skitch.com">Skitch</a>!</span></div>
So there it is.  A simple and effective way to keep clients from wandering to the parts of your site that you really don't want them visiting yet.
