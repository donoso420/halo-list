"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { KidsContent } from "@/components/KidsContent";

function KidsPageInner() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("story");

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#2b241d]">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,246,230,0.9),_transparent_60%)]" />
      <div className="pointer-events-none fixed -left-24 top-16 h-64 w-64 rounded-full bg-[#e8d3b0] opacity-30 blur-3xl" />
      <div className="pointer-events-none fixed right-8 top-12 h-72 w-72 rounded-full bg-[#cbd7e7] opacity-40 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 py-10 md:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#8b6a3d]">Halo List</p>
            <h1 className="mt-1 text-4xl font-semibold text-[#2f3b52] md:text-5xl">
              Kids Bible Corner
            </h1>
          </div>
          <a
            href="/"
            className="rounded-full border border-[#cbb89a] bg-white px-4 py-2 text-sm font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
          >
            ← Back to reader
          </a>
        </header>

        <KidsContent storyId={storyId} />
      </div>
    </div>
  );
}

export default function KidsPage() {
  return (
    <Suspense>
      <KidsPageInner />
    </Suspense>
  );
}
