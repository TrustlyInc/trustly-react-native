import React, { useEffect } from 'react';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import { 
  getLightboxUrl, 
  createLightboxEstablishData, 
  getReturnParameters
} from './Lightbox.helpers';
import { Linking, Platform } from 'react-native';

type Props = {
  establishData: any;
  paymentProviderId: any;
  onCancel: (returnParameters: object) => void | React.ReactNode;
  onReturn: (returnParameters: object) => void | React.ReactNode;
};

const Lightbox = ({
  establishData,
  paymentProviderId,
  onCancel,
  onReturn,
}: Props): React.ReactElement | null => {

  if (!establishData) {
    console.error('The establishData is not defined in the Trustly Lightbox component');
    return null;
  }

  const { env, metadata } = establishData;
  const url = getLightboxUrl(env, paymentProviderId);

  useEffect(() => {
    let lightboxUrl: string | null = null;

    const openBrowser = async () => {
      establishData.paymentProviderId = paymentProviderId;

      const fetchLightboxUrl = async (): Promise<string | null> => {
        const lightboxEstablishData = await createLightboxEstablishData(establishData, paymentProviderId);

        try {
          const userAgent = await getUserAgent();
          const response = await fetch(url, { 
            method: 'POST',
            headers: {
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Content-Type': 'application/x-www-form-urlencoded',
              'User-Agent': userAgent || '',
            },
            body: new URLSearchParams(lightboxEstablishData).toString(),
          });
          return response.url;
        } catch (error) {
          console.error(error);
          return null;
        }
      };

       const getUserAgent = async () => {
        let userAgent = null;

        if (Platform.OS === 'android') {
          userAgent = 'TrustlySDK/1.0.0 (Android)';
        } else if (Platform.OS === 'ios') {
          userAgent = 'TrustlySDK/1.0.0 (ios)';
        }

        return userAgent;
      }

      const closeCustomTabs = async () => {
        if (Platform.OS === 'android') {
          try {
            await InAppBrowser.close();
          } catch (closeError) {
            console.warn('Failed to close InAppBrowser:', closeError);
          }
        }
      }

      const openInAppBrowser = async (lightboxUrl: string) => {
        try {
          if (
            InAppBrowser &&
            typeof InAppBrowser.isAvailable === 'function' &&
            await InAppBrowser.isAvailable()
          ) {
            const browserOptions = {
              ephemeralWebSession: true,
              // Android specific options
              forceCloseOnRedirection: Platform.OS === 'android',
              ...(Platform.OS === 'android' && {
                showTitle: false,
                enableUrlBarHiding: true,
                enableDefaultShare: false,
                showInRecents: false,
              }),
            };

            const result = await InAppBrowser.openAuth(lightboxUrl, metadata?.urlScheme, browserOptions);

            if (!onReturn) {
              console.error('The onReturn method is not defined in the Trustly Lightbox component');
              return;
            }

            if (!onCancel) {
              console.error('The onCancel method is not defined in the Trustly Lightbox component');
              return;
            }

            if (result.type === 'cancel' || result.type === 'dismiss') {
              await onCancel({});
              closeCustomTabs()
              return;
            }

            if (result.type === 'success' && result.url) {
              const urlScheme = metadata.urlScheme;
              const returnParameters = getReturnParameters(result.url, urlScheme);
 
              console.log(result.url)
              if (returnParameters.action === 'return') {
                await onReturn(returnParameters.object);
                closeCustomTabs();
                return;
              }

              if (returnParameters.action === 'cancel') {
                await onCancel(returnParameters.object);
                closeCustomTabs();
                return;
              }
            }
          } else {
            console.warn('InAppBrowser not available');
          }
        } catch (error) {
          console.error(error);
        }
      };

      lightboxUrl = await fetchLightboxUrl();

      if (lightboxUrl) {
        await openInAppBrowser(lightboxUrl);
      } else {
        console.error('Failed to fetch Lightbox URL');
      }
    };

    openBrowser();
  }, [
    establishData,
    paymentProviderId,
    url,
    metadata.urlScheme,
    onCancel,
    onReturn,
  ]);

  return null;
};

export default Lightbox;
