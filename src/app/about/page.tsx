import Image from "next/image";
import { getImagesFromDirectory } from "@/lib/images";

export default function About() {
  const batsImages = getImagesFromDirectory('img/bats');
  const profileImage = batsImages.length > 0 ? batsImages[0] : null;

  return (
    <div className="w-full min-h-[80vh] flex flex-col justify-center">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
        {/* Left: Text Content */}
        <div className="lg:col-span-5 flex flex-col gap-12 order-2 lg:order-1">
          <div>
            <h1 className="text-4xl lg:text-6xl font-medium tracking-tighter text-black mb-6 uppercase leading-[0.9]">
              Batsinael<br/>Fekadu
            </h1>
            <p className="text-lg lg:text-xl text-black/60 font-light leading-relaxed">
              &quot;Finding beauty in unlikely places is the beauty of my art.&quot;
            </p>
          </div>

          <div className="flex flex-col gap-6 text-sm text-black/80 font-light leading-relaxed">
            <p>
              I am an Ethiopian visual artist and photographer based in Addis Ababa. I see myself as an artist first and a photographer second — photography is my current medium, but not my limit.
            </p>
            <p>
              My background as a choreographer deeply informs my visual eye. My work carries rhythm, intention, and physicality, characterized by a dark, editorial aesthetic that favors shadow, contrast, and quiet confidence.
            </p>
            <p>
              I created the Ashara Project to bring together creatives united by a shared search for beauty, proving that &quot;a pure heart can move mountains.&quot;
            </p>
          </div>

          <div className="flex gap-8 pt-6 border-t border-black/10">
            <a href="mailto:contact@batsinael.com" className="text-xs uppercase tracking-[0.2em] font-medium text-black hover:opacity-50 transition-opacity">
              Contact
            </a>
            <a href="https://instagram.com/batsinael" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-[0.2em] font-medium text-black hover:opacity-50 transition-opacity">
              Instagram
            </a>
          </div>
        </div>

        {/* Right: Image */}
        {profileImage && (
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f5f5f5]">
              <Image
                src={profileImage.url}
                alt="Batsinael Fekadu"
                fill
                loading="eager"
                fetchPriority="high"
                quality={92}
                sizes="(max-width: 1023px) calc(100vw - 48px), calc((100vw - 284px) * 0.58)"
                className="object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
