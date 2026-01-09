import { getServicePort, ServiceName } from '@constants/ServicePort';

describe('ServicePort', () => {
    it('should return the correct port for Lightbox service', () => {
        const port = getServicePort(ServiceName.Lightbox);
        expect(port).toBe(10000);
    });

    it('should return the correct port for Widget service', () => {
        const port = getServicePort(ServiceName.Widget);
        expect(port).toBe(8000);
    });
});