export const queryToObject = (query: string): Record<string, any> => {
    return Object.fromEntries(new URLSearchParams(query));
}

export const objectToDotMap = (obj: any, prefix = ''): Record<string, string> => {
  const result: Record<string, string> = {};

  for (const key in obj) {
    if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

    const value = obj[key];
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, objectToDotMap(value, newKey));
    } else {
      result[newKey] = String(value);
    }
  }

  return result;
}