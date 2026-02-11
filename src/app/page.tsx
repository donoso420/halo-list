"use client";

import { useEffect, useMemo, useState } from "react";

type BibleBook = {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
};

type ChapterProgress = Record<string, number[]>;

type TranslationOption = {
  id: string;
  label: string;
  disabled?: boolean;
};

type Verse = {
  verse: number;
  text: string;
};

type ChapterCacheEntry = {
  status: "idle" | "loading" | "success" | "error";
  verses?: Verse[];
  text?: string;
  reference?: string;
  copyright?: string;
  error?: string;
};

type PlanItem = {
  book: string;
  chapter: number;
};

const parseVersesFromText = (text: string): Verse[] => {
  const cleaned = text.replace(/\r/g, "").trim();
  if (!cleaned) {
    return [];
  }

  const matches = [...cleaned.matchAll(/(^|\n)\s*(\d+)\s+/g)];
  if (matches.length === 0) {
    return [];
  }

  const verses: Verse[] = [];
  for (let i = 0; i < matches.length; i += 1) {
    const match = matches[i];
    const next = matches[i + 1];
    const verseNumber = Number(match[2]);
    const start = (match.index ?? 0) + match[0].length;
    const end = next?.index ?? cleaned.length;
    const verseText = cleaned
      .slice(start, end)
      .replace(/\s+/g, " ")
      .trim();

    if (verseText) {
      verses.push({ verse: verseNumber, text: verseText });
    }
  }

  return verses;
};

const pickPreferredVoice = (list: SpeechSynthesisVoice[]) => {
  if (list.length === 0) {
    return undefined;
  }

  const preferred = [
    "Samantha",
    "Ava",
    "Karen",
    "Moira",
    "Google US English",
    "Google UK English Female",
    "Microsoft Zira",
  ];

  for (const name of preferred) {
    const match = list.find((voice) =>
      voice.name.toLowerCase().includes(name.toLowerCase())
    );
    if (match) {
      return match;
    }
  }

  return list.find((voice) => voice.lang.startsWith("en")) || list[0];
};

const CHAPTERS_KEY = "focus-list.chapters.v1";
const DAILY_GOAL_KEY = "focus-list.daily-goal.v1";

const translations: TranslationOption[] = [
  { id: "kjv", label: "King James Version (KJV)" },
  { id: "esv", label: "English Standard Version (ESV)" },
  { id: "asv", label: "American Standard Version (ASV)" },
  { id: "web", label: "World English Bible (WEB)" },
  { id: "bbe", label: "Bible in Basic English (BBE)" },
];

const bibleBooks: BibleBook[] = [
  { name: "Genesis", chapters: 50, testament: "OT" },
  { name: "Exodus", chapters: 40, testament: "OT" },
  { name: "Leviticus", chapters: 27, testament: "OT" },
  { name: "Numbers", chapters: 36, testament: "OT" },
  { name: "Deuteronomy", chapters: 34, testament: "OT" },
  { name: "Joshua", chapters: 24, testament: "OT" },
  { name: "Judges", chapters: 21, testament: "OT" },
  { name: "Ruth", chapters: 4, testament: "OT" },
  { name: "1 Samuel", chapters: 31, testament: "OT" },
  { name: "2 Samuel", chapters: 24, testament: "OT" },
  { name: "1 Kings", chapters: 22, testament: "OT" },
  { name: "2 Kings", chapters: 25, testament: "OT" },
  { name: "1 Chronicles", chapters: 29, testament: "OT" },
  { name: "2 Chronicles", chapters: 36, testament: "OT" },
  { name: "Ezra", chapters: 10, testament: "OT" },
  { name: "Nehemiah", chapters: 13, testament: "OT" },
  { name: "Esther", chapters: 10, testament: "OT" },
  { name: "Job", chapters: 42, testament: "OT" },
  { name: "Psalms", chapters: 150, testament: "OT" },
  { name: "Proverbs", chapters: 31, testament: "OT" },
  { name: "Ecclesiastes", chapters: 12, testament: "OT" },
  { name: "Song of Solomon", chapters: 8, testament: "OT" },
  { name: "Isaiah", chapters: 66, testament: "OT" },
  { name: "Jeremiah", chapters: 52, testament: "OT" },
  { name: "Lamentations", chapters: 5, testament: "OT" },
  { name: "Ezekiel", chapters: 48, testament: "OT" },
  { name: "Daniel", chapters: 12, testament: "OT" },
  { name: "Hosea", chapters: 14, testament: "OT" },
  { name: "Joel", chapters: 3, testament: "OT" },
  { name: "Amos", chapters: 9, testament: "OT" },
  { name: "Obadiah", chapters: 1, testament: "OT" },
  { name: "Jonah", chapters: 4, testament: "OT" },
  { name: "Micah", chapters: 7, testament: "OT" },
  { name: "Nahum", chapters: 3, testament: "OT" },
  { name: "Habakkuk", chapters: 3, testament: "OT" },
  { name: "Zephaniah", chapters: 3, testament: "OT" },
  { name: "Haggai", chapters: 2, testament: "OT" },
  { name: "Zechariah", chapters: 14, testament: "OT" },
  { name: "Malachi", chapters: 4, testament: "OT" },
  { name: "Matthew", chapters: 28, testament: "NT" },
  { name: "Mark", chapters: 16, testament: "NT" },
  { name: "Luke", chapters: 24, testament: "NT" },
  { name: "John", chapters: 21, testament: "NT" },
  { name: "Acts", chapters: 28, testament: "NT" },
  { name: "Romans", chapters: 16, testament: "NT" },
  { name: "1 Corinthians", chapters: 16, testament: "NT" },
  { name: "2 Corinthians", chapters: 13, testament: "NT" },
  { name: "Galatians", chapters: 6, testament: "NT" },
  { name: "Ephesians", chapters: 6, testament: "NT" },
  { name: "Philippians", chapters: 4, testament: "NT" },
  { name: "Colossians", chapters: 4, testament: "NT" },
  { name: "1 Thessalonians", chapters: 5, testament: "NT" },
  { name: "2 Thessalonians", chapters: 3, testament: "NT" },
  { name: "1 Timothy", chapters: 6, testament: "NT" },
  { name: "2 Timothy", chapters: 4, testament: "NT" },
  { name: "Titus", chapters: 3, testament: "NT" },
  { name: "Philemon", chapters: 1, testament: "NT" },
  { name: "Hebrews", chapters: 13, testament: "NT" },
  { name: "James", chapters: 5, testament: "NT" },
  { name: "1 Peter", chapters: 5, testament: "NT" },
  { name: "2 Peter", chapters: 3, testament: "NT" },
  { name: "1 John", chapters: 5, testament: "NT" },
  { name: "2 John", chapters: 1, testament: "NT" },
  { name: "3 John", chapters: 1, testament: "NT" },
  { name: "Jude", chapters: 1, testament: "NT" },
  { name: "Revelation", chapters: 22, testament: "NT" },
];

