#import "RCTCustomButtonManager.h"
#import <React/RCTComponent.h>
#import <UIKit/UIKit.h>

// 1. Define the actual native view subclass
@interface RCTCustomButton : UIButton
@property (nonatomic, copy) RCTBubblingEventBlock onCustomClick;
@property (nonatomic, strong) UIColor *customColor;
@end

@implementation RCTCustomButton
- (instancetype)initWithFrame:(CGRect)frame {
    if ((self = [super initWithFrame:frame])) {
        [self addTarget:self action:@selector(buttonClicked) forControlEvents:UIControlEventTouchUpInside];
        self.titleLabel.font = [UIFont boldSystemFontOfSize:16];
        self.layer.cornerRadius = 8;
    }
    return self;
}

- (void)buttonClicked {
    if (self.onCustomClick) {
        self.onCustomClick(@{@"message": @"Hello from Native iOS!"});
    }
}

- (void)setCustomColor:(UIColor *)color {
    self.backgroundColor = color;
}
@end

// 2. Define the Manager that React Native talks to
@implementation RCTCustomButtonManager

RCT_EXPORT_MODULE(CustomButton)

- (UIView *)view {
    return [[RCTCustomButton alloc] init];
}

// 3. Export props to React Native
RCT_EXPORT_VIEW_PROPERTY(onCustomClick, RCTBubblingEventBlock)

RCT_CUSTOM_VIEW_PROPERTY(text, NSString, RCTCustomButton) {
    [view setTitle:json ? [RCTConvert NSString:json] : @"" forState:UIControlStateNormal];
}

RCT_CUSTOM_VIEW_PROPERTY(color, NSString, RCTCustomButton) {
    // Very simple hex to UIColor conversion for demo purposes
    if (json) {
        NSString *hexString = [RCTConvert NSString:json];
        if ([hexString hasPrefix:@"#"]) {
            hexString = [hexString substringFromIndex:1];
        }
        unsigned int hex;
        [[NSScanner scannerWithString:hexString] scanHexInt:&hex];
        view.customColor = [UIColor colorWithRed:((hex >> 16) & 0xFF) / 255.0
                                         green:((hex >> 8) & 0xFF) / 255.0
                                          blue:(hex & 0xFF) / 255.0
                                         alpha:1.0];
    }
}

@end
