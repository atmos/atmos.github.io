--- 
layout: post
title: Rails Plugins
---
I spent some time playing with "plugins":http://wiki.rubyonrails.com/rails/pages/Plugins and edge "rails":http://www.rubyonrails.com over the weekend.  Some of my favorites include:

* "liquid":http://home.leetsoft.com/liquid/ : xal's template engine, "demo":http://leetsoft.com/rails/liquid-installation.mov.
* login_engine : non-localized, pluggable salted login framework. "demo":http://rails-engines.rubyforge.org/movies/engines_intro.mov.
* assert_valid_markup : allows you to validate your markup in functional tests.

One area that's kinda of awkward at the moment is plugins that require schema modifications.  login_engine handled it well by providing a schema import file.  <pre>rake db_schema_import # (in RAILS_ROOT/plugins/login_engine directory)</pre>

The plugin architecture makes for some interesting possibilities.  If people start developing plugins properly, a lot of work can be cut down to simply gathering the appropriate plugins for the task.  There'd be a small amount of overhead to tie them all together, but I could see lots of people doing normal apps quickly if they leverage well written plugins.
