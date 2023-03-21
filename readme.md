# map

## commands notes

```sh

# crop out region from python script
magick '*.jpg[5936x2960+968+1429]' cropped-%03d.png

# resize to mininum given size
magick '*.jpg[1920x1080^]' ../resized/%03d.jpg



convert './*.jpg' -dither FloydSteinberg -remap pattern:gray50 ./dither/%03d.jpg

convert './*.jpg' -resize 960 -colorspace gray -ordered-dither o8x8 ../dither_ordered/%03d.jpg

ffmpeg -framerate 30 -pattern_type glob -i '*.jpg' -tune film -c:v libx264 -x264-params keyint=5:scenecut=0 -pix_fmt yuv420p ./out.mp4
```
