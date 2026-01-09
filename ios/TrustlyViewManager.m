#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(TrustlyViewManager, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(establish, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(hybrid, NSDictionary)
RCT_EXPORT_VIEW_PROPERTY(lazyOpenLightbox, BOOL)
RCT_EXPORT_VIEW_PROPERTY(selectBankWidget, NSDictionary)

RCT_EXPORT_VIEW_PROPERTY(onCancel, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onNotification, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onReturn, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onBankSelect, RCTDirectEventBlock)

@end
