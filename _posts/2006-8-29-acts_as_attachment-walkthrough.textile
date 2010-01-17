--- 
layout: post
title: Acts_As_Attachment Walkthrough
---
Recently a couple of my co-workers had been playing around with a tumblelog idea.  We paste tons of links, images, and quotes to each other daily on our IRC channel at work.  "Rick":http://www.rickbradley.com/ seems to think there is some value in capturing these things, thus we're tumbling.  They basically wrote an IRC bot using "rice":http://arika.org/ruby/rice.en that captures links, images, and quotes if they match simple regexes.  One thing that really sucked about the first iteration of the tumblelog was that images were inlined from the remote url.  If the image was large it looked really fugly and was often chopped off due to the styling.  It also has the downside of being linked to a remote server where the image could go away.  So over a beer or two the other night Rick and I added "acts_as_attachment":http://svn.techno-weenie.net/projects/plugins/acts_as_attachment/ functionality to the tumblelog.  

We had three goals.  First we wanted to pull the image down from the remote site and cache it on the tumblelog server. Second we wanted to resize the images, creating one that fit the css style and one that was a little thumbnail.  Third we wanted to enjoy a beer or two while we did it.  I knew acts_as_attachment could do all of this for us, but it was normally used directly with html forms.  While the "documentation":http://technoweenie.stikipad.com/plugins/show/Acts+as+Attachment "is":http://weblog.techno-weenie.net/articles/acts_as_attachment "sparse":http://weblog.techno-weenie.net/articles/acts_as_attachment/thumbnailing technoweenie's code is usually pretty easy to sift through.  So off we went installing the plugin and setting up the migration to accommodate aaa.  Disclaimer: I tend to install plugins this way, sue me.

<pre>cd vendor/plugins
svn export http://svn.techno-weenie.net/projects/plugins/acts_as_attachment/
svn add acts_as_attachment
cd ../..
script/generate migration aaa_yo
svn add db/migrate/002_aaa_yo.rb
</pre>

We edited the migration to add a few new columns to the posts table, and ran rake migrate.

<filter:jscode lang="ruby">
class AaaYo < ActiveRecord::Migration
  def self.up
    add_column "posts", "parent_id", :integer
    add_column "posts", "thumbnail", :string
    add_column "posts", "width", :integer
    add_column "posts", "height", :integer
    add_column "posts", "filename", :string
    add_column "posts", "content_type", :string
    add_column "posts", "size", :integer

  end

  def self.down
    remove_column "posts", "parent_id"
    remove_column "posts", "thumbnail"
    remove_column "posts", "width"
    remove_column "posts", "height"
    remove_column "table", "filename"
    remove_column "posts", "content_type"
    remove_column "posts", "size"    
  end
end
</filter:code>

Next we devised a little unit test for this new functionality.  It was pretty simple to do and also helped limit the scope of what we needed done.

<filter:jscode lang="ruby">
def test_image
  assert_difference Image, :count do
    image = Image.create(:author => 'atmos', :url => 'http://www.google.com/images/logo_google_suggest.gif')
    assert image.valid?, image.errors.full_messages.join("\n")+image.inspect
    assert_equal 'atmos', image.author
    assert_equal 'logo_google_suggest.gif', image.filename
  end
end
</filter:code>

After that autotest picked up the change and ran the test, it failed. :(

<pre>
  1) Failure:
