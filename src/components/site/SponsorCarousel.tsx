
"use client";

import { useEffect, useState } from "react";

export type SponsorLogo = {
  id: string;
  name: string;
  image_url: string;
  target_url: string;
};

type SponsorCarouselProps = {
  logos: SponsorLogo[];
};

export default function SponsorCarousel({
  logos,
}: SponsorCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (logos.length < 2) return;

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % logos.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [logos.length]);

  useEffect(() => {
    setActiveIndex(0);
  }, [logos.length]);

  if (logos.length === 0) return null;

  const logo = logos[activeIndex];

  return (
    <section
      aria-label="Auspiciadores"
      className="relative isolate w-full overflow-hidden"
    >
      <div
        className="absolute inset-0 -z-20 bg-gradient-to-r from-[#071428] via-[#16345a] to-[#071428]"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/franja-auspiciadores.png')",
        }}
        aria-hidden="true"
      />

      <div className="flex h-[140px] w-full items-center justify-center px-5 sm:h-[170px] lg:h-[213px]">
        <a
          key={logo.id}
          href={logo.target_url}
          target="_blank"
          rel="noopener noreferrer sponsored"
          aria-label={`Visitar ${logo.name}`}
          className="flex h-full w-full items-center justify-center animate-[sponsorFade_500ms_ease-in-out]"
        >
          <img
            src={logo.image_url}
            alt={logo.name}
            className="max-h-[110px] max-w-[min(80vw,420px)] object-contain sm:max-h-[135px] lg:max-h-[155px]"
          />
        </a>
      </div>

      <style jsx>{`
        @keyframes sponsorFade {
          from {
            opacity: 0;
            transform: translateX(18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(.animate-\\[sponsorFade_500ms_ease-in-out\\]) {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}
