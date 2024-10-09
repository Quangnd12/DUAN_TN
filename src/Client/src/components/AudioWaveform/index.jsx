// AudioWaveform.js
import React, { useRef, useEffect } from "react";
import WaveSurfer from "wavesurfer.js";

const AudioWaveform = () => {
  const waveSurferRef = useRef(null);

  useEffect(() => {
    // Khởi tạo WaveSurfer
    waveSurferRef.current = WaveSurfer.create({
      container: '#waveform',
      waveColor: '#fff',
      progressColor: '#3b82f6',
      height: 80,
      responsive: true,
    });

    // Tạo một sóng âm giả
    waveSurferRef.current.load(Array.from({ length: 100 }, () => Math.random()));

    return () => {
      // Kiểm tra và chỉ gọi destroy nếu waveSurferRef.current đã được khởi tạo
      if (waveSurferRef.current) {
        waveSurferRef.current.destroy();
        waveSurferRef.current = null; // Đặt lại ref để tránh gọi destroy nhiều lần
      }
    };
  }, []);

  return <div id="waveform" className="mt-4"></div>;
};

export default AudioWaveform;
