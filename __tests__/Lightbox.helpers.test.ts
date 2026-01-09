import { LIGHTBOX_ENDPOINT } from '@constants/Endpoints';
import { version } from '@root/package.json';
import { 
    getReturnParameters, 
    createLightboxEstablishData, 
    getLightboxUrl,
    base64EstablishData,
 } from '@components/Lightbox/Lightbox.helpers';
import { 
    EstablishDataMock, 
    EstablishDataWithoutMetadataMock 
} from '@mocks/EstablishData.mocks';

describe('Lightbox.helpers', () => {
    describe('getReturnParameters', () => {
        it('should return correct parameters and action', () => {
            const url = 'myapp://return/?param1=value1';
            const urlScheme = 'myapp://';
            const result = getReturnParameters(url, urlScheme);

            expect(result).toEqual({
                object: { param1: 'value1' },
                action: 'return',
            });
        });

        it('should handle url without action', () => {
            const url = 'myapp://?param1=value1';
            const urlScheme = 'myapp://';
            const result = getReturnParameters(url, urlScheme);

            expect(result).toEqual({
                object: { param1: 'value1' },
                action: undefined,
            });
        });
    });

    describe('createLightboxEstablishData', () => {
        it('should enrich establish data and add paymentProviderId', () => {
            const paymentProviderId = '000000000';
            const result = createLightboxEstablishData(EstablishDataMock, paymentProviderId);

            expect(result).toEqual({
                ...EstablishDataMock,
                paymentProviderId: '000000000',
                returnUrl: 'myapp://return/',
                cancelUrl: 'myapp://cancel/',
                grp: result.grp
            });
        });

        it('should log error if urlScheme is missing', () => {
            const paymentProviderId = '000000000';
            console.error = jest.fn();

            createLightboxEstablishData(EstablishDataWithoutMetadataMock, paymentProviderId);

            expect(console.error).toHaveBeenCalledWith('urlScheme is missing in metadata');
        });
    });

    describe('getLightboxUrl', () => {
        it('should return correct lightbox URL', () => {
            const paymentProviderId = '000000000';
            const domain = 'https://trustly.one';
            const token = base64EstablishData(EstablishDataMock, paymentProviderId);
            const result = getLightboxUrl(EstablishDataMock, paymentProviderId);

            expect(result).toBe(`${domain}${LIGHTBOX_ENDPOINT}?v=${version}-rn-sdk&token=${token}`);
        });
    });
});