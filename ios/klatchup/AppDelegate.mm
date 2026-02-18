#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"klatchup"; // must match your JS app name
  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

@end
