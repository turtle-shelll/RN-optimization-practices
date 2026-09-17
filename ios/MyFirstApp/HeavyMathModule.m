#import "HeavyMathModule.h"

@implementation HeavyMathModule

RCT_EXPORT_MODULE();

// Simulate heavy work and return data via Promise
RCT_EXPORT_METHOD(generateData:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
{
    // Dispatch to a background thread so we don't block the UI
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        
        // 1. Simulate 1.5 seconds of heavy processing
        [NSThread sleepForTimeInterval:1.5];
        
        // 2. Generate the mock data
        NSMutableArray *data = [NSMutableArray array];
        for (int i = 0; i < 100; i++) {
            NSDictionary *post = @{
                @"id": @(i),
                @"userId": @(1),
                @"title": [NSString stringWithFormat:@"Native iOS Post %d", i],
                @"body": @"This data was generated natively on iOS in a background thread!"
            };
            [data addObject:post];
        }
        
        // 3. Resolve the promise back to the JS thread
        dispatch_async(dispatch_get_main_queue(), ^{
            resolve(data);
        });
    });
}

@end
