import React from 'react';

export default function Home(): React.ReactElement {
  const cloudinaryBaseURL = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload/v1736002645/trainer2/6078259-uhd_3840_2160_25fps_whqat4.mp4`;

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
        src={cloudinaryBaseURL}
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
