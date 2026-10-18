import type { CSSProperties } from "react";

export default function FeaturedNews() {
  const iframeStyle: CSSProperties = {
    display: "block",
    width: "100%",
    height: "1080px",
    border: "none",
  };

  return (
    <section
      id="destacadas"
      className="scroll-mt-6 bg-white py-10 sm:py-14"
    >
      <div className="mx-auto w-full max-w-[1920px] px-3 sm:px-6">
        <div className="mb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-8 bg-[#bf0a30]" />
            <span className="h-2 w-5 bg-[#002868]" />
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#071428] sm:text-4xl">
            Últimas publicaciones de Facebook
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Mantente al día con las publicaciones de Hola Puerto Rico+.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <iframe
            src="https://widgets.sociablekit.com/facebook-page-posts/iframe/25722931"
            title="Publicaciones de Facebook de Hola Puerto Rico+"
            style={iframeStyle}
            loading="lazy"
            allow="encrypted-media"
          />
        </div>
      </div>
    </section>
  );
}
