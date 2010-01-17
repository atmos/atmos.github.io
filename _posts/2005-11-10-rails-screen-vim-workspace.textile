--- 
layout: post
title: Rails + Screen + VIM Workspace
---
Basically the approach is a ruby script 'script/editor' and a custom screen configuration.  By using these it opens up a bunch of screen windows in the directories you commonly use in rails.

There were two main annoyances I found with it:
* It'd start a named screen session, but you coudln't reattach to it if you detached via screen(easily).  
* He wanted you to link $HOME/.rails to the current rails workspace you were calling his script/editor out of.  I might've really missed something, but I didn't see a point in it.

I fixed the first annoyance by changing how screen was invoking the session.  I modified it to force a detach and reattach if there is already a screen process for this app, otherwise creates one.

The second annoyance I solved my changing some variables in the script.  Instead of having to link ~/.rails to the workspace you want to work out of, the script is smart enough to know what workspace it is being executed from.

I've uploaded my modifications to this screen/vim hack, you can "download them":http://www.atmos.org/files/rails-editor.tar.gz.  Extract the .tar.gz to the root of your rails application and call 'ruby script/editor'.
