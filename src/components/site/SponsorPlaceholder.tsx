interface SponsorPlaceholderProps {
  width: 1456 | 1024 | 320 | 160;
  height: 180 | 1024 | 1200 | 600;
  className?: string;
}

export default function SponsorPlaceholder({
  width,
  height,
  className = "",
}: SponsorPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-gray-300 bg-gray-50 ${className}`}
      style={{
        width: "100%",
        maxWidth: `${width}px`,
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <div className="px-4 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.16em] text-gray-400">
          Espacio para auspiciador
        </p>

        <p className="mt-1 text-[9px] font-medium text-gray-400">
          {width} × {height}
        </p>
      </div>
    </div>
  );
}