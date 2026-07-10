"use client";

import { useState } from "react";
import clsx from "clsx";

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export function SkeletonImage({ 
  src, 
  alt, 
  className, 
  wrapperClassName, 
  ...props 
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={clsx(
      "relative w-full overflow-hidden bg-gray-100 min-h-[200px]",
      !isLoaded && "animate-pulse",
      wrapperClassName
    )}>
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "w-full h-auto object-cover transition-all duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading="lazy"
        {...props}
      />
    </div>
  );
}
