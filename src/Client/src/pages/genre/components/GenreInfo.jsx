import React,{useEffect,useState} from "react";
import { getSongs } from "services/songs";


const GenreInfo = ({id}) => {

    const [Songs, setSongs] = useState([]);

    const SongData = async (page = 0, limit = 0, search = '', genre = [], minDuration = 0, maxDuration = 0, minListensCount = 0, maxListensCount = 0) => {
        const data = await getSongs(page, limit, search, genre, minDuration, maxDuration, minListensCount, maxListensCount); 
        setSongs(data.songs || []);
      };
    
      useEffect(() => {
        if (id) {
            const genre=JSON.parse(id)
          SongData(0, 0, '', [genre]); 
        }
      }, [id]);

    return (
        <div className="relative w-full h-1/3 flex">  
        {Songs.slice(0, 1).map((song) => (
            <div className="w-full h-full artist-bg flex items-center p-8" key={song.id}>
          
                <h1 className="text-[10rem] font-bold text-white ml-10 mb-14">{song.genre}</h1>    
              
            </div>  
              ))}    
        </div>
    );
};

export default GenreInfo;
