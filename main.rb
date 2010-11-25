#!/usr/bin/ruby
# -*- coding: utf-8 -*-

require 'rubygems'
require 'sinatra'          ## gem install sinatra
require 'sinatra/reloader' ## gem install sinatra-reloader
require 'json'             ## gem install json または json_pure

get '/' do
  ## public/ 以下のディレクトリ名を指定する
  @image_dir = 'box-images'
  @filenames = Dir.glob("public/#{@image_dir}/*.jpg").map {|file|
    File.basename(file)
  }
  erb :index
end
