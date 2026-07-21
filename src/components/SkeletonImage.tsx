"use client";

import { useState } from "react";
import clsx from "clsx";

interface SkeletonImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
  priority?: boolean;
}

export function SkeletonImage({ 
  src, 
  alt, 
  className, 
  wrapperClassName, 
  priority,
  ...props 
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className={clsx(
        "relative w-full overflow-hidden bg-gray-100",
        !isLoaded && "animate-pulse min-h-[100px]",
        wrapperClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={clsx(
          "w-full h-auto block transition-all duration-700",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        {...props}
      />
    </div>
  );
}
