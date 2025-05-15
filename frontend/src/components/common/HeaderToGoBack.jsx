import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const HeaderToGoBack = ({ centerText, rightButton }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const isInRoute = location.pathname === '/home';

    return (
        <div className="flex items-center h-14 px-4 border-b border-gray-200 bg-white justify-between">
            <div className="min-w-[40px] flex items-center">
                {isInRoute ? (
                    <span className="font-medium">Hi user</span>
                ) : (
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-none border-none cursor-pointer p-0 flex items-center"
                        aria-label="Go back"
                        type="button"
                    >
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" />
                        </svg>
                    </button>
                )}
            </div>
            <div className="flex-1 text-center font-semibold">
                {centerText && <span>{centerText}</span>}
            </div>
            <div className="min-w-[40px] flex items-center justify-end">
                {isInRoute ? (
                    <span className="w-8 h-8 rounded-full bg-gray-200 inline-flex items-center justify-center">
                        <svg width="20" height="20" fill="none" stroke="gray" strokeWidth="1.5">
                            <circle cx="10" cy="7" r="3" />
                            <path d="M3 17c0-2.5 3.5-4 7-4s7 1.5 7 4" />
                        </svg>
                    </span>
                ) : (
                    rightButton || null
                )}
            </div>
        </div>
    );
};

export default HeaderToGoBack;
