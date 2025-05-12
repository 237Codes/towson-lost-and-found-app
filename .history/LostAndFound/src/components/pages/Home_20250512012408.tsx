import TabSwitch from "@/components/TabSwitch";

const Home = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          aria-hidden="true"
          aria-label="Compilation of video shots of campus life around Towson University."
        >
          <video
            id="bg-video"
            playsInline
            autoPlay
            muted
            loop
            className="w-screen h-screen object-cover"
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1062812793/rendition/1080p/file.mp4?loc=external&amp;signature=34a10cb20e94d26f687f0ef1ea28764309caf31c1eff2dd8c1d9cc36428693a6&amp;user_id=210553832"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="copy" id="skip">
              <h1 className="text-7xl font-bold text-white text-center">
                Towson <span className="text-yellow-400">Lost</span> and{" "}
                <span className="text-yellow-400">Found</span>
              </h1>
              <hr aria-hidden="true" className="my-4 border-yellow-400" />
              <TabSwitch activeTab="lost" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
