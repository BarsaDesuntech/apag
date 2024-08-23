#import "AppDelegate.h"
#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Bugsnag/Bugsnag.h>
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  [Bugsnag start];
  self.moduleName = @"APAG";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  // this api key is taken from the android manifest file.
  [GMSServices provideAPIKey:@"AIzaSyBiMgSxTybwwiO33ra7kkYTDhQYDVRJA-k"];
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
