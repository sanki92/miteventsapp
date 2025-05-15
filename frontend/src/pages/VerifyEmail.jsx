import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; 

const VerifyEmail = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        async function verifyEmail() {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            if (token) {
                const res = await AuthService.verifyEmail(token);
                console.log(res);
                if (res.status === 200) {
                    navigate('/login');
                } else {
                    console.error('Email verification failed');
                }
            }
        }
        verifyEmail();

    }, [location.search, navigate]);

    return (
        <div></div>
    );
};

export default VerifyEmail;