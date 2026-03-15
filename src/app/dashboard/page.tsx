"use client";

import { useEffect, useMemo, useState } from "react";

const CHAPTERS_KEY = "focus-list.chapters.v1";
const DAILY_GOAL_KEY = "focus-list.daily-goal.v1";

const TOTAL_CHAPTERS = 1189;

const bibleBooks = [
  { name: "Genesis", chapters: 50 }, { name: "Exodus", chapters: 40 },
  { name: "Leviticus", chapters: 27 }, { name: "Numbers", chapters: 36 },
  { name: "Deuteronomy", chapters: 34 }, { name: "Joshua", chapters: 24 },
  { name: "Judges", chapters: 21 }, { name: "Ruth", chapters: 4 },
  { name: "1 Samuel", chapters: 31 }, { name: "2 Samuel", chapters: 24 },
  { name: "1 Kings", chapters: 22 }, { name: "2 Kings", chapters: 25 },
  { name: "1 Chronicles", chapters: 29 }, { name: "2 Chronicles", chapters: 36 },
  { name: "Ezra", chapters: 10 }, { name: "Nehemiah", chapters: 13 },
  { name: "Esther", chapters: 10 }, { name: "Job", chapters: 42 },
  { name: "Psalms", chapters: 150 }, { name: "Proverbs", chapters: 31 },
  { name: "Ecclesiastes", chapters: 12 }, { name: "Song of Solomon", chapters: 8 },
  { name: "Isaiah", chapters: 66 }, { name: "Jeremiah", chapters: 52 },
  { name: "Lamentations", chapters: 5 }, { name: "Ezekiel", chapters: 48 },
  { name: "Daniel", chapters: 12 }, { name: "Hosea", chapters: 14 },
  { name: "Joel", chapters: 3 }, { name: "Amos", chapters: 9 },
  { name: "Obadiah", chapters: 1 }, { name: "Jonah", chapters: 4 },
  { name: "Micah", chapters: 7 }, { name: "Nahum", chapters: 3 },
  { name: "Habakkuk", chapters: 3 }, { name: "Zephaniah", chapters: 3 },
  { name: "Haggai", chapters: 2 }, { name: "Zechariah", chapters: 14 },
  { name: "Malachi", chapters: 4 },
  { name: "Matthew", chapters: 28 }, { name: "Mark", chapters: 16 },
  { name: "Luke", chapters: 24 }, { name: "John", chapters: 21 },
  { name: "Acts", chapters: 28 }, { name: "Romans", chapters: 16 },
  { name: "1 Corinthians", chapters: 16 }, { name: "2 Corinthians", chapters: 13 },
  { name: "Galatians", chapters: 6 }, { name: "Ephesians", chapters: 6 },
  { name: "Philippians", chapters: 4 }, { name: "Colossians", chapters: 4 },
  { name: "1 Thessalonians", chapters: 5 }, { name: "2 Thessalonians", chapters: 3 },
  { name: "1 Timothy", chapters: 6 }, { name: "2 Timothy", chapters: 4 },
  { name: "Titus", chapters: 3 }, { name: "Philemon", chapters: 1 },
  { name: "Hebrews", chapters: 13 }, { name: "James", chapters: 5 },
  { name: "1 Peter", chapters: 5 }, { name: "2 Peter", chapters: 3 },
  { name: "1 John", chapters: 5 }, { name: "2 John", chapters: 1 },
  { name: "3 John", chapters: 1 }, { name: "Jude", chapters: 1 },
  { name: "Revelation", chapters: 22 },
];

type ChapterProgress = Record<string, number[]>;

