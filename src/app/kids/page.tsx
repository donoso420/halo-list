"use client";

import { useMemo } from "react";

type KidsStory = {
  id: string;
  title: string;
  summary: string;
  verse: string;
  activity: string;
  image: string;
};

const stories: KidsStory[] = [
  {
    id: "noah",
    title: "Noah’s Ark",
    summary:
      "God asked Noah to build an ark. Noah trusted God, and God kept His promise.",
    verse: "Genesis 6:22 — “Noah did everything just as God commanded.”",
    activity: "Color a rainbow and list three promises God gives us.",
    image: "/kids-ark.svg",
  },
  {
    id: "shepherd",
    title: "The Good Shepherd",
    summary:
      "Jesus loves and protects every one of us, just like a shepherd cares for the sheep.",
    verse: "John 10:14 — “I am the good shepherd.”",
    activity: "Draw a sheep and write one way Jesus cares for you.",
    image: "/kids-shepherd.svg",
  },
  {
    id: "memory",
    title: "Memory Verse",
    summary:
      "Practice kind words and loving actions that make friends feel safe.",
    verse: "Ephesians 4:32 — “Be kind and compassionate.”",
    activity: "Say the verse three times and share one kind thing you did.",
    image: "/kids-book.svg",
  },
  {
    id: "activity",
    title: "Activity Time",
    summary:
      "Short prayers and coloring pages help us thank God for today.",
    verse: "Psalm 118:24 — “This is the day the Lord has made.”",
    activity: "Write a thank-you prayer and draw something that made you smile.",
    image: "/kids-sun.svg",
  },
];

export default function KidsPage() {
  const storyId =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("story")
      : null;
  const activeStory = useMemo(() => {
    const fallback = stories[0];
    if (!storyId) {
      return fallback;
    }
    return stories.find((item) => item.id === storyId) || fallback;
  }, [storyId]);

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#2b241d]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,246,230,0.95),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.55),_transparent_65%)] opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#e8d3b0] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-12 h-72 w-72 rounded-full bg-[#cbd7e7] opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#f0e1c8] opacity-40 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-14 md:px-10">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#8b6a3d]">
                Kids Bible
              </p>
              <h1 className="text-4xl font-semibold text-[#2f3b52] md:text-5xl">
                Kids Bible Corner
              </h1>
            </div>
            <a
              href="/"
              className="rounded-full border border-[#cbb89a] bg-white px-4 py-2 text-xs font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
            >
              Back to Halo List
            </a>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-center">
            <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
                Today’s story
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-[#2b241d]">
                {activeStory.title}
              </h2>
              <p className="mt-3 text-sm text-[#5a534b]">
                {activeStory.summary}
              </p>
              <div className="mt-4 rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                  Memory verse
                </p>
                <p className="mt-2 text-sm font-semibold text-[#2b241d]">
                  {activeStory.verse}
                </p>
              </div>
              <div className="mt-4 rounded-2xl border border-[#e7dfd3] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                  Activity
                </p>
                <p className="mt-2 text-sm text-[#5a534b]">
                  {activeStory.activity}
                </p>
              </div>
            </div>
            <div className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
              <img
                src={activeStory.image}
                alt={`${activeStory.title} illustration`}
                className="h-56 w-full rounded-2xl bg-white object-contain p-4"
              />
              <p className="mt-4 text-xs text-[#7a6b5a]">
                Tip: Read the story together, then pray and thank God for His
                love.
              </p>
            </div>
          </section>

          <section className="rounded-[32px] bg-white/85 p-5 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
            <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
              More kids stories
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {stories.map((story) => (
                <a
                  key={story.id}
                  href={`/kids?story=${story.id}`}
                  className="rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)]"
                >
                  <img
                    src={story.image}
                    alt={`${story.title} illustration`}
                    className="h-24 w-full rounded-2xl bg-white object-contain p-2"
                  />
                  <p className="mt-3 text-sm font-semibold text-[#2b241d]">
                    {story.title}
                  </p>
                  <p className="text-xs text-[#7a6b5a]">{story.verse}</p>
                </a>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
