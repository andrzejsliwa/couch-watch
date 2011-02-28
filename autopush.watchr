#!/usr/bin/env watchr

require 'rubygems'
require 'couchrest'
require 'ruby-growl'
require 'json'

Signal.trap('INT' ) { abort("\nTerminated Successfully.") } # Ctrl-C

def check_file(filename)
  filepath = File.join(Dir.pwd, filename)

  unless File.exist?(filepath)
    puts "missing #{filename}"
    exit
  end
  filepath
end

def push(dbname, appname, growl)
  growl.notify("CouchApp AutoPush", "CouchAPP '#{appname}' Pushed", "default & test", 1, true)
  couch = CouchRest.new("http://localhost:5984")
  db = couch.database(dbname)
  db.delete! rescue nil

  run "soca push"
  run "soca push test"
end

def run(cmd)
  puts   cmd
  system cmd
end

couchapprc = check_file(".couchapprc")
couchapprc = JSON.parse(File.read(couchapprc))
dbname = couchapprc["env"]["test"]["db"].match(/\d\/(\S*)$/m)[1]

configjs = check_file("config.js")
configjs = JSON.parse(File.read(configjs))
appname = configjs["id"]

growl = Growl.new("localhost", "ruby-growl", ["CouchApp AutoPush"])
growl.notify("CouchApp AutoPush", "CouchAPP Pusher Started", "default & test.", 1, true)
push(dbname, appname, growl)

watch('.*') do |m|
  unless m[0].match(/\/.idea\//) or m[0].match(/\/.git\//)
    puts "#{m[0]} was changed."
    push(dbname, appname, growl)
  end
end




