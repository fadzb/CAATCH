//
//  RNTTwitterTimeline.m
//  caatchproject
//
//  Created by Conor O'Grady on 28/06/2018.
//  Copyright © 2018 650 Industries, Inc. All rights reserved.
//

#import <UIKit/UIKit.h>
#import <TwitterKit/TWTRKit.h>
#import <React/RCTViewManager.h>

@interface RNTTwitterTimeline : TWTRTimelineViewController
    @end

@implementation RNTTwitterTimeline
    
    RCT_EXPORT_MODULE()
    
- (UIView *)view
    
    
    {
        TWTRAPIClient *APIClient = [[TWTRAPIClient alloc] init];
        
        self.dataSource = [[TWTRListTimelineDataSource alloc] initWithListSlug:@"surfing"
                                                listOwnerScreenName:@"stevenhepting"
                                                          APIClient:APIClient];
        
        return self.view;
    }
    @end
