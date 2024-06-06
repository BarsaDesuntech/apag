rm ios-debug.bundle
rm ios-debug.bundle.map
rm android-debug.bundle
rm android-debug.bundle.map
curl "http://localhost:8081/index.bundle?platform=ios&dev=true&minify=false" > ios-debug.bundle
curl "http://localhost:8081/index.bundle.map?platform=ios&dev=true&minify=false" > ios-debug.bundle.map
curl "http://localhost:8081/index.bundle?platform=android&dev=true&minify=false" > android-debug.bundle
curl "http://localhost:8081/index.bundle.map?platform=android&dev=true&minify=false" > android-debug.bundle.map
version="$(json=$(<package.json) node -pe "JSON.parse(process.env.json)['version']")"
curl https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=d4b7d9f4a2fcf28167fac38085fc19c5 \
   -F appVersion=$version \
   -F dev=true \
   -F platform=ios \
   -F sourceMap=@ios-debug.bundle.map \
   -F bundle=@ios-debug.bundle \
   -F projectRoot=`pwd` \
   -F overwrite=true
curl https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=d4b7d9f4a2fcf28167fac38085fc19c5 \
   -F appVersion=$version \
   -F dev=true \
   -F platform=android \
   -F sourceMap=@android-debug.bundle.map \
   -F bundle=@android-debug.bundle \
   -F projectRoot=`pwd` \
   -F overwrite=true

