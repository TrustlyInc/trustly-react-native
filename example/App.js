/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useRef, useState} from 'react';
import {
  Button,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {TrustlyView, useTrustly} from 'react-native-trustly-sdk';

const withBackground = (styles, isDarkMode) => ({
  ...styles,
  backgroundColor: isDarkMode ? Colors.black : Colors.white,
});

const establishData = {
  accessId: 'A48B73F694C4C8EE6306',
  requestSignature: 'clYlSWb565B3JGUExdXrK5tyTqM=',
  merchantId: '110005514',
  description: 'Android SDK App Example',
  currency: 'USD',
  amount: '10.00',
  merchantReference: 'ABCDREF',
  paymentType: 'Instant',
  customer: {
    name: 'John Smith',
    address: {
      address1: '2000 Broadway Street',
      city: 'Redwood City',
      state: 'US',
      zip: '94063',
      country: 'US',
    },
    phone: '2145553434',
    email: 'jsmith@email.com',
  },
  localUrl: '192.168.5.169:8000',
  env: 'local',
  metadata: [
    {
      name: 'urlScheme',
      value: 'merchant://trustlyReturn',
    },
  ],
};

const App = () => {
  const [amount, setAmount] = useState(parseFloat(establishData.amount));
  const [data, setData] = useState(establishData);
  const nativeRef = useRef(null);
  const isDarkMode = useColorScheme() === 'dark';
  const {onEstablish} = useTrustly();

  const onPressPayNow = () => {
    onEstablish(nativeRef.current);
    setAmount(null);
  };

  const onNotificationListener = eventData => {
    switch (eventData.command) {
      case 'close':
        console.log(`Lightbox was closed at ${eventData.timestamp}`);
        break;

      case 'open':
        console.log(`Lightbox will open at ${eventData.timestamp}`);
        break;

      case 'event':
        switch (eventData.details.type) {
          case 'load':
            console.log(
              `Lightbox page ${eventData.details.page} finished loading for transaction ${eventData.details.transactionId} at ${eventData.timestamp}.`,
            );
            break;

          case 'bank_selected':
            console.log(
              `Payment provider having id ${eventData.details.data} was selected on the page ${eventData.details.page} for transaction ${eventData.details.transactionId} at ${eventData.timestamp}.`,
            );
            break;

          case 'back':
            console.log(
              `Back button was clicked on the lightbox page ${eventData.details.page} for transaction ${eventData.details.transactionId} at ${eventData.timestamp}`,
            );
            break;

          case 'close':
            console.log(
              `Lightbox close process was initiated on the lightbox page ${eventData.details.page} with reason ${eventData.details.data} for transaction ${eventData.details.transactionId} at ${eventData.timestamp}`,
            );
            break;

          case 'new_location':
            console.log(
              `Browser will be redirected to ${eventData.details.data} at ${eventData.timestamp}`,
            );
            break;
        }
        break;
    }
  };

  const onCancel = eventData => {
    console.log('cancel', eventData);
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        'Canceled transaction',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  const onReturn = eventData => {
    console.log('result', eventData);
    if (Platform.OS === 'android') {
      ToastAndroid.showWithGravity(
        'Transaction completed successfully',
        ToastAndroid.LONG,
        ToastAndroid.TOP,
      );
    }
  };

  return (
    <SafeAreaView
      style={withBackground(styles.container, isDarkMode)}
      elevation={0}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={withBackground({}, isDarkMode)}>
        <View style={withBackground({}, isDarkMode)}>
          <Text style={styles.text}>Amount</Text>
          <TextInput
            keyboardType="numeric"
            placeholder="Amount value"
            onChangeText={value => {
              setData(oldData => ({
                ...oldData,
                amount: value,
              }));
              setAmount(value);
            }}
            style={styles.input}
            value={amount}
          />
        </View>
        <View style={withBackground({}, isDarkMode)}>
          <TrustlyView
            // establish={data} // Open Lightbox Webview
            // hybrid={{
            //   url: 'https://sandbox.paywithmybank.com/merchant-demo/globex/',
            //   returnUrl:
            //     'https://sandbox.paywithmybank.com/merchant-demo/globex/?success=true',
            //   cancelUrl:
            //     'https://sandbox.paywithmybank.com/merchant-demo/globex/?cancel=true',
            // }} // Open Hybrid Webview
            selectBankWidget={data} // Open embeded Widiget
            // onBankSelect={event => console.log(event.nativeEvent)} // used with lazyOpenLightbox
            onCancel={event => onCancel(event.nativeEvent)}
            onNotification={event => onNotificationListener(event.nativeEvent)}
            onReturn={event => onReturn(event.nativeEvent)}
            ref={nativeRef}
            style={styles.widget}
            lazyOpenLightbox // used with selectBankWidget
          />
        </View>
        <View style={withBackground({}, isDarkMode)}>
          <Button
            onPress={() => onPressPayNow()}
            style={styles.btn}
            title="Pay now"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    width: '30%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
    margin: 16,
    padding: 16,
  },
  input: {
    height: 40,
    borderBottomWidth: 1,
    marginBottom: 16,
    width: '100%',
  },
  text: {
    fontWeight: 'bold',
  },
  widget: {
    alignSelf: 'center',
    flex: 1,
    height: 350,
    textAlign: 'center',
    width: '100%',
  },
});

export default App;
