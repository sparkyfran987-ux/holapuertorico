"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Sponsor {
  id: string;
  name: string;
  image_url: string;
  target_url: string | null;
}

interface SponsorRotatorProps {
  sponsors: Sponsor[];
  width: number;
  height: number;
  className?: string;
}

export default function SponsorRotator({
  sponsors,
  width,
  height,
  className = "",
}: SponsorRotatorProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sponsors.length <= 1) return;

    const interval = window.setInterval(() => {
      setCurrentIndex((current) => (current + 1) % sponsors.length);
    }, 10000);

    return () => {
      window.clearInterval(interval);
    };
  }, [sponsors.length]);

  const sponsor = sponsors[currentIndex];

  const content = (
    <div
      className={`relative flex w-full items-center justify-center overflow-hidden bg-white ${className}`}
      style={{
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <img
        src={sponsor.image_url}
        alt={sponsor.name}
        className="h-full w-full object-contain"
      />
    </div>
  );

  if (sponsor.target_url) {
    return (
      <Link
        href={sponsor.target_url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visitar ${sponsor.name}`}
        className="block w-full"
      >
        {content}
      </Link>
    );
  }

  return content;
}