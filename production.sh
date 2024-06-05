rm ios-release.bundle
rm ios-release.bundle.map
rm android-release.bundle
rm android-release.bundle.map
cd android
./gradlew bundleRelease
cd ..

npx react-native bundle \
  --platform ios \
  --minify \
  --dev false \
  --entry-file index.js \
  --bundle-output ios-release.bundle \
  --sourcemap-output ios-release.bundle.map \
  --assets-dest ./build
npx react-native bundle \
  --platform android \
  --minify \
  --dev false \
  --entry-file index.js \
  --bundle-output android-release.bundle \
  --sourcemap-output android-release.bundle.map \
  --assets-dest ./build
version="$(json=$(<package.json) node -pe "JSON.parse(process.env.json)['version']")"

curl https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=d4b7d9f4a2fcf28167fac38085fc19c5 \
   -F appVersion=$version \
   -F dev=false \
   -F platform=ios \
   -F sourceMap=@ios-release.bundle.map \
   -F bundle=@ios-release.bundle \
   -F projectRoot=`pwd` \
   -F overwrite=true

curl https://upload.bugsnag.com/react-native-source-map \
   -F apiKey=d4b7d9f4a2fcf28167fac38085fc19c5 \
   -F appVersion=$version \
   -F dev=false \
   -F platform=android \
   -F sourceMap=@android-release.bundle.map \
   -F bundle=@android-release.bundle \
   -F projectRoot=`pwd`
