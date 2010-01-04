--- 
layout: post
title: Rails File Collection Uploads
---
I didn't have too many requirements when approaching this.  I mainly wanted the following features:
# Support extracting 1 or more file collections
# Support .zip/.tar/.tar.gz/.tar.bz2
# Provide an easy way to search through the extracted folders.

Supporting 1 above was relatively easy.  Have the initialize function for my class check the type of file that's passed to it, and handle it accordingly.  Internal to the class the one or more file collections are represented by a hash, the filename being the key, and the extension being the value.  I found I had to keep track of the extension because the CGI Tempfile objects uploaded don't have file extensions.  I worked around this by snipping the file extension off of the original_filename value you get with the upload object.  The class creates a directory in /tmp which is a SHA1 hash of the time the class was created, the object's id, and the process id.  This should(hopefully) be collision free.

Supporting 2 above wasn't that hard once  1 above was in place.  I simiply had to open the man pages for tar and unzip to see exactly what options need to be passed to each command in order to have files extract w/o ever prompting for user input.  Each file collection should have its own subdirectory in the class's /tmp directory to prevent one collection from overwriting another while extracted.

Supporting 3 above is also pretty easy.  I wrote a little convenience function that takes a regular expression.  That regular expression uses ruby's Find function and traverses through the file collections folder in /tmp.  If for some reason you'd want some sort of more powerful search you can use the 'dir' attribute in the class to do your custom search.  

The file collection class is as follows.

<typo:code lang="ruby">
require 'digest/sha1'
require 'find'

class FileCollection
  attr_reader :collections, :dir

  def initialize(file, extension = '.tar.gz')
    @collections = { }
    @extension = extension
    if file.kind_of?(Array)
      file.each { |f| @collections[f] = extension }
    elsif file.kind_of?(Hash)
      @collections = file
    elsif file.kind_of?(String)
      @collections[file] = extension
    end
    raise if @collections.empty?
    time = Time.now.to_s+(Process.pid*Process.pid*self.object_id).to_s
    @dir = "/tmp/#{Digest::SHA1.new(time).hexdigest}"
  end

  def process
    m = { '\.tar\.gz' => 'tar xzf', '\.tar\.bz2' => 'tar xjf', '\.tar' => 'tar xf', '\.zip' => 'unzip -o' }
    Dir.mkdir(@dir)
    Dir.chdir(@dir) do
      @collections.each do |c,extension|
        tmpdir = Digest::SHA1.new(c).hexdigest
        Dir.mkdir(tmpdir)
        Dir.chdir(tmpdir) do
          m.each do |pattern,cmd|
            if c =~ /#{pattern}/ or extension =~ /#{pattern}/i
              IO.popen("#{cmd} #{c}") { |io| }
            end
          end
        end
      end
    end
    self
  end

  def delete
    `rm -rf #{@dir}`
  end

  def find(pattern)
    results = [ ]
    Find.find(@dir) do |file|
      next if File.directory?(file)
      results.push(file) if file =~ pattern
    end
    results
  end
end
</typo:code>

In exhibits my controller has something like the following to handle the uploads.  And voila, my app now supports uploading file collections. :)

<typo:code lang="ruby">
def new
  if request.post?
    images = %r/gif|png|jpg|jpeg/i
    file = params[:images][:file]
    if file.content_type.chomp =~ images
      # handle individual file
    else
      fc = FileCollection.new(file.local_path, file.original_filename.sub(/.
*?((\.tar)?\.\w+)$/, '\1')).process
      fc.find(images).each do |compressed|
        # handle individual file
      end
      fc.delete
    end
    redirect_to :action => 'list' and return
  end
end
</typo:code>

I've "attached":http://www.atmos.org/files/file_collection.tar.gz the class, the unit test, and some mock objects that can easily be dropped into a rails project for use.  If you've got a cooler approach, or think my attempts at solving this suck.  Lemme know.
