package com.trustly.sdk.rn.activity;

import android.content.Intent;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.widget.FrameLayout;
import android.widget.RelativeLayout;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.paywithmybank.android.sdk.PayWithMyBank;
import com.paywithmybank.android.sdk.PayWithMyBankView;
import com.trustly.sdk.rn.utils.ComponentUtils;
import com.trustly.sdk.rn.view.WidgetView;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.MissingResourceException;

public class LightboxActivity extends ReactActivity {
  ReactContext context;
  PayWithMyBankView view;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.requestWindowFeature(Window.FEATURE_NO_TITLE);

    this.getWindow().setFlags(
      WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN
    );

    Intent intent = getIntent();
    this.context = this.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

    final int id = (int) intent.getSerializableExtra("id");
    final Map<String,String> hybrid = (Map<String, String>) intent.getSerializableExtra("hybrid");
    final Map<String,String> establishData = (Map<String, String>) intent.getSerializableExtra("establish");

    this.renderContainer();

    this.view.setListener((eventName, eventDetails) -> {
      WritableMap event = ComponentUtils.createEvent(eventName, eventDetails);
      ComponentUtils.sendEvent(this.context, id, WidgetView.EVENT_ON_NOTIFICATION, event);
    });

    PayWithMyBank panel = establishData != null
      ? this.renderLightbox(establishData)
      : this.renderHybrid(hybrid);

    if (panel == null) {
      throw new MissingResourceException(
        "The establish or hybrid param are required.",
        LightboxActivity.class.getName(),
        "establish"
      );
    }

    panel.onReturn((view, params) -> {
      WritableMap event = ComponentUtils.createEvent("return", (HashMap<String, String>) params);
      ComponentUtils.sendEvent(this.context, id, WidgetView.EVENT_ON_RETURN,  event);
      this.finish();
    });

    panel.onCancel((view, params) -> {
      WritableMap event = ComponentUtils.createEvent("cancel", (HashMap<String, String>) params);
      ComponentUtils.sendEvent(this.context, id, WidgetView.EVENT_ON_CANCEL, event);
      this.finish();
    });

    panel.onExternalUrl((view, params) -> {
      Intent externalUrlIntent = new Intent(this, ExternalUrlActivity.class);
      externalUrlIntent.putExtra("url", (Serializable) params.get("url"));
      startActivity(externalUrlIntent);
    });

  }

  private void renderContainer() {
    this.view = new PayWithMyBankView(this.context);
    this.view.setLayoutParams(
      new FrameLayout.LayoutParams(
        FrameLayout.LayoutParams.MATCH_PARENT,
        FrameLayout.LayoutParams.MATCH_PARENT
      )
    );

    RelativeLayout layout = new RelativeLayout(this.context);
    layout.addView(
      this.view,
      RelativeLayout.LayoutParams.MATCH_PARENT,
      RelativeLayout.LayoutParams.MATCH_PARENT
    );

    setContentView(layout);
  }

  private PayWithMyBank renderHybrid(Map<String, String> data) {
    return this.view.hybrid(
      data.get("url"),
      data.get("returnUrl"),
      data.get("cancelUrl")
    );
  }

  private PayWithMyBank renderLightbox(Map<String, String> data) {
    return this.view.establish(data);
  }
}
