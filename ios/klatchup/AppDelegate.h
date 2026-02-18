#if __has_include(<React_RCTAppDelegate/RCTAppDelegate.h>)
  #import <React_RCTAppDelegate/RCTAppDelegate.h>
#elif __has_include(<RCTAppDelegate/RCTAppDelegate.h>)
  #import <RCTAppDelegate/RCTAppDelegate.h>
#elif __has_include(<React/RCTAppDelegate.h>)
  #import <React/RCTAppDelegate.h>
#else
  @import React_RCTAppDelegate;
#endif
#import <UIKit/UIKit.h>
@interface AppDelegate : RCTAppDelegate @end

