/**
 * @format
 * @flow strict
 */

export enum ServiceName {
  Lightbox = 'lightbox',
  Widget = 'widget'
}

const localServicePort: { [key in ServiceName]: number } = {
  [ServiceName.Lightbox]: 8000,
  [ServiceName.Widget]: 8000
};

export const getServicePort = (serviceName: ServiceName): number => {
  return localServicePort[serviceName];
};

export default localServicePort;