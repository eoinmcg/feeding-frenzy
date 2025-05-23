#!/bin/bash

VER=$(awk -F'"' '/"version": ".+"/{ print $4; exit; }' package.json)
NAME=$(awk -F'"' '/"name": ".+"/{ print $4; exit; }' package.json)
COMMIT=$(git rev-parse --short=6 HEAD)

FILE="${NAME}-${VER}.zip"

DIR=FeedingFrenzy/

# add version number to build
INDEX_HTML="dist/index.html"
SEARCH="</body>"
REPLACE="<script>const BUILD='v-${VER}-c-${COMMIT}';console.log('🐸', BUILD)</script></body>"

# Use a different delimiter (# in this case) to avoid conflict with slashes in the replacement
sed -i "s#$SEARCH#$REPLACE#g" "$INDEX_HTML"
# Confirm the change
echo "Replaced '$search_pattern' with '$replacement_text' in $file_path"

cp public/*.svg dist/assets
rm *.zip
cp -r dist/ $DIR
zip -r $FILE $DIR
rm -rf $DIR



echo -e "\n-----------------\n"
echo "CREATED: ${FILE}"
