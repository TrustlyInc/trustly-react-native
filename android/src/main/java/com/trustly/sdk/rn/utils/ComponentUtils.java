package com.trustly.sdk.rn.utils;

import android.content.Intent;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.events.RCTEventEmitter;

import java.util.HashMap;

public class ComponentUtils {

  public static WritableMap createEvent(String eventName, HashMap<String, String> eventDetails) {
    String command = CommonUtils.isBlank(eventName) ? "event" : eventName;

    WritableMap event = Arguments.createMap();
    event.putString("timestamp", CommonUtils.getTime());
    event.putString("command", command);

    WritableMap details = Arguments.createMap();

    if (eventDetails != null) {
      for (String key : eventDetails.keySet()) {
        details.putString(key, eventDetails.get(key));
      }
      event.putMap("details", details);
    }

    return event;
  }

  public static void renderExternalView(ReactContext context, Class<?> cls, HashMap<String, Object> data) {
    Intent intent = new Intent(context, cls);

    intent.putExtra("id",(int) data.get("id"));

    if (data.containsKey("establish")) {
      intent.putExtra("establish", (HashMap<String, String>) data.get("establish"));
    }

    if (data.containsKey("hybrid")) {
      intent.putExtra("hybrid", (HashMap<String, String>) data.get("hybrid"));
    }

    context.startActivity(intent);
  }

  public static void sendEvent(ReactContext context, int id, String name, WritableMap event) {
    context.getJSModule(RCTEventEmitter.class).receiveEvent(id, name, event);
  }
}
