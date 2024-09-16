import React from 'react';
import { MdMoreHoriz } from 'react-icons/md';


const MoreButton = ({
}) => {
    return (
        <>
            <MdMoreHoriz
                className="text-white cursor-pointer hover:text-gray-500"
                size={24}
                onClick={(e) => {
                    e.stopPropagation();                  
                }}
            />           
        </>
    );
};

export default MoreButton;
