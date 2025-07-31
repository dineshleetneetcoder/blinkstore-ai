import React, { useEffect } from 'react';

const Toast = ({ message, show, onHide }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onHide();
            }, 5000); // The toast will disappear after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [show, onHide]);

    return (
        <div
            className={`fixed bottom-10 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
                show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
        >
            <div className="bg-gray-800 text-white font-semibold py-3 px-6 rounded-full shadow-lg flex items-center space-x-3">
                <span>🤖</span>
                <span>{message}</span>
            </div>
        </div>
    );
};

export default Toast;
