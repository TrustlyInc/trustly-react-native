/**
 * @format
 * @flow strict
 */

export const
  EstablishDataMock = {
    accessId: '123',
    currency: '',
    customer: {
      address: {
        address1: '',
        city: '',
        country: 'US',
        state: 'CA',
        zip: '',
      },
      enrollDate: 0,
      externalId: '789',
      name: '',
    },
    merchantId: '456',
    merchantReference: '',
    metadata: {
      lang: 'en',
      urlScheme: 'myapp://',
    },
    paymentType: 'Instant',
    requestSignature: '',
    deviceType: "mobile:ios:react-native",
    dynamicWidget: true,
  },
  EstablishDataWithoutCustomerMock = {
    accessId: '123',
    currency: '',
    merchantId: '456',
    merchantReference: '',
    metadata: {
      lang: 'en',
    },
    paymentType: 'Instant',
    requestSignature: '',
  },
  EstablishDataWithoutCustomerAddressMock: Establish = {
    accessId: '123',
    currency: '',
    customer: {
      enrollDate: 0,
      externalId: '789',
      name: '',
    },
    merchantId: '456',
    merchantReference: '',
    metadata: {
      lang: 'en',
    },
    paymentType: 'Instant',
    requestSignature: '',
  },
  EstablishDataWithoutCustomerAddressCountryStateMock: Establish = {
    accessId: '123',
    currency: '',
    customer: {
      address: {
        address1: '',
        city: '',
        zip: '',
      },
      enrollDate: 0,
      externalId: '789',
      name: '',
    },
    merchantId: '456',
    merchantReference: '',
    metadata: {
      lang: 'en',
    },
    paymentType: 'Instant',
    requestSignature: '',
  },
  EstablishDataWithoutCustomerExternalIdMock: Establish = {
    accessId: '123',
    currency: '',
    customer: {
      address: {
        address1: '',
        city: '',
        country: 'US',
        state: 'CA',
        zip: '',
      },
      enrollDate: 0,
      name: '',
    },
    merchantId: '456',
    merchantReference: '',
    metadata: {
      lang: 'en',
    },
    paymentType: 'Instant',
    requestSignature: '',
  },
  EstablishDataWithoutMetadataMock: Establish = {
    accessId: '123',
    currency: '',
    customer: {
      address: {
        address1: '',
        city: '',
        country: 'US',
        state: 'CA',
        zip: '',
      },
      enrollDate: 0,
      externalId: '789',
      name: '',
    },
    merchantId: '456',
    merchantReference: '',
    paymentType: 'Instant',
    requestSignature: '',
  };
