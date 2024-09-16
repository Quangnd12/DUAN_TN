import React, { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';
import debounce from 'lodash/debounce';

const Waveform = ({ audioUrl, isPlaying }) => {
    const waveformRef = useRef(null);
    const wavesurferRef = useRef(null);

    useEffect(() => {
        if (!wavesurferRef.current) {
            wavesurferRef.current = WaveSurfer.create({
                container: waveformRef.current,
                waveColor: '#ddd',
                progressColor: '#4a90e2',
                cursorColor: '#4a90e2',
                height: 60,
                barWidth: 2,
            });
            wavesurferRef.current.load(audioUrl);
        }

        const handlePlayPause = debounce(() => {
            if (isPlaying) {
                wavesurferRef.current.play();
            } else {
                wavesurferRef.current.pause();
            }
        }, 300); 

        handlePlayPause();

        return () => {
            handlePlayPause.cancel(); 
            wavesurferRef.current.destroy();
        };
    }, [audioUrl, isPlaying]);

    return <div ref={waveformRef} />;
};

export default Waveform;
