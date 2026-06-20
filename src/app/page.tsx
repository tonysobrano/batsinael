"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
import Lenis from "lenis";

const IMAGES = [
  "8AD1D837-F420-40B0-8898-55DE0D2C7CF5.JPG",
  "E3EA23F0-26C3-496C-9DCC-C291A30CDFE7.JPG",
  "F58DDC67-E29B-4485-9C5C-3312503BACF4.JPG",
  "AC80B590-1F9F-41A7-B663-10E132301002.JPG",
  "364E3DAD-1098-4D3E-B10F-FA7943CDE9C8.JPG",
  "669D3A5C-D4FB-49A8-92E2-7EFB12D32828.JPG",
];

const SplitText = ({ text, delayOffset = 0 }: { text: string; delayOffset?: number }) => {
  return (
    <span className="inline-block overflow-hidden">
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          initial={{ y: "100%", opacity: 0, filter: "blur(10px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 0.8,
            ease: [0.16, 1, 0.3, 1],
            delay: delayOffset + index * 0.03,
          }}
          className="inline-block"
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
};

export default function ComingSoon() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Parallax effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-[#FAFAFA] text-zinc-900 selection:bg-zinc-900 selection:text-white">
      
      {/* Background ambient gradient */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 mx-auto flex min-h-[150vh] max-w-screen-2xl flex-col lg:flex-row lg:items-start">
        
        {/* Left Column - Content (Sticky) */}
        <div className="sticky top-0 flex h-screen w-full flex-col justify-center px-8 py-16 lg:w-5/12 lg:px-20 lg:py-20 xl:w-1/2">
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-12 lg:mb-24"
          >
            <div className="inline-flex items-center gap-2 rounded-sm border border-zinc-200 px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-zinc-500"></span>
              </span>
              Archive In Progress
            </div>
          </motion.div>

          <div className="mb-16 lg:mb-24">
            <h2 className="mb-4 overflow-hidden text-[10px] font-medium uppercase tracking-[0.25em] text-zinc-400 sm:text-xs">
              <SplitText text="Visual Artist & Photographer" delayOffset={0.3} />
            </h2>
            
            <h1 className="flex flex-wrap font-sans text-5xl font-light tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              <SplitText text="Batsinael." delayOffset={0.5} />
            </h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2, ease: "easeOut" }}
              className="mt-8 sm:mt-10"
            >
              <p className="max-w-[320px] text-xs font-light leading-loose tracking-wide text-zinc-500 sm:max-w-md sm:text-sm">
                Ethiopian visual artist and fashion photographer. Finding rhythm, intention, and beauty in the darkest, most overlooked places. A new digital portfolio is currently being crafted.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8"
          >
            <a 
              href="https://www.instagram.com/batsinael/" 
              target="_blank" 
              rel="noreferrer"
              className="group flex w-fit items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500"
            >
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              <span>Instagram</span>
            </a>
            <a 
              href="mailto:contact@batsinael.com" 
              className="group flex w-fit items-center gap-3 text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-900 transition-colors hover:text-zinc-500"
            >
              <svg className="h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
              <span>Contact</span>
            </a>
          </motion.div>
        </div>

        {/* Right Column - Image Gallery (Parallax Scroll) */}
        <div className="relative w-full px-4 pb-32 sm:px-8 lg:w-7/12 lg:px-0 lg:pb-0 xl:w-1/2 overflow-hidden lg:overflow-visible">
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:pt-20 lg:pr-8">
            
            {/* Column 1 - Moves faster */}
            <motion.div style={{ y: y1 }} className="flex flex-col gap-2 pt-12 sm:gap-4 lg:pt-32">
              {IMAGES.slice(0, 3).map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.4, 
                    delay: 0.6 + (i * 0.2), 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="relative overflow-hidden bg-zinc-100"
                  style={{ aspectRatio: i === 1 ? '3/4' : '4/5' }}
                >
                  <Image
                    src={`/images/${img}`}
                    alt="Batsinael Portfolio"
                    fill
                    className="object-cover object-center grayscale-[15%] transition-all duration-1000 hover:scale-[1.03] hover:grayscale-0"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    priority={i === 0}
                  />
                </motion.div>
              ))}
            </motion.div>
            
            {/* Column 2 - Moves slower */}
            <motion.div style={{ y: y2 }} className="flex flex-col gap-2 sm:gap-4 lg:pt-0">
              {IMAGES.slice(3, 6).map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, y: 100 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 1.4, 
                    delay: 0.8 + (i * 0.2), 
                    ease: [0.16, 1, 0.3, 1] 
                  }}
                  className="relative overflow-hidden bg-zinc-100"
                  style={{ aspectRatio: i === 0 ? '4/5' : '3/4' }}
                >
                  <Image
                    src={`/images/${img}`}
                    alt="Batsinael Portfolio"
                    fill
                    className="object-cover object-center grayscale-[15%] transition-all duration-1000 hover:scale-[1.03] hover:grayscale-0"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                </motion.div>
              ))}
            </motion.div>
            
          </div>
        </div>

      </main>
    </div>
  );
}
