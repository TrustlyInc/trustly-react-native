package com.trustly.sdk.rn;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.trustly.sdk.rn.view.WidgetView;

import java.util.Map;

import javax.annotation.Nullable;

public class TrustlyViewManager extends SimpleViewManager<WidgetView> {
    public static final String REACT_CLASS = "TrustlyView";
    private ReactApplicationContext context;
    private final int COMMAND_OPEN_LIGHTBOX = 1;

    public TrustlyViewManager(ReactApplicationContext context) {
      this.context = context;
    }

    @Override
    @NonNull
    public String getName() {
        return REACT_CLASS;
    }

    @Override
    @NonNull
    public WidgetView createViewInstance(ThemedReactContext reactContext) {
        return new WidgetView(reactContext);
    }

    @ReactProp(name = "establish")
    public void setEstablish(@NonNull WidgetView view, ReadableMap data) {
      view.setEstablish(data);
    }

    @ReactProp(name = "hybrid")
    public void setHybrid(@NonNull WidgetView view, ReadableMap data) {
      view.setHybrid(data);
    }

    @ReactProp(name = "lazyOpenLightbox")
    public void setLazyOpenLightbox(@NonNull WidgetView view, boolean state) {
      view.setLazyOpenLightbox(state);
    }

    @ReactProp(name = "selectBankWidget")
    public void setSelectBankWidget(@NonNull WidgetView view, ReadableMap data) {
      view.setSelectBankWidget(data);
    }

    @Override
    public Map<String, Object> getExportedCustomDirectEventTypeConstants() {
      return MapBuilder.of(
        WidgetView.EVENT_ON_RETURN,
        (Object) MapBuilder.of("registrationName", WidgetView.EVENT_ON_RETURN),
        WidgetView.EVENT_ON_CANCEL,
        (Object) MapBuilder.of("registrationName", WidgetView.EVENT_ON_CANCEL),
        WidgetView.EVENT_ON_NOTIFICATION,
        (Object) MapBuilder.of("registrationName", WidgetView.EVENT_ON_NOTIFICATION),
        WidgetView.EVENT_ON_BANK_SELECT,
        (Object) MapBuilder.of("registrationName", WidgetView.EVENT_ON_BANK_SELECT)
      );
    }

    @Nullable
    @Override
    public Map<String, Integer> getCommandsMap() {
      return MapBuilder.of(
        "OPEN_LIGHTBOX", COMMAND_OPEN_LIGHTBOX
      );
    }

    @Override
    public void receiveCommand(WidgetView view, String commandId, @Nullable ReadableArray args) {
      super.receiveCommand(view, commandId, args);

      int commandRefId = Integer.parseInt(commandId);

      switch (commandRefId) {
        case COMMAND_OPEN_LIGHTBOX:
          view.renderLightbox();
          break;
        default:
          throw new IllegalArgumentException(
            String.format(
              "Unsupported command %d received by %s.",
              commandId,
              getClass().getSimpleName()
            )
          );
      }
    }

}
