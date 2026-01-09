/**
 * @format
 * @flow strict
 */

import { getServicePort, ServiceName } from '@constants/ServicePort';

export const getEnvironmentDomain = (
  environment: string = '', 
  service: ServiceName = ServiceName.Widget
): string => {

  if (!environment) {
    return 'https://trustly.one';
  }

  const env = environment.toLowerCase();

  if (env.startsWith('dev-')) {
    return `https://${env}.int.trustly.one`;
  }

  const isLocalhost = env === 'localhost';
  const isIpAddress = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(env);

  if (isLocalhost || isIpAddress) {
    return `http://${env}:${getServicePort(service)}`;
  }

  return `https://${env}.trustly.one`;
};
