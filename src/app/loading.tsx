export default function Loading() {
  const heights = [350, 480, 320, 500, 280, 450, 400, 300];
  
  return (
    <div className="w-full animate-pulse">
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 md:gap-8 space-y-4 md:space-y-8">
        {heights.map((h, i) => (
          <div 
            key={i} 
            className="w-full bg-gray-100 break-inside-avoid"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    </div>
  );
}
