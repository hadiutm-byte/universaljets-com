import { useEffect, useState } from 'react';

const usePhoneGeolocation = () => {
    const [countryCode, setCountryCode] = useState('');

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
                if (response.ok) {
                    const data = await response.json();
                    setCountryCode(data.country_calling_code || '');
                    return;
                }
            } catch {
                // Ignore provider errors and fall back to the next provider.
            }
            try {
                const response = await fetch('https://ip-api.com/json/?fields=countryCode', { signal: AbortSignal.timeout(4000) });
                if (response.ok) {
                    const data = await response.json();
                    const { default: ALL } = await import('@/lib/countryCodes');
                    const entry = ALL.find(c => c.iso === data.countryCode);
                    setCountryCode(entry?.code || '');
                }
            } catch {
                // Ignore provider errors and keep the default empty code.
            }
        };
        fetchCountryCode();
    }, []);

    return countryCode;
};

export default usePhoneGeolocation;