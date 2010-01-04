--- 
layout: post
title: Datebocks as a Plugin
---
Everyone is pretty well aware of the fact that the date and date time selectors in rails suck.  We went looking for alternatives the other week for our project at work.  We stumbled across "datebocks":http://datebocks.inimit.com/ which was more or less acceptable for our needs.  People seemed considerably more receptive to that kind of interface, so we figured we'd use it in our app.

Datebocks is an *engine plugin* though, seriously no one in their right mind uses engines, right?  Apparently we hadn't discussed this enough amongst our team because low and behold one morning my svn up was pulling engines into my tree.  I pretty much lost it and gutted out the useful parts of the plugin(all of two ruby functions) and the asset files(js,html,css) so we could ditch the engine dependency.  After fixing the invalid markup that comes w/ the datebocks engine(you can only have 1 datebocks entry per page or your markup is invalid) we were back on track.  We have our own little extension plugin where we can throw monkey patches or custom extensions, so it lived in there for a week or so, quite happily(but untested).

Fast forward to last week and I notice someone else has taken the datebocks plugin and gutted it(mainly due to the engine dep).  So I thought, let's just make a real plugin real rails hackers would be inclined to use.  So I created a "new plugin":http://svn.caboo.se/plugins/atmos/calendar_date_selector which overrides the default form builder's date_select and the date_select_tag, it also has a little rake task to drop the assets into place in your public/ folders.  For us this approach was really cool because with this one plugin all of our date_selects in our system were magically using this new, slightly better, user interface for inputting dates.  From the development side it was really cool because I wrote tests for the plugin and found two bugs. :)

Anyways test it out, talk shit, I don't care.  Just wanted to put it out there, there is an alternative to engines and datebocks. :)
