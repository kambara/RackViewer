#!/usr/bin/ruby
# -*- coding: utf-8 -*-

## ダミー画像生成
## 1~12の棚につき、1年以内の画像をランダムで100枚生成する。
## 03_1_1289835713.jpg

require 'rubygems'
require 'RMagick'

def main
  template_image = Magick::Image.read('template.jpg').first
  (1..12).each do |tana_id|
    100.times do
      make_image(template_image.clone, tana_id, rand_time)
    end
  end
end

def rand_time
  sec = Time.now.to_i - rand(365 * 24 * 60 * 60)
  Time.at sec
end

def make_image(template, tana_id, time)
  filename = "images/%02d_1_%d.jpg" % [tana_id, time.to_i]
  text = "Tana#{tana_id}\n#{time.strftime("%Y/%m/%d %H:%M:%S")}"
  draw = Magick::Draw.new
  draw.annotate(template, 0, 0, 0, 0, text) do
    draw.gravity = Magick::CenterGravity
    draw.pointsize = 50
    draw.font_weight = Magick::BoldWeight
    draw.fill = "black"
    draw.stroke = "white"
    draw.stroke_width = 2
  end
  template.write(filename)
end

main


__END__

# Rmagickインストール

    $ sudo apt-get install ruby1.8-dev rmagick libmagickwand-dev
    $ sudo gem install rmagick

もしくは

    $ sudo apt-get install librmagick-ruby
