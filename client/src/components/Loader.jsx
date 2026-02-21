import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#121212]/80 backdrop-blur-sm">
            <div className="relative flex flex-col items-center">
                {/* Outer glowing ring */}
                <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>

                {/* Main spinner */}
                <div className="w-16 h-16 border-4 border-orange-200/20 border-t-orange-600 rounded-full animate-spin"></div>

                {/* Loading text to match headers */}
                <div className="mt-6 text-orange-500 font-serif tracking-wide text-xl animate-pulse font-bold">
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default Loader;