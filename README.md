APAG App

# Instructions

1. Run 'npm install'

2. The instructions how to start the app relate to the OS you want to run it on

For Android:

- Run 'react-native run-android' (for release build add '--variant="release"')

For iOS:

- Open the APAG.xcworkspace file from the iOS folder using XCode
- To run just use Cmd + R or Product > Run

3. To enable live code changes just shake the phone and "Enable Live Reload"/"Enable Hot Reload"

# Debugging

Just shake the phone and hit "Debug JS Remotely". A browser window will open where you can use the normal Chrome Developer Tools
I recommend to use the React Native Debugger application though. (https://github.com/jhen0409/react-native-debugger)

# Deployment

For iOS:
- Open XCode
- Run Product > Clean build folder to tidy up the build environment
- Run Product > Archive and follow the instructions as prompted
For Android:
- Run 'npm run prod' inside the root folder
- It will create an Android bundle under android/app/build/outputs/bundle which you can upload inside the Google Play Console
- Also the new Bugsnag Map Bundles are uploaded for error tracking (including iOS)
