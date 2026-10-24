#!/bin/sh
# Renders the link preview images (JPEG, kept well under the ~300 KB WhatsApp limit) into public/images/social/ with headless Chrome.
# Usage: scripts/social-images/generate.sh   (set CHROME to the Chrome/Chromium binary if needed)
set -eu

dir=$(cd "$(dirname "$0")" && pwd)
out="$dir/../../public/images/social"
chrome=${CHROME:-"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}
mkdir -p "$out"

tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

for lang in en fr; do
  for spec in og:1200x630 x:1200x675 square:1200x1200; do
    format=${spec%%:*}
    size=${spec#*:}
    width=${size%x*}
    height=${size#*x}
    # Headless Chrome's viewport is shorter than the window: render taller, then keep the centre (macOS sips)
    "$chrome" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 \
      --allow-file-access-from-files --virtual-time-budget=3000 \
      --window-size="$width,$((height + 200))" --screenshot="$tmp/shot.png" \
      "file://$dir/template.html?lang=$lang&format=$format" 2>/dev/null
    sips -c "$height" "$width" -s format jpeg -s formatOptions 88 "$tmp/shot.png" --out "$out/$format-$lang.jpg" >/dev/null
    echo "$out/$format-$lang.jpg"
  done
done
