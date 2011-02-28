#!/usr/bin/env watchr

require 'rubygems'
require 'couchrest'

watch('.*') do |matches|
  puts matches
  unless matches.to_a.select { |item| item.match(/\/.idea\//) or item.match(/\/.git\//)}
    puts "dziala: #{m}"
    puts ".couchapprc"
    #puts "file" + filepath

    #@config = JSON.parse(File.read(filepath))

  end
end

Signal.trap('QUIT') { puts "t1"  } # Ctrl-\
Signal.trap('INT' ) { abort("\n") } # Ctrl-C

def push

  couch = CouchRest.new("http://localhost:5984")
  db = couch.database('tweeti-test')
  db.delete! rescue nil

  run "soca push"
  run "soca push test"
end

def run(cmd)
  puts   cmd
  system cmd
end
