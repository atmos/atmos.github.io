---
layout: default
title: Camo ~ Making Insecure Assets Look Secure
zip_url: https://github.com/atmos/camo/zipball/master
issue_url: https://github.com/atmos/camo/issues/new
repository_url: http://github.com/atmos/camo
---

<h1>Camo - Image Proxy</h1>
<hr/>

<h2>History</h2>

Camo is an http image proxy that is all about making it easy for developers to do right by your users who link to images. When it was written in 2010 as a response to [firesheep](https://codebutler.github.io/firesheep/) SSL everywhere wasn't a thing. We built an HTML [post-processing](https://github.com/jch/html-pipeline) engine around rewriting and proxying everything so we didn't leak information about our users.

<h2>What It Gives You</h2>

We want to allow people to keep embedding images in comments/issues/READMEs without worrying about who is monitoring their activity.

[There's more info on the GitHub blog](https://github.com/blog/743).

Camo currently runs on node version 0.10.29 at GitHub on Heroku's cedar-14 stack.

<h2>Features</h2>
<ul>
  <li>Proxy images under 5 MB</li>
  <li>Follow redirects to a configurable depth</li>
  <li>Proxy remote images with a content-type of image/*</li>
  <li>404s for anything other than a 200, 301, 302 or 304 HTTP response</li>
</ul>

<h2>Deployment</h2>

Heroku is the best way to deploy this.
