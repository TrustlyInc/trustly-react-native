import { getEnvironmentDomain } from '@utils/getEnvironmentDomain';
import { getServicePort, ServiceName } from '@constants/ServicePort';

jest.mock('@constants/ServicePort', () => ({
    getServicePort: jest.fn(),
    ServiceName: {
        Widget: 'Widget',
        AnotherService: 'AnotherService'
    }
}));

describe('getEnvironmentDomain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return default domain when environment is empty', () => {
        expect(getEnvironmentDomain()).toBe('https://trustly.one');
    });

    it('should return internal domain for dev environments', () => {
        expect(getEnvironmentDomain('dev-test')).toBe('https://dev-test.int.trustly.one');
    });

    it('should return localhost domain with service port', () => {
        (getServicePort as jest.Mock).mockReturnValue(3000);
        expect(getEnvironmentDomain('localhost')).toBe('http://localhost:3000');
        expect(getServicePort).toHaveBeenCalledWith(ServiceName.Widget);
    });

    it('should return IP address domain with service port', () => {
        (getServicePort as jest.Mock).mockReturnValue(3000);
        expect(getEnvironmentDomain('192.168.1.1')).toBe('http://192.168.1.1:3000');
        expect(getServicePort).toHaveBeenCalledWith(ServiceName.Widget);
    });

    it('should return production domain for other environments', () => {
        expect(getEnvironmentDomain('prod')).toBe('https://prod.trustly.one');
    });

    it('should use the provided service name to get the port', () => {
        (getServicePort as jest.Mock).mockReturnValue(4000);
        expect(getEnvironmentDomain('localhost', ServiceName.AnotherService)).toBe('http://localhost:4000');
        expect(getServicePort).toHaveBeenCalledWith(ServiceName.AnotherService);
    });
});