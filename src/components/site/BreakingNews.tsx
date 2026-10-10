import Link from "next/link";

interface BreakingNewsProps {
  title?: string;
  slug?: string;
}

export default function BreakingNews({
  title,
  slug,
}: BreakingNewsProps) {
  if (!title) return null;

  const content = (
    <>
      <span className="shrink-0 rounded-full bg-[#c7192e] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-white">
        Última hora
      </span>

      <span className="truncate text-[13px] font-semibold text-gray-800">
        {title}
      </span>
    </>
  );

  return (
    <div className="border-b border-red-100 bg-[#fff8f8]">
      <div className="mx-auto flex max-w-[1500px] items-center gap-3 px-5 py-3 lg:px-8">
        {slug ? (
          <Link
            href={`/noticias/${slug}`}
            className="flex min-w-0 items-center gap-3 hover:text-[#c7192e]"
          >
            {content}
          </Link>
        ) : (
          <div className="flex min-w-0 items-center gap-3">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}