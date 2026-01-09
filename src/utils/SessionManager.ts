import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSION_CID_KEY = 'Trustly.sessionCid';

function pad(num: string, size: number): string {
  const s = '000000000' + num;
  return s.substring(s.length - size);
}

function randomBlock(): string {
  const blockSize = 4;
  const base = 36;
  const discreteValues = Math.pow(base, blockSize);
  return pad(((Math.random() * discreteValues) << 0).toString(base), blockSize);
}

function propsLength(array: any): number {
  if (!Array.isArray(array)) return 1;
  let acc = 1;
  for (let i = 0; i < array.length; i++) {
    try {
      acc += acc * (array[i]?.length || 1);
    } catch {}
  }
  return acc;
}

function fingerprint(): string {
  let v1 = 0, v2 = 0;
  try {
    v1 = propsLength([navigator.userAgent, navigator.mimeTypes]);
    v2 = propsLength([
      navigator.appVersion,
      navigator.plugins,
      navigator.platform,
      navigator.languages,
    ]);
  } catch (err) {
    console.warn('[fingerprint#error]', err);
  }
  return pad(v1.toString(36), 2) + pad(v2.toString(36), 2);
}

async function persistAndReturn(value: string): Promise<string> {
  try {
    await AsyncStorage.setItem(SESSION_CID_KEY, value);
  } catch (err) {
    console.warn('Failed to persist CID', err);
  }
  return value;
}

const CidManager = {
  async get(): Promise<string> {
    const fp = fingerprint();
    const random = randomBlock().slice(-4);
    const timestamp = Date.now().toString(36);

    return `${fp}-${random}-${timestamp}`.toUpperCase();;
  },

  async getSession(): Promise<string> {
    const currentCid = await CidManager.get();

    try {
      const sessionCid = await AsyncStorage.getItem(SESSION_CID_KEY);

      if (!sessionCid) {
        return persistAndReturn(currentCid);
      }

      const now = Date.now();
      const sessionTs = parseInt(sessionCid.split('-').pop() || '0', 36);
      const minutes = (now - sessionTs) / 60000;

      if (minutes < 60) {
        return sessionCid;
      } else {
        return persistAndReturn(currentCid);
      }

    } catch (err) {
      console.warn('[CidManager#getSession] error', err);
      return currentCid;
    }
  },

  async list(): Promise<{ cid: string; sessionCid: string }> {
    const [cid, sessionCid] = await Promise.all([
      CidManager.get(),
      CidManager.getSession()
    ]);
    return { cid, sessionCid };
  }
};

export default CidManager;