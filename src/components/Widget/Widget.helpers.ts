/**
 * @format
 * @flow strict
 */

import { version } from '@root/package.json';
import { ENDPOINT } from '@constants/Endpoint';
import { EnrichedEstablish } from '@utils/EnrichedEstablish';
import { getEnvironmentDomain } from '@utils/getEnvironmentDomain';
import Establish from '@type/Establish';
import { ServiceName } from '@constants/ServicePort';

const getEndpoint = (version: string): string => {
  return `${ENDPOINT.WIDGET}?v=${version}-rn-sdk`;
};

export const getSearchParams = (enrichedEstablish: any): string => {
  const eligibleKeys = [
    'accessId',
    'deviceType',
    'dynamicWidget',
    'grp',
    'merchantId',
    'paymentType',
  ];

  const availableKeys = eligibleKeys.filter((key) => enrichedEstablish[key]);

  const availableData = availableKeys.map(
    (key) => `${key}=${enrichedEstablish[key]}`,
  );

  if (enrichedEstablish.customer) {
    if (enrichedEstablish.customer?.address) {
      if (enrichedEstablish.customer.address.country) {
        availableData.push(`customer.address.country=${enrichedEstablish.customer.address.country}`);
      }
      if (enrichedEstablish.customer.address.state) {
        availableData.push(`customer.address.state=${enrichedEstablish.customer.address.state}`);
      }
    }
    if (enrichedEstablish.customer?.externalId) {
      availableData.push(`customer.externalId=${enrichedEstablish.customer.externalId}`);
    }  
  }

  if (enrichedEstablish.metadata?.lang) {
    availableData.push(`lang=${enrichedEstablish.metadata.lang}`);
  }

  return availableData.join('&');
};

function buildFragment(establishData: Establish): string {
  const {
    metadata,
    currency,
    customer,
    merchantReference,
    kycType,
    sessionCid,
  } = establishData;

  const details: Record<string, unknown> = {
    lang: metadata?.lang,
    cid: metadata?.cid,
    sessionCid,
    storage: "supported",
  };

  if (currency) details.currency = currency;
  if (customer) details.customer = customer;
  if (merchantReference) details.merchantReference = merchantReference;
  if (kycType) details.kycType = kycType;

  return btoa(JSON.stringify(details));
}

export const getWidgetUrl = async (establishData: Establish): Promise<string> => {
  const { env } = establishData;
  const domain = getEnvironmentDomain(env, ServiceName.Widget);
  const endpoint = getEndpoint(version);
  const enrichedEstablish = await EnrichedEstablish(establishData);
  const searchParams = getSearchParams(enrichedEstablish);
  const fragment =  buildFragment(enrichedEstablish);

  return `${domain}${endpoint}&${searchParams}#${fragment}`;
};
