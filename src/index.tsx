import {
  requireNativeComponent,
  UIManager,
  Platform,
  ViewStyle,
  findNodeHandle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'react-native-trustly-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo managed workflow\n';

type NodeHandle = Parameters<typeof findNodeHandle>[0];
type TrustlyProps = {
  color: string;
  style: ViewStyle;
};

export const ComponentName = 'TrustlyView';
const OPEN_LIGHTBOX = 'OPEN_LIGHTBOX';

export const useTrustly = () => {
  const onEstablish = (ref: NodeHandle) => {
    const conf = UIManager.getViewManagerConfig(ComponentName);
    const commands = conf.Commands as Record<string, number>;
    const viewId = findNodeHandle(ref);
    const commandId = commands[OPEN_LIGHTBOX]?.toString() as string;
    UIManager.dispatchViewManagerCommand(viewId, commandId, []);
  };

  return { onEstablish };
};

export const TrustlyView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<TrustlyProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
