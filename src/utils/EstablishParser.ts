/**
 * @format
 * @flow strict
 */

import Establish from '@type/Establish'

export const DotNotationEstablish = (establishData: Establish): { [key: string]: string } => {
  const transform = (
    // $FlowFixMe[unclear-type]
    object: { [key: string]: any },
    path: string = '',
    result: { [key: string]: string } = {},
  ): { [key: string]: string } => {
    for (const key in object) {
      const newPath = path ? `${path}.${key}` : key;

      if (typeof object[key] === 'object' && object[key] !== null) {
        transform(object[key], newPath, result);
      } else if (result) {
        result[newPath] = object[key];
      }
    }

    return result;
  };

  const transformation = transform(establishData);

  return transformation;
};