test_image(PostTest)
    [test/unit/post_test.rb:38:in `test_image'
     ./test/unit/../test_helper.rb:30:in `assert_difference'
     test/unit/post_test.rb:34:in `test_image']:
<"logo_google_suggest.gif"> expected but was
<nil>.
</pre>

Since we hadn't actually added the macro to our Image class yet the filename attribute wasn't being set.  So it was time to open up the Image class(which is a child of Post).  We setup the two sizes of thumbnails(keeping aspect ratio), and we used file system storage(instead of storing the images in the database directly).

<filter:jscode lang="ruby">
class Image < Post
  acts_as_attachment :thumbnails => { :normal => '300>', :thumb => '75' }, :storage => :file_system
  validates_as_attachment
end
</filter:code>

<pre>
  1) Failure:
test_image(PostTest)
    [test/unit/post_test.rb:36:in `test_image'
     ./test/unit/../test_helper.rb:30:in `assert_difference'
     test/unit/post_test.rb:34:in `test_image']:
Content type can't be blank
Size is not included in the list
Size can't be blank
Filename can't be blank#<Image:0x22ec180 @new_record=true, @attributes={"content_type"=>nil, "size"=>nil, "thumbnail"=>nil, "updated_at"=>nil, "poster"=>nil, "title"=>nil, "type"=>"Image", "author"=>"atmos", "url"=>"http://www.google.com/images/logo_google_suggest.gif", "description"=>nil, "db_file_id"=>nil, "filename"=>nil, "height"=>nil, "parent_id"=>nil, "width"=>nil, "created_at"=>nil}, @errors=#<ActiveRecord::Errors:0x22eb118 @base=#<Image:0x22ec180 ...>, @errors={"content_type"=>["can't be blank"], "size"=>["is not included in the list", "can't be blank"], "filename"=>["can't be blank"]}>>.
<false> is not true.

</pre>

The tests were still failing but we saw a bunch of new errors that weren't present before.  These were validators you get for free with your call to 'validates_as_attachment' in your class.  We made a little progress but now it was time to hook in the code that actually fetches the Image from the net.  We wanted it to run before the validations(so we could use the built-in acts_as_attachment validators) and we only wanted it to run when the item is created.  Luckily ActiveRecord hooks us up with a callback we can leverage, "before_validation_on_create":http://caboo.se/doc/classes/ActiveRecord/Callbacks.html#M005602.  In this function we pulled the image down from the web, and had it fail gracefully if anything went wonky.  The url attribute of the Image class contains the URL for the image out on the web.  We used that as input in our before_validation callback.

<filter:jscode lang="ruby">
require 'net/http'
require 'uri'

class Image < Post
  acts_as_attachment :thumbnails => { :normal => '300>', :thumb => '75' }, :storage => :file_system
  validates_as_attachment
	
  def before_validation_on_create
    uri = URI.parse(self.url)    
    server, path, basename = uri.host, uri.path, File.basename(uri.path)
    Net::HTTP.start(server) do |http|
      resp = http.get(path)
      return true unless resp.kind_of?(Net::HTTPOK)
      self.attachment_data = resp.body
      self.filename = basename
      self.content_type = resp.content_type
    end
    self.url = self.public_filename
  rescue
    true
  end
end
</filter:code>

Back to our test again we saw the following error.

<pre>
  1) Failure:
test_image(PostTest)
    [./test/unit/../test_helper.rb:31:in `assert_difference'
     test/unit/post_test.rb:34:in `test_image']:
Image#count.
<52> expected but was
<54>.
</pre>

Where the hell were the extra two objects coming from?  They were our normal and thumbnail sized images of course.  I had no idea it was going to do that, but it made sense once I saw the error.  The parent_id column we added in the migration allows the normal and thumbnail Images to know who they belong to.  So at this point we went back to our test one last time and set our assert_difference to expect 3 new Images to be created.  We also through the course of our debugging discovered the 'public_filename' method and figured we'd give some insight into the expected behavior of this function.  The resulting test looked like the following.

<filter:jscode lang="ruby">
def test_image
  assert_difference Image, :count, 3 do   # 2 thumbnails and the original image
    image = Image.create(:author => 'atmos', :url => 'http://www.google.com/images/logo_google_suggest.gif')
    assert image.valid?, image.errors.full_messages.join("\n")
    assert_equal 'atmos', image.author
    assert_equal 'logo_google_suggest.gif', image.filename
    assert_equal "/posts/#{image.id}/logo_google_suggest_normal.gif", image.public_filename('normal')
    assert_equal "/posts/#{image.id}/logo_google_suggest_thumb.gif", image.public_filename('thumb')
  end
end
</filter:code>

Our unit tests now ran successfully, but there were two side effects of what we'd done.  First the index of the site that lists the postings will now see all three versions of the image we'd uploaded.  So we needed to come up with a way to ignore the duplicate/thumbnailed posts.  Second we needed to keep in mind that we were using the file system to store the cached images.  These images would go away between "capistrano":http://manuals.rubyonrails.com/read/book/17 deployments.

To get around the first problem above we added a class method to our base class, Post.  Since we used the find in more than one place(the index page and the rss feed) it made sense to keep it DRY.  We did have to update our controller in two actions, but it was a lot nicer and if we need to make future enhancements we can do it all in one place.

<filter:jscode lang="ruby">
class Post < ActiveRecord::Base
  def self.find_all_posts
    self.find(:all, :order => 'created_at DESC', :conditions => 'parent_id is NULL')
  end
end
</filter:code>

To solve the second problem above we created a posts directory in the 'shared' directory capistrano provides.  We then added a little hook in our deploy.rb that would symlink the posts directory after each deployment.  Since the shared directory persists between deployments we don't have to worry about it getting wiped out anymore. :)

<filter:jscode lang="ruby">
desc "Copies appropriate files in after the code is put into place"
task :after_update_code, :roles => :app do
  put(File.read('config/database.yml'), "#{release_path}/config/database.yml", :
mode => 0444)
  run <<-EOF
    cd #{release_path} && 
    ln -s #{shared_path}/posts #{release_path}/public/posts
  EOF
end
</filter:code>

All we had to do after that was run rake one last time(to make sure it all worked) and commit that mofo.  After that we just ran rake deploy and took a sip off our beers.

<pre>svn commit -m "woot, cache thumbnails, test them, and DRY up the controllers some"
...
rake deploy
</pre>
