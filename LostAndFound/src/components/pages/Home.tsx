import { Button } from "../ui/button";
import TabSwitch from "@/components/TabSwitch";

const Home = () => {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <section className="relative flex h-screen w-full items-center justify-center overflow-hidden">
        <div
          className=""
          aria-hidden="true"
          aria-label="Compilation of video shots of campus life around Towson University."
        >
          <video
            id="bg-video"
            playsInline
            autoPlay
            muted
            loop
            className="w-screen"
          >
            <source
              src="https://player.vimeo.com/progressive_redirect/playback/1062812793/rendition/1080p/file.mp4?loc=external&amp;signature=34a10cb20e94d26f687f0ef1ea28764309caf31c1eff2dd8c1d9cc36428693a6&amp;user_id=210553832"
              type="video/mp4"
            />
          </video>
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="copy" id="skip">
              <h1 className="text-7xl font-bold text-white">
                Towson <span className="text-yellow-400">Lost</span> and{" "}
                <span className="text-yellow-400">Found</span>
              </h1>
              <hr aria-hidden="true" className="my-4 border-yellow-400" />
              <TabSwitch activeTab="lost" />
            </div>
          </div>
        </div>
      </section>
      <section className="relative flex h-screen w-full items-center justify-center">
        <div
          id="button-play-pause"
          className="video-controls vimeo playing absolute right-4 top-4 z-30"
        >
          <i
            className="play-pause-btn-vimeo ri-pause-circle-line cursor-pointer text-3xl text-white"
            tabIndex={0}
            role="button"
            aria-label="Pause background video"
          ></i>
        </div>

        <div className="flex space-x-4">
          <a href="/report-lost">
            <Button variant="default" className="mt-8">
              Report Lost Item
            </Button>
          </a>
          <a href="/report-found">
            <Button variant="default" className="mt-8">
              Report Found Item
            </Button>
          </a>
        </div>
        
      </section>
    </div>
  );
};

export default Home;
