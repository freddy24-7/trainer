import React from 'react';

export default function Home(): React.ReactElement {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <video
        src="/HomePage_Video.mp4"
        autoPlay={true}
        loop={true}
        muted={true}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
