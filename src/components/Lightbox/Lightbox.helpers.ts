/**
 * @format
 * @flow strict
 */

import { version } from '@root/package.json';
import { ENDPOINT } from '@constants/Endpoint';
import { ServiceName } from '@constants/ServicePort';
import { getEnvironmentDomain } from '@utils/getEnvironmentDomain';
import { EnrichedEstablish } from '@utils/EnrichedEstablish';
import { queryToObject, objectToDotMap } from '@utils/helpers';
import Establish from '@type/Establish';
import ReturnParameters from '@type/ReturnParameters';

const getLightboxEndpoint = (version: string): string => {
  return `${ENDPOINT.LIGHTBOX}?v=${version}-rn-sdk`;
};

export const getReturnParameters = (url: string, urlScheme: string): ReturnParameters => {
  let cleanedUrl = url;

  if (cleanedUrl.startsWith(urlScheme)) {
    cleanedUrl = cleanedUrl.slice(urlScheme.length);
  }

  const paramsToRemove = ['cancel/', 'return/'];
  let foundParam: string | undefined = undefined;

  paramsToRemove.forEach(param => {
    if (cleanedUrl.includes(param)) {
      foundParam = param.replace('/', '');
      cleanedUrl = cleanedUrl.replace(param, '');
    }
  });

  return { 
    object: queryToObject(cleanedUrl), 
    action: foundParam
  };
}

const isValidUrlScheme = (urlScheme: string): boolean => {
  return /^[a-zA-Z][a-zA-Z0-9+\-.]*:(\/\/)?/.test(urlScheme);
};

export const createLightboxEstablishData = async (establishData: Establish, paymentProviderId: string): Promise<Record<string, string>>  => {
  const enrichedEstablish = await EnrichedEstablish(establishData);
  const trustly_url_scheme = "trustly-url-scheme://"

  if (paymentProviderId) {
    enrichedEstablish['paymentProviderId'] = paymentProviderId;
  }

  const urlScheme = enrichedEstablish.metadata?.urlScheme ? enrichedEstablish.metadata?.urlScheme : trustly_url_scheme;

  if (urlScheme) {
    if (!isValidUrlScheme(urlScheme)) {
      throw new Error('metadata.urlScheme is not a valid URL scheme');
    }
    enrichedEstablish['returnUrl'] = `${urlScheme}return/`;
    enrichedEstablish['cancelUrl'] = `${urlScheme}cancel/`;
  } else {
    throw new Error('metadata.urlScheme is missing in metadata');
  }
  
  return objectToDotMap(enrichedEstablish);
};

export const getLightboxUrl = (env: string, paymentProviderId: string): string => {
  const domain = getEnvironmentDomain(env, ServiceName.Lightbox);
  const endpoint = getLightboxEndpoint(version);

  return `${domain}${endpoint}`;
};