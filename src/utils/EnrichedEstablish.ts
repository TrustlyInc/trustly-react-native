/**
 * @format
 * @flow strict
 */

// $FlowFixMe[cannot-resolve-module]
import { Platform } from 'react-native';
import Establish from '@type/Establish';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CidManager from '@utils/SessionManager';

const GRP_KEY = 'PayWithMyBank.grp';

async function getOrCreateGrp(): Promise<number> {
  try {
    const grpStr = await AsyncStorage.getItem(GRP_KEY);
    const grpInt = parseInt(grpStr ?? '', 10);

    if (!isNaN(grpInt) && grpInt >= 0 && grpInt <= 99) {
      return grpInt;
    }

    // Se inválido, gera um novo valor
    const newGrp = Math.floor(Math.random() * 100);
    await AsyncStorage.setItem(GRP_KEY, newGrp.toString());
    return newGrp;

  } catch (error) {
    console.warn('Unable to get or set grp:', error);
    const fallback = Math.floor(Math.random() * 100);
    await AsyncStorage.setItem(GRP_KEY, fallback.toString());
    return fallback;
  }
}

export const EnrichedEstablish = async (establishData: Establish): Promise<Establish> => {
  const newParams = {
    deviceType: `mobile:${Platform.OS}:react-native`,
    dynamicWidget: true,
    grp: await getOrCreateGrp(),
    sessionCid: await CidManager.getSession(),
    storage: "supported",
    metadata: {
      cid: await CidManager.get(),
      integrationContext: 'SecureBrowser',
      ...establishData.metadata
    }
  };

  return { ...establishData, ...newParams };
};