export default function Home() {
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
      <video //displays a video from the public folder. Will be moved to cloudinary for performance improvement at a later stage
        src="/HomePage_Video.mp4"
        autoPlay
        loop
        muted
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
