package com.trustly.sdk.rn.view;

import android.widget.FrameLayout;
import android.widget.LinearLayout;

import androidx.annotation.Nullable;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.paywithmybank.android.sdk.PayWithMyBankView;
import com.trustly.sdk.rn.activity.LightboxActivity;
import com.trustly.sdk.rn.utils.ComponentUtils;
import com.trustly.sdk.rn.utils.DataUtils;

import java.util.HashMap;
import java.util.MissingResourceException;

public class WidgetView extends FrameLayout {
  final private ReactContext context;
  private boolean lazyOpenLightbox;
  private boolean rendered;
  ReadableMap originalData;
  private HashMap<String, String> selectBankWidget;
  private PayWithMyBankView view;

  public static String EVENT_ON_BANK_SELECT = "onBankSelect";
  public static String EVENT_ON_CANCEL = "onCancel";
  public static String EVENT_ON_NOTIFICATION = "onNotification";
  public static String EVENT_ON_RETURN = "onReturn";

  public WidgetView(ReactContext context) {
    super(context);
    this.context = context;
    this.lazyOpenLightbox = false;
    this.rendered = false;
    this.renderContainer();
  }

  public void setHybrid(ReadableMap hybrid) {
    if (hybrid == null) {
      throw new MissingResourceException(
        "The hybrid is required to opening the lightbox.",
        WidgetView.class.getName(),
        "hybrid"
      );
    }
    this.renderHybrid(DataUtils.createParsedData(hybrid.toHashMap()));
  }

  public void setEstablish(ReadableMap establish) {
    if (establish == null) {
      throw new MissingResourceException(
        "The establish is required to opening the lightbox.",
        WidgetView.class.getName(),
        "establish"
      );
    }
    this.renderLightbox(DataUtils.createParsedData(establish.toHashMap()));
  }

  public void setLazyOpenLightbox(boolean state) {
    this.lazyOpenLightbox = state;
  }

  public void setSelectBankWidget(ReadableMap selectBankData) {
    this.originalData = selectBankData;
    this.selectBankWidget = DataUtils.createParsedData(selectBankData.toHashMap());
    if (!this.rendered) this.renderWidget();
  }

  private void onBankSelect() {
    ComponentUtils.sendEvent(this.context, getId(), EVENT_ON_BANK_SELECT, null);
  }


  @Override
  public void setOnClickListener(@Nullable OnClickListener l) {
    super.setOnClickListener(l);
  }

  private void renderContainer() {
    this.view = new PayWithMyBankView(this.context);
    this.view.setLayoutParams(
      new FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT
      )
    );

    LinearLayout linearLayout = new LinearLayout(this.context);
    linearLayout.setOrientation(LinearLayout.VERTICAL);
    linearLayout.addView(
      this.view,
      LinearLayout.LayoutParams.MATCH_PARENT,
      LinearLayout.LayoutParams.MATCH_PARENT
    );

    this.addView(linearLayout);
  }

  public void renderLightbox() {
    if (this.selectBankWidget == null) {
      throw new MissingResourceException(
        "The selectBankWidget is required to opening the lightbox.",
        WidgetView.class.getName(),
        "selectBankWidget"
      );
    }
    this.renderLightbox(this.selectBankWidget);
  }

  private void renderHybrid(HashMap<String, String> data) {
    HashMap<String, Object> intentData = new HashMap<>();

    intentData.put("hybrid", data);
    intentData.put("id", getId());

    ComponentUtils.renderExternalView(
      this.context,
      LightboxActivity.class,
      intentData
    );
  }

  private void renderLightbox(HashMap<String, String> data) {
    HashMap<String, Object> intentData = new HashMap<>();

    intentData.put("establish", data);
    intentData.put("id", getId());

    ComponentUtils.renderExternalView(
      this.context,
      LightboxActivity.class,
      intentData
    );
  }

  private void renderWidget() {
    this.rendered = true;

    this.view.selectBankWidget(this.selectBankWidget);

    this.view.onBankSelected((view, data) -> {
      this.selectBankWidget.put("paymentProviderId", data.get("paymentProviderId"));

      if (this.lazyOpenLightbox) {
        this.onBankSelect();
      } else {
        this.renderLightbox(this.selectBankWidget);
      }
    });

    this.view.setListener((eventName, eventDetails) -> {
      WritableMap event = ComponentUtils.createEvent(eventName, eventDetails);
      ComponentUtils.sendEvent(this.context, getId(), EVENT_ON_NOTIFICATION, event);
    });
  }

}
