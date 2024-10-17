import React from 'react';
import ContentCard from '../../components/cards/Content';
import tb from '../../../public/assets/img/Tb.png'
const Content = () => {
  // Sample array of items
  const items = [
    {
      img: '/assets/images/anh1.jpg',
      title: 'Hero',
      artist: 'Charlie Puth',
      releaseDate: 'Single - May 24, 2024',
      duration: '3:30', // Thêm thời gian phát
    },
    {
      img: '/assets/images/anh1.jpg',
      title: 'America',
      artist: 'Charlie Puth',
      releaseDate: 'Single - May 24, 2024',
      duration: '3:45',
    },
    {
      img: '/assets/images/anh1.jpg',
      title: 'Success',
      artist: 'Charlie Puth',
      releaseDate: 'Single - May 24, 2024',
      duration: '4:00',
    },
  ];
  
  

  return (
    <div className="bg-black text-white p-8">
      <div className="flex flex-col items-start justify-between">
        <h1 className="text-7xl font-bold mb-2 ml-32">What's new today?</h1>
        <p className="text-gray-400 mb-4 ml-36">Let's enjoy wonderful moments of relaxation <br />
        together with music.</p>
        <img 
          src={tb} 
          alt="Feature image" 
          className="w-36 max-w-2xl h-auto object-cover rounded-lg"
        />
        <div className="w-full">
          
          <span className="text-gray-400 font-semibold mb-1 inline-block">New songs</span>
          <hr className="w-full border-t border-gray-600" />
        </div>
      </div>

      {/* Render items */}
      {items.map((item, index) => (
        <ContentCard key={index} {...item} />
      ))}

    </div>
  );
};

export default Content;