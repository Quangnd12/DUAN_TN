import React from "react";
import Playlist from "./playlist/Playlist";

function Artist() {
  return (
    <div className="relative w-full h-screen">
      <img
        src="../assets/img/CoverArtist.jpg"
        alt="Artist Cover"
        className="absolute top-0 contrast-50 left-0 w-full h-4/5 object-cover rounded"
        style={{
          aspectRatio: "1/1",
          imageRendering: "auto",
        }}
      />
      <div className="relative h-3/5 z-10 p-4">
        <div className="absolute top-36 left-4 flex items-center space-x-2">
          <div className="relative top-20 left-5 bg-white p-1 rounded-full">
            <svg
              data-encore-id="icon"
              role="img"
              aria-hidden="true"
              className="Svg-sc-ytk21e-0 gxNUVX b0NcxAbHvRbqgs2S8QDg default_cursor_cs h-6 w-6 text-white"
              viewBox="0 0 24 24"
            >
              <path
                d="M10.814.5a1.658 1.658 0 0 1 2.372 0l2.512 2.572 3.595-.043a1.658 1.658 0 0 1 1.678 1.678l-.043 3.595 2.572 2.512c.667.65.667 1.722 0 2.372l-2.572 2.512.043 3.595a1.658 1.658 0 0 1-1.678 1.678l-3.595-.043-2.512 2.572a1.658 1.658 0 0 1-2.372 0l-2.512-2.572-3.595.043a1.658 1.658 0 0 1-1.678-1.678l.043-3.595L.5 13.186a1.658 1.658 0 0 1 0-2.372l2.572-2.512-.043-3.595a1.658 1.658 0 0 1 1.678-1.678l3.595.043L10.814.5zm6.584 9.12a1 1 0 0 0-1.414-1.413l-6.011 6.01-1.894-1.893a1 1 0 0 0-1.414 1.414l3.308 3.308 7.425-7.425z"
                className="default_cursor_cs"
              ></path>
            </svg>
          </div>
          <span className=" relative top-20 left-5 text-white font-semibold">
            Nghệ sĩ được xác minh
          </span>
          <div className="absolute top-28 left-3 text-white">
            <h1 className="text-8xl font-bold">SOOBIN</h1>
            <p className="text-left text-lg mt-2">
              1,017,761 người nghe hàng tháng
            </p>
          </div>
        </div>
      </div>
      <div className="relative text-left">
        <Playlist/>
      </div>
    </div>
  );
}

export default Artist;