export default function Home() {
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>({});
  const [translation, setTranslation] = useState<string>("kjv");
  const [dailyGoal, setDailyGoal] = useState<number>(2);
  const [selectedChapter, setSelectedChapter] = useState<{
    book: string;
    chapter: number;
  } | null>(null);
  const [chapterCache, setChapterCache] = useState<
    Record<string, ChapterCacheEntry>
  >({});
  const [openBook, setOpenBook] = useState<string | null>(null);
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bookQuery, setBookQuery] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(CHAPTERS_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as ChapterProgress;
      if (parsed && typeof parsed === "object") {
        setChapterProgress(parsed);
      }
    } catch {
      localStorage.removeItem(CHAPTERS_KEY);
    }
  }, []);

  useEffect(() => {
    const raw = localStorage.getItem(DAILY_GOAL_KEY);
    if (!raw) {
      return;
    }
    const parsed = Number(raw);
    if (Number.isFinite(parsed) && parsed > 0) {
      setDailyGoal(Math.min(Math.max(parsed, 1), 6));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  useEffect(() => {
    localStorage.setItem(DAILY_GOAL_KEY, String(dailyGoal));
  }, [dailyGoal]);

  const chapterNumbers = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const book of bibleBooks) {
      map[book.name] = Array.from({ length: book.chapters }, (_, i) => i + 1);
    }
    return map;
  }, []);

  const chapterOrder = useMemo<PlanItem[]>(() => {
    const list: PlanItem[] = [];
    for (const book of bibleBooks) {
      for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
        list.push({ book: book.name, chapter });
      }
    }
    return list;
  }, []);

  const oldTestament = useMemo(
    () => bibleBooks.filter((book) => book.testament === "OT"),
    []
  );

  const newTestament = useMemo(
    () => bibleBooks.filter((book) => book.testament === "NT"),
    []
  );

  const chapterSets = useMemo(() => {
    const map: Record<string, Set<number>> = {};
    for (const book of bibleBooks) {
      const stored = chapterProgress[book.name];
      map[book.name] = new Set(Array.isArray(stored) ? stored : []);
    }
    return map;
  }, [chapterProgress]);

  const chapterStats = useMemo(() => {
    const total = bibleBooks.reduce((sum, book) => sum + book.chapters, 0);
    const completed = bibleBooks.reduce(
      (sum, book) => sum + (chapterSets[book.name]?.size ?? 0),
      0
    );
    return { total, completed };
  }, [chapterSets]);

  const chapterPercent = useMemo(() => {
    if (!chapterStats.total) {
      return 0;
    }
    return Math.round((chapterStats.completed / chapterStats.total) * 100);
  }, [chapterStats]);

  const unreadChapters = useMemo(() => {
    return chapterOrder.filter(
      (item) => !chapterSets[item.book]?.has(item.chapter)
    );
  }, [chapterOrder, chapterSets]);

  const planGoal = Math.max(1, Math.min(dailyGoal, 6));

  const planChapters = useMemo(
    () => unreadChapters.slice(0, planGoal),
    [unreadChapters, planGoal]
  );

  const normalizedQuery = bookQuery.trim().toLowerCase();
  const filteredOldTestament = useMemo(() => {
    if (!normalizedQuery) {
      return oldTestament;
    }
    return oldTestament.filter((book) =>
      book.name.toLowerCase().includes(normalizedQuery)
    );
  }, [oldTestament, normalizedQuery]);

  const filteredNewTestament = useMemo(() => {
    if (!normalizedQuery) {
      return newTestament;
    }
    return newTestament.filter((book) =>
      book.name.toLowerCase().includes(normalizedQuery)
    );
  }, [newTestament, normalizedQuery]);

  const selectedKey = useMemo(() => {
    if (!selectedChapter) {
      return null;
    }
    return `${translation}:${selectedChapter.book}:${selectedChapter.chapter}`;
  }, [selectedChapter, translation]);

  const selectedEntry = useMemo(() => {
    if (!selectedKey) {
      return undefined;
    }
    return chapterCache[selectedKey];
  }, [chapterCache, selectedKey]);

  const displayedVerses = useMemo(() => {
    if (selectedEntry?.verses && selectedEntry.verses.length > 0) {
      return selectedEntry.verses;
    }
    if (selectedEntry?.text) {
      const parsed = parseVersesFromText(selectedEntry.text);
      if (parsed.length > 0) {
        return parsed;
      }
    }
    return [];
  }, [selectedEntry]);

  const hasSelectedText = Boolean(
    selectedEntry?.text && selectedEntry.text.trim().length > 0
  );
  const hasDisplayedVerses = displayedVerses.length > 0;

  const canSpeak =
    selectedEntry?.status === "success" &&
    (hasSelectedText || hasDisplayedVerses);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
      setTtsSupported(false);
      return;
    }

    setTtsSupported(true);

    const loadVoices = () => {
      const list = synth.getVoices();
      setVoices(list);
      const preferred = pickPreferredVoice(list);
      setSelectedVoice((prev) => prev || preferred?.voiceURI || "");
    };

    loadVoices();
    synth.onvoiceschanged = loadVoices;

    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const synth = window.speechSynthesis;
    if (synth?.speaking || synth?.paused) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  }, [selectedKey, translation]);

  useEffect(() => {
    if (!selectedChapter || !selectedKey) {
      return;
    }

    if (selectedEntry?.status === "loading" || selectedEntry?.status === "success") {
      return;
    }

    const loadChapter = async () => {
      setChapterCache((prev) => ({
        ...prev,
        [selectedKey]: {
          status: "loading",
        },
      }));

      const ref = `${selectedChapter.book} ${selectedChapter.chapter}`;
      const url = `/api/bible?ref=${encodeURIComponent(ref)}&translation=${translation}`;

      try {
        const response = await fetch(url);
        const data = (await response.json()) as {
          verses?: Verse[];
          reference?: string;
          text?: string;
          copyright?: string;
          error?: string;
        };

        if (!response.ok || data.error) {
          throw new Error(data.error || "Unable to load this chapter.");
        }

        const verses = Array.isArray(data.verses)
          ? data.verses.map((verse) => ({
              verse: verse.verse,
              text: String(verse.text || "").trim(),
            }))
          : undefined;

        const text =
          typeof data.text === "string" && data.text.trim().length > 0
            ? data.text.trim()
            : undefined;

        setChapterCache((prev) => ({
          ...prev,
          [selectedKey]: {
            status: "success",
            verses,
            text,
            reference:
              data.reference || `${selectedChapter.book} ${selectedChapter.chapter}`,
            copyright: data.copyright,
          },
        }));
      } catch (error) {
        setChapterCache((prev) => ({
          ...prev,
          [selectedKey]: {
            status: "error",
            error:
              error instanceof Error
                ? error.message
                : "Unable to load this chapter.",
          },
        }));
      }
    };

    loadChapter();
  }, [selectedChapter, selectedKey, translation]);

  const openChapter = (book: string, chapter: number) => {
    setSelectedChapter({ book, chapter });
    setOpenBook(book);
  };

  const toggleChapter = (bookName: string, chapter: number) => {
    setChapterProgress((prev) => {
      const current = Array.isArray(prev[bookName]) ? prev[bookName] : [];
      const set = new Set(current);
      if (set.has(chapter)) {
        set.delete(chapter);
      } else {
        set.add(chapter);
      }
      return {
        ...prev,
        [bookName]: Array.from(set).sort((a, b) => a - b),
      };
    });
  };

  const markPlanRead = () => {
    if (planChapters.length === 0) {
      return;
    }
    setChapterProgress((prev) => {
      const next: ChapterProgress = { ...prev };
      for (const item of planChapters) {
        const current = Array.isArray(next[item.book]) ? next[item.book] : [];
        const set = new Set(current);
        set.add(item.chapter);
        next[item.book] = Array.from(set).sort((a, b) => a - b);
      }
      return next;
    });
  };

  const startSpeech = () => {
    if (!canSpeak || !selectedEntry) {
      return;
    }
    if (typeof window === "undefined") {
      return;
    }

    const synth = window.speechSynthesis;
    if (!synth) {
      return;
    }

    synth.cancel();

    const text = hasDisplayedVerses
      ? displayedVerses
          .map((verse) => verse.text.replace(/\s+/g, " ").trim())
          .join(" ")
      : selectedEntry.text?.replace(/\s+/g, " ").trim() || "";

    if (!text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find((item) => item.voiceURI === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = speechRate;
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    setIsSpeaking(true);
    setIsPaused(false);
    synth.speak(utterance);
  };

  const pauseSpeech = () => {
    if (typeof window === "undefined") {
      return;
    }
    const synth = window.speechSynthesis;
    if (synth?.speaking && !synth.paused) {
      synth.pause();
      setIsPaused(true);
    }
  };

  const resumeSpeech = () => {
    if (typeof window === "undefined") {
      return;
    }
    const synth = window.speechSynthesis;
    if (synth?.paused) {
      synth.resume();
      setIsPaused(false);
    }
  };

  const stopSpeech = () => {
    if (typeof window === "undefined") {
      return;
    }
    const synth = window.speechSynthesis;
    if (synth?.speaking || synth?.paused) {
      synth.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#2b241d]">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,246,230,0.95),_transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,_rgba(255,255,255,0.55),_transparent_65%)] opacity-70" />
        <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full bg-[#e8d3b0] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute right-8 top-12 h-72 w-72 rounded-full bg-[#cbd7e7] opacity-50 blur-3xl" />
        <div className="pointer-events-none absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-[#f0e1c8] opacity-40 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 md:px-10">
          <header className="flex flex-col gap-4">
            <h1 className="text-6xl font-semibold leading-tight text-[#2f3b52] md:text-7xl">
              Halo List
            </h1>
            <p className="max-w-2xl text-xs uppercase tracking-[0.45em] text-[#8b6a3d] md:text-sm">
              Read gently. Finish faithfully.
            </p>
            <p className="max-w-2xl text-base text-[#5a534b] md:text-lg">
              A calm, dedicated space for your Bible-reading plan. Everything
              saves locally in your browser.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[28px] bg-white/90 p-5 shadow-[0_20px_60px_rgba(62,54,41,0.12)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                Reading plan
              </p>
              <div className="mt-3 grid gap-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2b241d]">
                      Chapters per day
                    </p>
                    <p className="text-xs text-[#7a6b5a]">
                      Keep it gentle and steady.
                    </p>
                  </div>
                  <select
                    value={planGoal}
                    onChange={(event) =>
                      setDailyGoal(Number(event.target.value))
                    }
                    className="rounded-xl border border-[#e1d6c6] bg-white px-3 py-2 text-xs font-semibold text-[#2b241d] outline-none transition focus:border-[#b4894f] focus:ring-2 focus:ring-[#eadcc8]"
                  >
                    {[1, 2, 3, 4, 5, 6].map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-4 py-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                    <span>Next up</span>
                    <span>{unreadChapters.length} left</span>
                  </div>
                  {planChapters.length === 0 ? (
                    <p className="mt-3 text-sm text-[#7a6b5a]">
                      Every chapter is complete. Well done.
                    </p>
                  ) : (
                    <>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {planChapters.map((item) => (
                          <button
                            key={`${item.book}-${item.chapter}`}
                            type="button"
                            onClick={() => openChapter(item.book, item.chapter)}
                            className="rounded-full border border-[#cbb89a] bg-white px-3 py-1 text-xs font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
                          >
                            {item.book} {item.chapter}
                          </button>
                        ))}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            openChapter(
                              planChapters[0].book,
                              planChapters[0].chapter
                            )
                          }
                          className="rounded-full border border-transparent bg-[#2f3b52] px-3 py-1 text-xs font-semibold text-white transition hover:bg-[#3b4a63]"
                        >
                          Open first
                        </button>
                        <button
                          type="button"
                          onClick={markPlanRead}
                          className="rounded-full border border-[#cbb89a] bg-white px-3 py-1 text-xs font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
                        >
                          Mark plan read
                        </button>
                      </div>
                      <p className="mt-3 text-xs text-[#7a6b5a]">
                        Open a chapter and press Play to listen as you read.
                      </p>
                    </>
                  )}
                </div>

                <div className="rounded-2xl border border-dashed border-[#e1d6c6] bg-white/90 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b6a3d]">
                    Gentle path
                  </p>
                  <ul className="mt-2 grid gap-2 text-xs text-[#5a534b]">
                    <li>Start with a Gospel (Mark or John).</li>
                    <li>Read Acts next to see the early church.</li>
                    <li>Add a Psalm or Proverb for prayer.</li>
                    <li>Move to Genesis and Exodus for the story arc.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="rounded-[28px] bg-white/90 p-5 shadow-[0_20px_60px_rgba(62,54,41,0.12)] backdrop-blur">
              <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                Preferences
              </p>
              <div className="mt-3 grid gap-3">
                <div>
                  <label className="text-xs text-[#7a6b5a]">
                    Translation
                  </label>
                  <select
                    value={translation}
                    onChange={(event) => setTranslation(event.target.value)}
                    className="mt-2 w-full rounded-xl border border-[#e1d6c6] bg-white px-3 py-2 text-sm font-medium text-[#2b241d] outline-none transition focus:border-[#b4894f] focus:ring-2 focus:ring-[#eadcc8]"
                  >
                    {translations.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-[#7a6b5a]">
                    ESV requires a server API key. If it is not set, you will
                    see an error message.
                  </p>
                </div>
                <div className="rounded-2xl border border-[#e7dfd3] bg-[#f7f1e7] px-4 py-3">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                    <span>Progress</span>
                    <span>{chapterPercent}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full rounded-full bg-[#e7dfd3]">
                    <div
                      className="h-2 rounded-full bg-[#b4894f]"
                      style={{ width: `${chapterPercent}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[#7a6b5a]">
                    {chapterStats.completed} / {chapterStats.total} chapters
                    complete
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[36px] border border-[#e7d8c0] bg-gradient-to-br from-[#fff4dd] via-[#f7f7ff] to-[#e9f8f1] p-6 shadow-[0_30px_90px_rgba(62,54,41,0.18)] backdrop-blur">
            <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
                  Kids Bible corner
                </p>
                <h2 className="text-2xl font-semibold text-[#2b241d] md:text-3xl">
                  Simple stories, big love.
                </h2>
                <p className="text-sm text-[#5a534b] md:text-base">
                  A friendly space for little hearts with short stories,
                  memory verses, and activities the whole family can do
                  together.
                </p>
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-[#7a5b2b]">
                  <span className="rounded-full bg-white/80 px-3 py-1">
                    Faith based
                  </span>
                  <span className="rounded-full bg-white/80 px-3 py-1">
                    Printable
                  </span>
                  <span className="rounded-full bg-white/80 px-3 py-1">
                    Family friendly
                  </span>
                </div>
              </div>
              <div className="rounded-[24px] bg-white/90 p-4 shadow-[0_20px_60px_rgba(62,54,41,0.12)]">
                <img
                  src="/kids-rainbow.svg"
                  alt="Rainbow and stars illustration"
                  className="h-40 w-full rounded-2xl bg-white object-contain p-2"
                />
                <div className="mt-3 space-y-1">
                  <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                    Story of the week
                  </p>
                  <p className="text-sm font-semibold text-[#2b241d]">
                    David &amp; Goliath
                  </p>
                  <p className="text-xs text-[#7a6b5a]">
                    Courage with God on your side.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <a
                href="/kids?story=noah"
                className="rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)]"
              >
                <img
                  src="/kids-ark.svg"
                  alt="Boat on waves illustration"
                  className="h-28 w-full rounded-2xl bg-white object-contain p-2"
                />
                <p className="mt-3 text-sm font-semibold text-[#2b241d]">
                  Noah’s Ark
                </p>
                <p className="text-xs text-[#7a6b5a]">
                  God keeps His promises.
                </p>
              </a>
              <a
                href="/kids?story=shepherd"
                className="rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)]"
              >
                <img
                  src="/kids-shepherd.svg"
                  alt="Shepherd staff illustration"
                  className="h-28 w-full rounded-2xl bg-white object-contain p-2"
                />
                <p className="mt-3 text-sm font-semibold text-[#2b241d]">
                  The Good Shepherd
                </p>
                <p className="text-xs text-[#7a6b5a]">
                  Jesus cares for every child.
                </p>
              </a>
              <a
                href="/kids?story=memory"
                className="rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)]"
              >
                <img
                  src="/kids-book.svg"
                  alt="Open book illustration"
                  className="h-28 w-full rounded-2xl bg-white object-contain p-2"
                />
                <p className="mt-3 text-sm font-semibold text-[#2b241d]">
                  Memory Verse
                </p>
                <p className="text-xs text-[#7a6b5a]">
                  “Be kind and compassionate.” Ephesians 4:32
                </p>
              </a>
              <a
                href="/kids?story=activity"
                className="rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)]"
              >
                <img
                  src="/kids-sun.svg"
                  alt="Smiling sun illustration"
                  className="h-28 w-full rounded-2xl bg-white object-contain p-2"
                />
                <p className="mt-3 text-sm font-semibold text-[#2b241d]">
                  Activity Time
                </p>
                <p className="text-xs text-[#7a6b5a]">
                  Coloring pages, puzzles, and prayers.
                </p>
              </a>
            </div>
          </section>

          <section className="rounded-[36px] bg-white/85 p-6 shadow-[0_30px_90px_rgba(62,54,41,0.18)] backdrop-blur">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="font-mono text-xs uppercase tracking-[0.35em] text-[#8b6a3d]">
                  Bible checklist
                </p>
                <h2 className="text-2xl font-semibold text-[#2b241d]">
                  All 66 books, chapter by chapter
                </h2>
                <p className="text-sm text-[#5a534b]">
                  Tap a chapter to open it, then mark it read.
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:max-w-sm">
                <label className="text-xs uppercase tracking-[0.2em] text-[#8b6a3d]">
                  Search books
                </label>
                <div className="flex items-center gap-2">
                  <input
                    value={bookQuery}
                    onChange={(event) => setBookQuery(event.target.value)}
                    placeholder="Type a book name..."
                    className="h-10 w-full rounded-xl border border-[#e1d6c6] bg-white px-3 text-sm text-[#2b241d] outline-none transition focus:border-[#b4894f] focus:ring-2 focus:ring-[#eadcc8]"
                  />
                  {bookQuery ? (
                    <button
                      type="button"
                      onClick={() => setBookQuery("")}
                      className="rounded-xl border border-[#e1d6c6] px-3 py-2 text-xs font-semibold text-[#7a6b5a] transition hover:border-[#b4894f] hover:text-[#2b241d]"
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                  Old Testament
                </p>
                {filteredOldTestament.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#e1d6c6] bg-white/90 px-4 py-3 text-sm text-[#7a6b5a]">
                    No Old Testament books match your search.
                  </p>
                ) : null}
                {filteredOldTestament.map((book) => {
                  const completed = chapterSets[book.name]?.size ?? 0;
                  return (
                    <details
                      key={book.name}
                      open={openBook === book.name}
                      onToggle={(event) => {
                        const isOpen = event.currentTarget.open;
                        setOpenBook(isOpen ? book.name : null);
                        if (!isOpen && selectedChapter?.book === book.name) {
                          setSelectedChapter(null);
                        }
                      }}
                      className="rounded-2xl border border-[#e7ddcd] bg-white/95 px-4 py-3 shadow-sm"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#2b241d]">
                            {book.name}
                          </span>
                          <span className="text-xs text-[#8b6a3d]">
                            {completed}/{book.chapters}
                          </span>
                        </div>
                      </summary>
                      <div className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
                        {chapterNumbers[book.name].map((chapter) => {
                          const checked =
                            chapterSets[book.name]?.has(chapter) ?? false;
                          const isSelected =
                            selectedChapter?.book === book.name &&
                            selectedChapter.chapter === chapter;
                          return (
                            <button
                              key={`${book.name}-${chapter}`}
                              type="button"
                              onClick={() => openChapter(book.name, chapter)}
                              className={`flex items-center justify-center rounded-full border px-2 py-1 text-[10px] font-semibold transition ${
                                checked
                                  ? "border-[#b4894f] bg-[#f4ead8] text-[#2b241d]"
                                  : "border-[#e1d6c6] bg-white text-[#7a6b5a] hover:border-[#cdbd9f]"
                              } ${isSelected ? "ring-2 ring-[#b4894f]" : ""}`}
                            >
                              {chapter}
                            </button>
                          );
                        })}
                      </div>
                      {selectedChapter?.book === book.name ? (
                        <div className="mt-4 rounded-2xl border border-[#e1d6c6] bg-[#f7f1e7] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#2b241d]">
                                {selectedEntry?.reference ||
                                  `${book.name} ${selectedChapter.chapter}`}
                              </p>
                              <p className="text-xs text-[#7a6b5a]">
                                {translations.find(
                                  (option) => option.id === translation
                                )?.label || translation.toUpperCase()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleChapter(
                                    book.name,
                                    selectedChapter.chapter
                                  )
                                }
                                className="rounded-full border border-[#cbb89a] bg-white px-3 py-1 font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
                              >
                                {chapterSets[book.name]?.has(
                                  selectedChapter.chapter
                                )
                                  ? "Mark unread"
                                  : "Mark read"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedChapter(null)}
                                className="rounded-full border border-transparent px-3 py-1 font-semibold text-[#7a6b5a] transition hover:text-[#2b241d]"
                              >
                                Close
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-[#2b241d]">
                            {selectedEntry?.status === "loading" ||
                            !selectedEntry ? (
                              <p className="text-sm text-[#7a6b5a]">
                                Loading chapter...
                              </p>
                            ) : null}
                            {selectedEntry?.status === "error" ? (
                              <p className="text-sm text-[#8b6a3d]">
                                {selectedEntry.error}
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            hasDisplayedVerses ? (
                              <div className="space-y-2">
                                {displayedVerses.map((verse) => (
                                  <div
                                    key={`${verse.verse}-${verse.text}`}
                                    className="grid grid-cols-[28px_1fr] gap-3 rounded-xl border border-[#e7dfd3] bg-white/80 px-3 py-2"
                                  >
                                    <span className="text-[10px] font-mono text-[#8b6a3d]">
                                      {verse.verse}
                                    </span>
                                    <p className="text-sm leading-relaxed text-[#2b241d]">
                                      {verse.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            !hasDisplayedVerses &&
                            hasSelectedText ? (
                              <p className="whitespace-pre-line text-sm text-[#2b241d]">
                                {selectedEntry.text}
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            !hasDisplayedVerses &&
                            !hasSelectedText ? (
                              <p className="text-sm text-[#7a6b5a]">
                                No text returned for this chapter.
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            selectedEntry?.copyright ? (
                              <p className="text-[11px] text-[#7a6b5a]">
                                {selectedEntry.copyright}
                              </p>
                            ) : null}
                          </div>

                        <div className="mt-4 rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b6a3d]">
                              Listen
                            </p>
                            {!ttsSupported ? (
                              <span className="text-xs text-[#7a6b5a]">
                                Not supported
                              </span>
                            ) : null}
                          </div>
                          {!ttsSupported ? null : (
                            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
                              <div className="flex items-end gap-2">
                                {!isSpeaking ? (
                                  <button
                                    type="button"
                                    onClick={startSpeech}
                                    disabled={!canSpeak}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Play
                                  </button>
                                ) : isPaused ? (
                                  <button
                                    type="button"
                                    onClick={resumeSpeech}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63]"
                                  >
                                    Resume
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={pauseSpeech}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63]"
                                  >
                                    Pause
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={stopSpeech}
                                  disabled={!isSpeaking && !isPaused}
                                  className="rounded-xl border border-[#e1d6c6] px-3 py-2 text-xs font-semibold text-[#7a6b5a] transition hover:border-[#b4894f] hover:text-[#2b241d] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Stop
                                </button>
                              </div>
                              <div>
                                <label className="text-xs text-[#7a6b5a]">
                                  Speed
                                </label>
                                <div className="mt-2 flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0.7"
                                    max="1.4"
                                    step="0.05"
                                    value={speechRate}
                                    onChange={(event) =>
                                      setSpeechRate(Number(event.target.value))
                                    }
                                    className="w-full accent-[#b4894f]"
                                  />
                                  <span className="text-xs text-[#7a6b5a]">
                                    {speechRate.toFixed(2)}x
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        </div>
                      ) : null}
                    </details>
                  );
                })}
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                  New Testament
                </p>
                {filteredNewTestament.length === 0 ? (
                  <p className="rounded-2xl border border-dashed border-[#e1d6c6] bg-white/90 px-4 py-3 text-sm text-[#7a6b5a]">
                    No New Testament books match your search.
                  </p>
                ) : null}
                {filteredNewTestament.map((book) => {
                  const completed = chapterSets[book.name]?.size ?? 0;
                  return (
                    <details
                      key={book.name}
                      open={openBook === book.name}
                      onToggle={(event) => {
                        const isOpen = event.currentTarget.open;
                        setOpenBook(isOpen ? book.name : null);
                        if (!isOpen && selectedChapter?.book === book.name) {
                          setSelectedChapter(null);
                        }
                      }}
                      className="rounded-2xl border border-[#e7ddcd] bg-white/95 px-4 py-3 shadow-sm"
                    >
                      <summary className="cursor-pointer list-none">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-[#2b241d]">
                            {book.name}
                          </span>
                          <span className="text-xs text-[#8b6a3d]">
                            {completed}/{book.chapters}
                          </span>
                        </div>
                      </summary>
                      <div className="mt-3 grid grid-cols-8 gap-2 sm:grid-cols-10 md:grid-cols-12">
                        {chapterNumbers[book.name].map((chapter) => {
                          const checked =
                            chapterSets[book.name]?.has(chapter) ?? false;
                          const isSelected =
                            selectedChapter?.book === book.name &&
                            selectedChapter.chapter === chapter;
                          return (
                            <button
                              key={`${book.name}-${chapter}`}
                              type="button"
                              onClick={() => openChapter(book.name, chapter)}
                              className={`flex items-center justify-center rounded-full border px-2 py-1 text-[10px] font-semibold transition ${
                                checked
                                  ? "border-[#b4894f] bg-[#f4ead8] text-[#2b241d]"
                                  : "border-[#e1d6c6] bg-white text-[#7a6b5a] hover:border-[#cdbd9f]"
                              } ${isSelected ? "ring-2 ring-[#b4894f]" : ""}`}
                            >
                              {chapter}
                            </button>
                          );
                        })}
                      </div>
                      {selectedChapter?.book === book.name ? (
                        <div className="mt-4 rounded-2xl border border-[#e1d6c6] bg-[#f7f1e7] p-4">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#2b241d]">
                                {selectedEntry?.reference ||
                                  `${book.name} ${selectedChapter.chapter}`}
                              </p>
                              <p className="text-xs text-[#7a6b5a]">
                                {translations.find(
                                  (option) => option.id === translation
                                )?.label || translation.toUpperCase()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                              <button
                                type="button"
                                onClick={() =>
                                  toggleChapter(
                                    book.name,
                                    selectedChapter.chapter
                                  )
                                }
                                className="rounded-full border border-[#cbb89a] bg-white px-3 py-1 font-semibold text-[#2b241d] transition hover:border-[#b4894f]"
                              >
                                {chapterSets[book.name]?.has(
                                  selectedChapter.chapter
                                )
                                  ? "Mark unread"
                                  : "Mark read"}
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedChapter(null)}
                                className="rounded-full border border-transparent px-3 py-1 font-semibold text-[#7a6b5a] transition hover:text-[#2b241d]"
                              >
                                Close
                              </button>
                            </div>
                          </div>

                          <div className="mt-4 max-h-64 space-y-3 overflow-y-auto pr-2 text-sm leading-relaxed text-[#2b241d]">
                            {selectedEntry?.status === "loading" ||
                            !selectedEntry ? (
                              <p className="text-sm text-[#7a6b5a]">
                                Loading chapter...
                              </p>
                            ) : null}
                            {selectedEntry?.status === "error" ? (
                              <p className="text-sm text-[#8b6a3d]">
                                {selectedEntry.error}
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            hasDisplayedVerses ? (
                              <div className="space-y-2">
                                {displayedVerses.map((verse) => (
                                  <div
                                    key={`${verse.verse}-${verse.text}`}
                                    className="grid grid-cols-[28px_1fr] gap-3 rounded-xl border border-[#e7dfd3] bg-white/80 px-3 py-2"
                                  >
                                    <span className="text-[10px] font-mono text-[#8b6a3d]">
                                      {verse.verse}
                                    </span>
                                    <p className="text-sm leading-relaxed text-[#2b241d]">
                                      {verse.text}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            !hasDisplayedVerses &&
                            hasSelectedText ? (
                              <p className="whitespace-pre-line text-sm text-[#2b241d]">
                                {selectedEntry.text}
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            !hasDisplayedVerses &&
                            !hasSelectedText ? (
                              <p className="text-sm text-[#7a6b5a]">
                                No text returned for this chapter.
                              </p>
                            ) : null}
                            {selectedEntry?.status === "success" &&
                            selectedEntry?.copyright ? (
                              <p className="text-[11px] text-[#7a6b5a]">
                                {selectedEntry.copyright}
                              </p>
                            ) : null}
                          </div>

                        <div className="mt-4 rounded-2xl border border-[#e1d6c6] bg-white px-4 py-3">
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8b6a3d]">
                              Listen
                            </p>
                            {!ttsSupported ? (
                              <span className="text-xs text-[#7a6b5a]">
                                Not supported
                              </span>
                            ) : null}
                          </div>
                          {!ttsSupported ? null : (
                            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr]">
                              <div className="flex items-end gap-2">
                                {!isSpeaking ? (
                                  <button
                                    type="button"
                                    onClick={startSpeech}
                                    disabled={!canSpeak}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Play
                                  </button>
                                ) : isPaused ? (
                                  <button
                                    type="button"
                                    onClick={resumeSpeech}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63]"
                                  >
                                    Resume
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={pauseSpeech}
                                    className="w-full rounded-xl bg-[#2f3b52] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#3b4a63]"
                                  >
                                    Pause
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={stopSpeech}
                                  disabled={!isSpeaking && !isPaused}
                                  className="rounded-xl border border-[#e1d6c6] px-3 py-2 text-xs font-semibold text-[#7a6b5a] transition hover:border-[#b4894f] hover:text-[#2b241d] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Stop
                                </button>
                              </div>
                              <div>
                                <label className="text-xs text-[#7a6b5a]">
                                  Speed
                                </label>
                                <div className="mt-2 flex items-center gap-3">
                                  <input
                                    type="range"
                                    min="0.7"
                                    max="1.4"
                                    step="0.05"
                                    value={speechRate}
                                    onChange={(event) =>
                                      setSpeechRate(Number(event.target.value))
                                    }
                                    className="w-full accent-[#b4894f]"
                                  />
                                  <span className="text-xs text-[#7a6b5a]">
                                    {speechRate.toFixed(2)}x
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        </div>
                      ) : null}
                    </details>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
