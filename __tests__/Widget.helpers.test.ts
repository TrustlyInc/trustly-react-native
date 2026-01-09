import { getSearchParams, getWidgetUrl } from '@components/Widget/Widget.helpers';
import { EstablishDataMock } from '@mocks/EstablishData.mocks';

jest.mock('@root/package.json', () => ({ version: '1.0.0' }));

describe('Widget.helpers', () => {
    describe('getSearchParams', () => {
        it('should return the correct search params', () => {
            const enrichedEstablish = {
                accessId: '123',
                deviceType: 'mobile',
                dynamicWidget: true,
                grp: 'group1',
                merchantId: 'merchant123',
                paymentType: 'credit',
                customer: {
                    address: {
                        country: 'US',
                        state: 'CA',
                    },
                    externalId: 'cust123',
                },
                metadata: {
                    lang: 'en',
                },
            };

            const result = getSearchParams(enrichedEstablish);
            expect(result).toBe(
                'accessId=123&deviceType=mobile&dynamicWidget=true&grp=group1&merchantId=merchant123&paymentType=credit&customer.address.country=US&customer.address.state=CA&customer.externalId=cust123&lang=en'
            );
        });

        it('should return empty string if no eligible keys are present', () => {
            const enrichedEstablish = {};
            const result = getSearchParams(enrichedEstablish);
            expect(result).toBe('');
        });
    });

    describe('getWidgetUrl', () => {
        it('should return the correct widget URL', () => {
            const result = getWidgetUrl(EstablishDataMock);
            const urlObj = new URL(result);
            const params = new URLSearchParams(urlObj.search);
            const grp = params.get('grp');

            expect(result).toBe(
                `https://trustly.one/start/selectBank/selectBankWidget?v=1.0.0-rn-sdk&accessId=123&deviceType=mobile:ios:react-native&dynamicWidget=true&grp=${grp}&merchantId=456&paymentType=Instant&customer.address.country=US&customer.address.state=CA&customer.externalId=789&lang=en`
            );
        });
    });
});