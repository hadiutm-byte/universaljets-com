import { useEffect, useState } from 'react';

const usePhoneGeolocation = () => {
    const [countryCode, setCountryCode] = useState('');

    useEffect(() => {
        const fetchCountryCode = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/');
                const data = await response.json();
                setCountryCode(data.country_calling_code || '');
            } catch (error) {
                console.error('Error fetching country code:', error);
            }
        };
        fetchCountryCode();
    }, []);

    return countryCode;
};

export default usePhoneGeolocation;