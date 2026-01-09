export default interface Establish {
  accessId: string;
  merchantId: string;
  paymentType?: 'Deferred' | 'Disbursement' | 'Recurring' | 'Verification' | 'Retrieval';
  merchantReference: string;
  returnUrl: string;
  cancelUrl: string;
  notificationUrl?: string;
  requestSignature: string;
  amount?: number;
  currency: string;
  description: string;
  displayAmount?: string;
  customer: Customer;
  recurrence?: Recurrence;
  metadata: Metadata;
  account?: Account;
  transactionId?: string;
  verification?: Verification;
  deviceType: string;
  dynamicWidget: boolean;
  grp: number;
  env?: string;
  paymentProviderId?: string;
  kycType?: string;
  sessionCid?: string;
  widgetLoaded?: boolean;
}

interface Address {
  zip: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  country: string;
}

interface DriverLicense {
  number: string;
  state: string;
}

interface Customer {
  externalId: string;
  name: string;
  taxId?: string;
  driverLicense?: DriverLicense;
  vip?: string;
  address: Address;
  phone?: string;
  email: string;
  balance?: string;
  currency?: string;
  enrollDate: number;
  dateOfBirth?: string;
}

interface Recurrence {
  frequencyUnit: number;
  frequencyUnitType: number;
  recurringAmount: string;
  automaticCapture: boolean;
  startDate?: number;
  endDate?: number;
  frequency?: number;
}

interface Account {
  accountNumber: string;
  routingNumber: string;
  type: number;
}

interface Verification {
  verifyCustomer: boolean;
}

interface Metadata {
  lang?: string;
  flowType?: string;
  finishButtonLabelType?: string;
  integrationContext?: string;
  urlScheme: string;
  clc?: CLC;
  cid?: string;
}

interface CLC {
  propertyId: string;
  gamingAssetNumber: string;
  datetimeQR: string;
  playerCardNumber?: string;
}