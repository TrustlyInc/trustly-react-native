@objc(TrustlyViewManager)
class TrustlyViewManager: RCTViewManager {

  override func view() -> (TrustlyView) {
    return TrustlyView()
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return false
  }
}

class TrustlyView : UIView {
    var lazy: Bool = false;
    
    @objc var onCancel: RCTDirectEventBlock?;
    @objc var onNotification: RCTDirectEventBlock?;
    @objc var onReturn: RCTDirectEventBlock?;
    @objc var onBankSelect: RCTDirectEventBlock?;
    
    @objc var establish: Dictionary<String, Any> = [:] {
      didSet {
          self.renderLightbox(data: establish);
      }
    }
    
    @objc var hybrid: Dictionary<String, Any> = [:] {
      didSet {
          self.renderHybrid(data: hybrid);
      }
    }
    
    @objc var lazyOpenLightbox: Bool = false {
      didSet {
        self.lazy = lazyOpenLightbox
      }
    }
    
    @objc var selectBankWidget: Dictionary<String, Any> = [:] {
      didSet {
          self.renderWidget(data: selectBankWidget);
      }
    }
    
    func renderHybrid(data: Dictionary<String, Any>) {
        print(data)
    }
    
    func renderLightbox(data: Dictionary<String, Any>) {
        print(data)
    }
    
    func renderWidget(data: Dictionary<String, Any>) {
        print(data)
    }
}
