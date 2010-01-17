--- 
layout: post
title: The Pnuma Dilemma
---
h3. Intro

The guys from "Pnuma Trio":http://www.pnumamusic.com are fine musicians, and technically savy enough to have whipped up their current site in flash.  It's a pretty cool design and you can find out a little bit about the band.  It wasn't terribly complex, the main requirements to the site were:

* About 
* Upcoming Shows
* Contact (Booking,Band,Manager,etc)
* Merchandise(not selling via the web)
* Links to downloads

They're traveling quite a bit these days touring, and the maintenance was starting to add up.  My main goal was to just make it easier on Alex so he could focus on what he loves, music.

h3. Approach

I'd obviously be using rails for anything on the web.  "Typo":http://typo.leetsoft.com seemed like a good place to start since I was already familiar with its codebase.  If need be I could hack in some custom stuff for the guys, but I wanted to make use of stuff that was out there already if possible.    The Pnuma guys are also "Apple":http://www.apple.com guys so I could easily point them to "ecto":http://ecto.kung-foo.tv/ for workign with their site content.  One of the most frequent tasks Alex was having to do was update the site with was changes/additions to the tour schedule.  While setting up their typo sidebars I noticed the "upcoming.org":http://upcoming.org sidebar module and looked into it.  

h3. Upcoming

"upcoming.org":http://upcoming.org considers itself a "a social event calendar, completely driven by people like you. Manage your events, share events with friends and family, and syndicate your calendar to your own site."  So I started looking to see how hard it would be to have all of their tour available on upcoming.org.  I decided to try to copy over as much of their tour schedule to upcoming.org to test out the services.  

There are three reasons I think upcoming.org can be pretty valuable to bands, Venue information, Web Services, and RSS feeds.  

The biggest advantage I see there is the shared Venue information.  I can't remember the number of times I've looked online to see where a show is and had trouble finding a number or exact address.  As I was filling in part of the pnuma schedule about half of the venues already had all of the information filled in.  This includes addresses, links to mapquest, phone numbers, website if available all of that good stuff. :)  

!>/files/pnuma_upcoming_sidebar.jpg!

Now that there was an upcoming.org schedule for pnuma I figured I could just sit back and leverage the Typo sidebar.  It did work, but the events looked similar, "Pnuma Trio" a link to the event on upcoming.org followed by the name of the venue.  This presentation is cool if you're just keeping up with your own tasks, but for listing upcoming shows for a touring band this sucks.  It turns out the RSS feeds from upcoming don't really give you the kind of information you'd want available if you were displaying tour information.  After digging through the code that powered the plugin, I decided that the RSS alone didn't contain all the information I'd need.  I wanted to display the date of the show, the name of the venue, the city, and the state. I'd have to use their web services... :'(

It turns out "derek wise":http://derek.leftwise.com/ has already written some nice "ruby bindings for working with the upcoming.org web services":http://derek.leftwise.com/?p=4#cut-1.  So I wrote some test code to see what kind of information I could extract with it.  Their data model is kinda awkward at first, but it all became clear as I tried to extract the information I needed.  What I ended up doing was scraping the RSS feeds and getting the upcoming event ids.  With those event ids I could go back and track down the venue, city, state, and country info.  I had to modify the innards of the upcoming.org sidebar plugin to handle my new approach, but it was pretty easy.  (It was at this point I realized how nasty the sidebar plugin stuff in typo really is).

By using upcoming.org I cut out a shitload of coding I didn't really wanna do it in the first place.  All I needed to do was a little data transformation.    I just need to show Alex how to add his shows to upcoming.org and the website will get them for free.  The user experience for tracking down show info should be considerably more pleasant.  With a nightly rake task to purge their typo cache the sidebar should always be current.

h3. Any old theme will do

It wasn't really as simple as that.  Typo is themeable though, so I figured I'd take a look at "typogarden":http://www.typogarden.com/ to find a suitable theme while I was fleshing out ideas.  I went with "lush":http://www.typogarden.com/articles/2005/11/28/lush-theme by "Marco":http://www.w3-labs.com/.  After removing the ladybugs(sorry man), and removing the static About page info from the default layout, I had something I could work with.  There's also some "customization":http://www.w3-labs.com/pages/personalize you can do to the theme to make it a little more personalized.

h3. Loose Ends

The static pages in typo can easily handle the rest of the requirements.  Contact pages, band members , merchandise, and links to downloads.  Most of this was just copying the content over from the other site, but this about covered everything that the band needed for their site. 

h3. Outro

At this point I don't know if they'll migrate to the "prototype site":http://pnuma.atmos.org I whipped up.  I got feedback from Alex and he likes it, but wants to add more band specific stuff(as I expected).  I'm down to keep helping him if he wants to go this route, once they're setup it should be self maintainable.  It was definitely an interesting way to spend a Saturday. :)
