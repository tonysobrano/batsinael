import { getImagesFromDirectory } from "@/lib/images";

export const dynamic = 'force-dynamic';

export default function About() {
  const batsImages = getImagesFromDirectory('img/bats');
  const profileImage = batsImages.length > 0 ? batsImages[0] : null;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row gap-12 md:gap-24 pt-12 md:pt-24 items-center md:items-start">
      {profileImage && (
        <div className="w-full md:w-1/2 flex-shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={profileImage} 
            alt="Batsinael Fekadu" 
            className="w-full h-auto object-cover block"
          />
        </div>
      )}
      
      <div className="w-full md:w-1/2 flex flex-col gap-6 text-sm md:text-base leading-relaxed text-gray-700">
        <h1 className="text-xl md:text-2xl font-medium text-black uppercase tracking-[0.2em] mb-4">
          Batsinael Fekadu
        </h1>
        <p>
          I am a Photographer and Director of Photography based in Ethiopia. I specialize in capturing authentic portraits, conceptualizing brand visual identities, and producing high-quality projects.
        </p>
        <p>
          My work is characterized by a minimalist aesthetic, focusing heavily on raw emotion, strong compositions, and purposeful lighting.
        </p>
        
        <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col gap-4">
          <a href="mailto:contact@batsinael.com" className="text-xs uppercase tracking-[0.1em] hover:text-black transition-colors inline-block">
            Contact Me
          </a>
          <a href="#" className="text-xs uppercase tracking-[0.1em] hover:text-black transition-colors inline-block">
            Instagram
          </a>
        </div>
      </div>
    </div>
  );
}
