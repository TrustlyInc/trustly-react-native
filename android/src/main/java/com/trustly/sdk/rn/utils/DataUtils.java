package com.trustly.sdk.rn.utils;

import java.util.HashMap;
import java.util.List;

public class DataUtils {

  public static HashMap<String, String> createParsedData(HashMap<String, Object> dataMap) {
    HashMap<String, String> result = new HashMap<>();
    return parseData(result, null, dataMap);
  }

  private static HashMap<String, String> parseData(HashMap<String, String> result, String baseKey, HashMap<String, Object> data) {
    for (String key : data.keySet()) {
      Object value = data.get(key);
      String newKey = createKey(baseKey, key);

      if (value instanceof String) {
        result.put(newKey, (String) value);
      } else if (value instanceof List) {
        parseList(newKey, result, (List<HashMap<String, String>>) value);
      } else {
        parseData(result, newKey, (HashMap<String, Object>) value);
      }
    }
    return result;
  }

  private static void parseList(String prefix, HashMap<String, String> result, List<HashMap<String, String>> dataList) {
    for (HashMap<String, String> data : dataList) {
      result.put(createKey(prefix, data.get("name")), data.get("value"));
    }
  }

  private static String createKey(String prefix, String suffix) {
    if (CommonUtils.isBlank(prefix)) {
      return suffix;
    }
    return String.format("%s.%s", prefix, suffix);
  }

}
