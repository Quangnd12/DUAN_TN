import React from 'react';
import ContentCard from '../../components/cards/Content';
import tb from '../../../public/assets/img/Tb.png';
import { translations } from '../../utils/translations/translations';
import { useTheme } from '../../utils/ThemeContext';

const Content = () => {
  const { language } = useTheme();

  return (
    <div className="bg-black text-white p-8">
      <div className="flex flex-col items-start justify-between">
        <h1 className="text-7xl font-bold mb-2 ml-32">{translations[language].whatsNew}</h1>
        <p className="text-gray-400 mb-4 ml-36">
          {translations[language].enjoyMoments} <br />
          {translations[language].togetherWithMusic}
        </p>
        <img 
          src={tb} 
          alt="Feature image" 
          className="w-36 max-w-2xl h-auto object-cover rounded-lg"
        />
        
        <div className="w-full">
          <span className="text-gray-400 font-semibold mb-1 inline-block">{translations[language].newSongs}</span>
          <hr className="w-full border-t border-gray-600" />
        </div>
      </div>

      {/* Render items */}
      <div className="flex flex-col gap-4 pt-2">
       <ContentCard/>
       
      </div>
    </div>
  );
};

export default Content;