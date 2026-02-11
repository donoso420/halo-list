"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

type KidsStory = {
  id: string;
  title: string;
  summary: string;
  verse: string;
  activity: string;
  image: string;
  ref: string;
};

const stories: KidsStory[] = [
  {
    id: "noah",
    title: "Noah's Ark",
    summary:
      "God asked Noah to build an ark. Noah trusted God, and God kept His promise.",
    verse: "Genesis 6:22 — \"Noah did everything just as God commanded.\"",
    activity: "Color a rainbow and list three promises God gives us.",
    image: "/kids-ark.svg",
    ref: "Genesis 6:9-22",
  },
  {
    id: "shepherd",
    title: "The Good Shepherd",
    summary:
      "Jesus loves and protects every one of us, just like a shepherd cares for the sheep.",
    verse: "John 10:14 — \"I am the good shepherd.\"",
    activity: "Draw a sheep and write one way Jesus cares for you.",
    image: "/kids-shepherd.svg",
    ref: "John 10:11-16",
  },
  {
    id: "memory",
    title: "Memory Verse",
    summary:
      "Practice kind words and loving actions that make friends feel safe.",
    verse: "Ephesians 4:32 — \"Be kind and compassionate.\"",
    activity: "Say the verse three times and share one kind thing you did.",
    image: "/kids-book.svg",
    ref: "Ephesians 4:32",
  },
  {
    id: "activity",
    title: "Activity Time",
    summary:
      "Short prayers and coloring pages help us thank God for today.",
    verse: "Psalm 118:24 — \"This is the day the Lord has made.\"",
    activity: "Write a thank-you prayer and draw something that made you smile.",
    image: "/kids-sun.svg",
    ref: "Psalm 118:24",
  },
];

export default function KidsPage() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("story");
  const activeStory = useMemo(() => {
    const fallback = stories[0];
    if (!storyId) {
      return fallback;
    }
    return stories.find((item) => item.id === storyId) || fallback;
  }, [storyId]);
  const [translation, setTranslation] = useState("bbe");
  const [passage, setPassage] = useState("");
  const [verses, setVerses] = useState<{ verse: number; text: string }[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadPassage = async () => {
      setStatus("loading");
      setErrorMessage("");
      setPassage("");
      setVerses([]);

      try {
        const response = await fetch(
          `/api/bible?ref=${encodeURIComponent(
            activeStory.ref
          )}&translation=${translation}`,
          { cache: "no-store" }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Unable to load passage.");
        }

        if (!isActive) {
          return;
        }

        if (Array.isArray(data?.verses)) {
          setVerses(
            data.verses.map((item: { verse: number; text: string }) => ({
              verse: item.verse,
              text: item.text,
            }))
          );
          setPassage("");
        } else if (typeof data?.text === "string") {
          setPassage(data.text);
          setVerses([]);
        }
        setStatus("idle");
      } catch (error) {
        if (!isActive) {
          return;
        }
        setStatus("error");
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load passage."
        );
      }
    };

    void loadPassage();

    return () => {
      isActive = false;
    };
  }, [activeStory.ref, translation]);

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
                Today's story
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
                Kids Bible passage
              </p>
              <label className="text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                Translation
                <select
                  value={translation}
                  onChange={(event) => setTranslation(event.target.value)}
                  className="ml-2 rounded-full border border-[#e1d6c6] bg-white px-3 py-1 text-xs font-semibold text-[#2b241d] outline-none"
                >
                  <option value="bbe">Bible in Basic English</option>
                  <option value="web">World English Bible</option>
                  <option value="kjv">King James Version</option>
                  <option value="asv">American Standard Version</option>
                </select>
              </label>
            </div>
            <div className="mt-4 rounded-[22px] border border-[#e7dfd3] bg-white px-4 py-4 text-sm text-[#5a534b]">
              {status === "loading" && <p>Loading passage...</p>}
              {status === "error" && <p>{errorMessage}</p>}
              {status === "idle" && verses.length > 0 && (
                <div className="grid gap-3">
                  {verses.map((item) => (
                    <p key={item.verse}>
                      <span className="mr-2 font-semibold text-[#8b6a3d]">
                        {item.verse}
                      </span>
                      {item.text}
                    </p>
                  ))}
                </div>
              )}
              {status === "idle" && passage && (
                <p className="whitespace-pre-wrap">{passage}</p>
              )}
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
