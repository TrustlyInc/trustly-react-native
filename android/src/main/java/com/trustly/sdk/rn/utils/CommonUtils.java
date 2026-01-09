package com.trustly.sdk.rn.utils;

import java.util.Calendar;
import java.util.Date;

public class CommonUtils {

  public static boolean isBlank(String str) {
    return str == null || str.toString().trim().isEmpty();
  }

  public static String getTime() {
    Date currentTime = Calendar.getInstance().getTime();
    return String.valueOf(currentTime.getTime());
  }

}
