import React, { forwardRef } from 'react';
import CodeIcon from '@mui/icons-material/Code';

const ShareOptions = forwardRef(({ onOptionClick }, ref) => {
    const shareOptions = [
        { label: 'Facebook', action: 'share_facebook', icon: <img src="/images/logo/fb.png" alt="Facebook" className="w-5 h-5" /> },
        { label: 'Zalo', action: 'share_zalo', icon: <img src="/images/logo/zalo.webp" alt="Zalo" className="w-5 h-5" /> },
        { label: 'Embed Code', action: 'embed_code', icon: <CodeIcon /> },
    ];

    return (
        <div
            ref={ref}
            className="absolute z-50 rounded-md shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5"
            style={{ left: '-140px', bottom: '0' }}
        >
            <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="share-options-menu">
                {shareOptions.map((option, index) => (
                    <button
                        key={index}
                        className="flex items-center w-full text-left px-4 py-2 text-sm rounded-sm text-gray-300 hover:bg-gray-700 hover:text-white"
                        role="menuitem"
                        onClick={(e) => {
                            e.stopPropagation();
                            onOptionClick(option.action);
                        }}
                    >
                        <span className="mr-3 flex items-center">{option.icon}</span>
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
});



export default ShareOptions;
