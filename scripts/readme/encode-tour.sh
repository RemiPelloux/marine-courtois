#!/usr/bin/env bash
# Encodes docs/assets/.video/tour.webm into an MP4 and a README-friendly GIF.
set -euo pipefail
IN=docs/assets/.video/tour.webm
ffmpeg -y -loglevel error -ss 0.6 -i "$IN" -vf "setpts=PTS/1.25" -c:v libx264 -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart docs/assets/tour.mp4
ffmpeg -y -loglevel error -ss 0.6 -i "$IN" -vf "setpts=PTS/1.35,fps=8,scale=720:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=48:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" docs/assets/tour.gif
ls -lh docs/assets/tour.*
