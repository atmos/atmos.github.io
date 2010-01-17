--- 
layout: post
title: Leave Home
---
<a href="http://www.atmos.org/files/typo_image_gallery_large.png"><img src="http://www.atmos.org/files/typo_image_gallery_small.png" alt="some of the admin interface" align="right" /></a>
The ball is rolling on my rails gallery rewrite.  I'm basically patching it into the admin interface in "typo":http://typo.leetsoft.com.  So far I've implemented:
* multi-file uploading
* exif info serialization
* thumbnailing with proper orientation based on exif info
* simple naming and short descriptions

I'm hoping to add the following features in the days to come:
* tagging
* view 'gallery' by tag, w/ ajax navigation
* drag and drop ordering on a per tag basis
* ajax slideshows kinda like "this":http://www.triplecrownbouldering.org/galleries/houndears/index.php#1

I don't know how this will all fit in with typo in the long run.  I don't think it really has the need for a gallery module.  I'm just going to keep it in my separate repo and overlay it onto my site.  

I messed around some with "script.aculo.us":http://script.aculo.us "Sortable":http://script.aculo.us/ objects the other day.  It basically gives a nice feel to dynamic reordering of lists or other simple collections.  Of course after doing it all manually I notice "rails":http://www.rubyonrails.com has it "builtin":http://api.rubyonrails.com/classes/ActionView/Helpers/JavaScriptHelper.html#M000408.    I did notice the "wiki topic":http://wiki.rubyonrails.com/rails/show/HowToUseDragAndDropSorting on this was outdated/erroneous which I corrected.  I don't dig the fact that rails makes you render a partial after the remote call, but oh well.

I've got some new "climbing shoes":http://www.fiveten.com/product_frame_shoes.php?CAT=VCS&ID=3 on the way.(Lame link can't find anything but a frame on the fiveten site) :[