export default function DashboardPage() {
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>({});
  const [dailyGoal, setDailyGoal] = useState<number>(2);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(CHAPTERS_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as ChapterProgress;
        if (parsed && typeof parsed === "object") {
          setChapterProgress(parsed);
        }
      } catch {
        /* ignore */
      }
    }

    const goal = localStorage.getItem(DAILY_GOAL_KEY);
    if (goal) {
      const n = Number(goal);
      if (Number.isFinite(n) && n > 0) {
        setDailyGoal(Math.min(Math.max(n, 1), 6));
      }
    }

    setLoaded(true);
  }, []);

  const completedChapters = useMemo(() => {
    return bibleBooks.reduce(
      (sum, book) =>
        sum + (Array.isArray(chapterProgress[book.name]) ? chapterProgress[book.name].length : 0),
      0
    );
  }, [chapterProgress]);

  const percent = useMemo(
    () => (TOTAL_CHAPTERS > 0 ? Math.round((completedChapters / TOTAL_CHAPTERS) * 100) : 0),
    [completedChapters]
  );

  const booksStarted = useMemo(() => {
    return bibleBooks.filter(
      (book) =>
        Array.isArray(chapterProgress[book.name]) &&
        chapterProgress[book.name].length > 0
    ).length;
  }, [chapterProgress]);

  const booksFinished = useMemo(() => {
    return bibleBooks.filter(
      (book) =>
        Array.isArray(chapterProgress[book.name]) &&
        chapterProgress[book.name].length === book.chapters
    ).length;
  }, [chapterProgress]);

  const daysToFinish = useMemo(() => {
    const remaining = TOTAL_CHAPTERS - completedChapters;
    if (dailyGoal <= 0) return null;
    return Math.ceil(remaining / dailyGoal);
  }, [completedChapters, dailyGoal]);

  const recentBooks = useMemo(() => {
    return bibleBooks
      .filter(
        (book) =>
          Array.isArray(chapterProgress[book.name]) &&
          chapterProgress[book.name].length > 0
      )
      .slice(-4)
      .reverse();
  }, [chapterProgress]);

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#2b241d]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,246,230,0.95),_transparent_55%)]" />
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#e8d3b0] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-12 h-72 w-72 rounded-full bg-[#cbd7e7] opacity-50 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 md:px-10">

          <header className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#8b6a3d]">
                Halo List
              </p>
              <h1 className="mt-1 text-5xl font-semibold leading-tight text-[#2f3b52] md:text-6xl">
                Your progress
              </h1>
              <p className="mt-3 max-w-xl text-base text-[#5a534b]">
                A snapshot of your Bible-reading journey. Keep going — every chapter counts.
              </p>
            </div>
            <a
              href="/"
              className="mt-1 rounded-full border border-[#cbb89a] bg-white px-5 py-2 text-sm font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
            >
              Open reader
            </a>
          </header>

          {/* Stats row */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Chapters read",
                value: loaded ? String(completedChapters) : "—",
                sub: `of ${TOTAL_CHAPTERS} total`,
              },
              {
                label: "Completion",
                value: loaded ? `${percent}%` : "—",
                sub: "of the whole Bible",
              },
              {
                label: "Books started",
                value: loaded ? String(booksStarted) : "—",
                sub: "of 66 books",
              },
              {
                label: "Books finished",
                value: loaded ? String(booksFinished) : "—",
                sub: "fully completed",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-[24px] bg-white/90 p-5 shadow-[0_20px_60px_rgba(62,54,41,0.12)]"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                  {stat.label}
                </p>
                <p className="mt-2 text-4xl font-semibold text-[#2f3b52]">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-[#7a6b5a]">{stat.sub}</p>
              </div>
            ))}
          </section>

          {/* Progress bar */}
          <section className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                Overall progress
              </p>
              <span className="text-xs font-semibold text-[#8b6a3d]">
                {loaded ? `${percent}%` : "—"}
              </span>
            </div>
            <div className="mt-3 h-3 w-full rounded-full bg-[#e7dfd3]">
              <div
                className="h-3 rounded-full bg-[#b4894f] transition-all duration-700"
                style={{ width: loaded ? `${percent}%` : "0%" }}
              />
            </div>
            <p className="mt-2 text-xs text-[#7a6b5a]">
              {loaded
                ? `${completedChapters} chapters read · ${TOTAL_CHAPTERS - completedChapters} remaining`
                : "Loading progress..."}
            </p>

            {loaded && daysToFinish !== null && (
              <p className="mt-3 rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-4 py-3 text-sm text-[#5a534b]">
                At <strong>{dailyGoal} chapter{dailyGoal !== 1 ? "s" : ""}</strong> per day, you could finish the Bible in{" "}
                <strong>
                  {daysToFinish >= 365
                    ? `about ${Math.round(daysToFinish / 365)} year${Math.round(daysToFinish / 365) !== 1 ? "s" : ""}`
                    : `${daysToFinish} day${daysToFinish !== 1 ? "s" : ""}`}
                </strong>
                .
              </p>
            )}
          </section>

          {/* Recent books */}
          {loaded && recentBooks.length > 0 && (
            <section className="rounded-[28px] bg-white/90 p-6 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                Recently reading
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {recentBooks.map((book) => {
                  const done = chapterProgress[book.name]?.length ?? 0;
                  const pct = Math.round((done / book.chapters) * 100);
                  return (
                    <a
                      key={book.name}
                      href="/"
                      className="rounded-[20px] border border-[#e7dfd3] bg-[#f7f1e7] p-4 transition hover:border-[#b4894f] hover:shadow-[0_8px_24px_rgba(62,54,41,0.12)]"
                    >
                      <p className="text-sm font-semibold text-[#2b241d]">{book.name}</p>
                      <p className="text-xs text-[#7a6b5a]">
                        {done} / {book.chapters} chapters
                      </p>
                      <div className="mt-2 h-1.5 w-full rounded-full bg-[#e1d6c6]">
                        <div
                          className="h-1.5 rounded-full bg-[#b4894f]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* Quick nav */}
          <section className="grid gap-4 sm:grid-cols-2">
            <a
              href="/"
              className="group rounded-[28px] bg-[#2f3b52] p-6 text-white shadow-[0_20px_60px_rgba(47,59,82,0.25)] transition hover:bg-[#3b4a63]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#a8bbd4]">
                Bible reader
              </p>
              <h2 className="mt-2 text-xl font-semibold">Open Halo List</h2>
              <p className="mt-1 text-sm text-[#a8bbd4]">
                All 66 books, chapter by chapter. Pick up where you left off.
              </p>
            </a>
            <a
              href="/kids"
              className="group rounded-[28px] bg-gradient-to-br from-[#fff4dd] via-[#f7f7ff] to-[#e9f8f1] p-6 shadow-[0_20px_60px_rgba(62,54,41,0.12)] transition hover:shadow-[0_28px_70px_rgba(62,54,41,0.18)]"
            >
              <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
                Kids Bible corner
              </p>
              <h2 className="mt-2 text-xl font-semibold text-[#2b241d]">
                Stories for little ones
              </h2>
              <p className="mt-1 text-sm text-[#5a534b]">
                Short stories, memory verses, and family activities.
              </p>
            </a>
          </section>

          <footer className="text-center text-xs text-[#a8977e]">
            Halo List · Progress saves locally in your browser
          </footer>
        </div>
      </div>
    </div>
  );
}
