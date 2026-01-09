package com.trustly.sdk.rn.activity;

import android.content.Intent;
import android.os.Bundle;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.RelativeLayout;

import com.facebook.react.ReactActivity;
import com.facebook.react.bridge.ReactContext;

public class ExternalUrlActivity extends ReactActivity {
  ReactContext context;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    this.requestWindowFeature(Window.FEATURE_NO_TITLE);

    this.getWindow().setFlags(
      WindowManager.LayoutParams.FLAG_FULLSCREEN,
      WindowManager.LayoutParams.FLAG_FULLSCREEN
    );

    Intent intent = getIntent();
    final ReactActivity self  = this;
    this.context = this.getReactNativeHost().getReactInstanceManager().getCurrentReactContext();

    WebView webView = new WebView(this.context);

    webView.getSettings().setJavaScriptEnabled(true);

    webView.loadUrl(intent.getStringExtra("url"));

    webView.setLayoutParams(
      new ViewGroup.LayoutParams(
        WebView.LayoutParams.MATCH_PARENT,
        WebView.LayoutParams.MATCH_PARENT
      )
    );

    webView.setWebViewClient(new WebViewClient() {
      @Override
      public void onPageFinished(WebView view, String url) {
        self.setTitle((view.getTitle()));
      }
    });

    RelativeLayout layout = new RelativeLayout(this.context);
    layout.addView(
      webView,
      RelativeLayout.LayoutParams.MATCH_PARENT,
      RelativeLayout.LayoutParams.MATCH_PARENT
    );

    setContentView(layout);
  }

}
