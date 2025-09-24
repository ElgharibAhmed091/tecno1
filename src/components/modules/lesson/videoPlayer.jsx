import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import useAxios from '@/utils/useAxios';
import { Skeleton } from '@/components/ui/skeleton';

const VideoPlayer = ({ lessonId }) => {
  const videoNode = useRef(null);
  const player = useRef(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const axios = useAxios();

  // Initialize only when DOM is ready
  const initPlayer = () => {
    if (!player.current && videoNode.current && document.body.contains(videoNode.current)) {
      player.current = videojs(videoNode.current, {
        controls: true,
        fluid: true,
        responsive: true,
        playbackRates: [0.5, 1, 1.25, 1.5, 2], 
        controlBar: {
          children: [
            'playToggle',
            'volumePanel',
            'currentTimeDisplay',
            'timeDivider',
            'durationDisplay',
            'progressControl',
            'playbackRateMenuButton',
            'fullscreenToggle'
          ]
        },
        
        sources: [{ src: videoUrl, type: 'video/mp4' }]
      });
    }
  };

  const cleanupPlayer = () => {
    if (player.current) {
      if (document.body.contains(player.current.el())) {
        player.current.dispose();
      }
      player.current = null;
    }
  };

  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
      cleanupPlayer();
      if (videoUrl) URL.revokeObjectURL(videoUrl);
    };
  }, []);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`/api/video/${lessonId}/stream/`, {
          responseType: 'blob'
        });
        if (isMounted) setVideoUrl(URL.createObjectURL(res.data));
      } catch (err) {
        console.error('Video load failed:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };
    
    fetchVideo();
  }, [lessonId, isMounted]);

  useEffect(() => {
    if (videoUrl && !isLoading) {
      cleanupPlayer();
      // Delay initialization for DOM stability
      const timeout = setTimeout(initPlayer, 50);
      return () => clearTimeout(timeout);
    }
  }, [videoUrl, isLoading]);

  return (
    <div className="video-container aspect-video bg-black rounded-xl relative">
      {isLoading ? (
        <Skeleton className="w-full h-full" />
      ) : (
        <div data-vjs-player key={lessonId}>
          <video 
            ref={videoNode}
            className="video-js"
            playsInline
            preload="auto"
          />
        </div>
      )}
    </div>
  );
};
{/* <style jsx global>{`
`}</style> */}
export default VideoPlayer
// Add this CSS