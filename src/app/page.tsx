"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { KidsContent } from "@/components/KidsContent";

type BibleBook = {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
};

type SelectedChapter = {
  book: string;
  chapter: number;
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

type VerseAnnotation = {
  highlighted?: boolean;
  underlined?: boolean;
  note?: string;
};

type VerseAnnotations = Record<string, VerseAnnotation>;

type BookCollectionProps = {
  title: string;
  books: BibleBook[];
  emptyText: string;
  chapterSets: Record<string, Set<number>>;
  chapterNumbers: Record<string, number[]>;
  openBook: string | null;
  selectedChapter: SelectedChapter | null;
  onBookToggle: (bookName: string, isOpen: boolean) => void;
  onOpenChapter: (book: string, chapter: number) => void;
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
  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const next = matches[index + 1];
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

const getVerseKey = (book: string, chapter: number, verse: number) =>
  `${book}::${chapter}::${verse}`;

const CHAPTERS_KEY = "focus-list.chapters.v1";
const DAILY_GOAL_KEY = "focus-list.daily-goal.v1";
const ANNOTATIONS_KEY = "focus-list.annotations.v1";

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

function BookCollection({
  title,
  books,
  emptyText,
  chapterSets,
  chapterNumbers,
  openBook,
  selectedChapter,
  onBookToggle,
  onOpenChapter,
}: BookCollectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.32em] text-[#8a6339]">
          {title}
        </p>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[#a6885f]">
          {books.length} books
        </span>
      </div>
      {books.length === 0 ? (
        <p className="rounded-[20px] border border-dashed border-[#d5c1a0] bg-[#fbf6ea] px-4 py-3 text-sm text-[#866f52]">
          {emptyText}
        </p>
      ) : null}
      {books.map((book) => {
        const completed = chapterSets[book.name]?.size ?? 0;
        return (
          <details
            key={book.name}
            open={openBook === book.name}
            onToggle={(event) =>
              onBookToggle(book.name, event.currentTarget.open)
            }
            className="rounded-[24px] border border-[#d8c5a7] bg-[#fbf6ea] px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-[#2c1b0d]">
                  {book.name}
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#8a6339]">
                  {completed === book.chapters
                    ? "complete"
                    : `${book.chapters - completed} chapters remaining`}
                </p>
              </div>
              <span className="rounded-full border border-[#dbc9aa] bg-[#efe1c7] px-3 py-1 text-[11px] font-semibold text-[#6d4b2a]">
                {completed}/{book.chapters}
              </span>
            </summary>
            <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-8 xl:grid-cols-10">
              {chapterNumbers[book.name].map((chapter) => {
                const checked = chapterSets[book.name]?.has(chapter) ?? false;
                const isSelected =
                  selectedChapter?.book === book.name &&
                  selectedChapter.chapter === chapter;

                return (
                  <button
                    key={`${book.name}-${chapter}`}
                    type="button"
                    onClick={() => onOpenChapter(book.name, chapter)}
                    className={`h-9 rounded-full border text-[11px] font-semibold transition ${
                      checked
                        ? "border-[#ac7d34] bg-[#ead9b3] text-[#3b2615]"
                        : "border-[#dbc9aa] bg-white/80 text-[#7a664a] hover:border-[#c6a272] hover:text-[#2c1b0d]"
                    } ${isSelected ? "ring-2 ring-[#7b5b39]" : ""}`}
                  >
                    {chapter}
                  </button>
                );
              })}
            </div>
          </details>
        );
      })}
    </section>
  );
}

export default function Home() {
  const [mainTab, setMainTab] = useState<"reader" | "kids">("reader");
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>({});
  const [annotations, setAnnotations] = useState<VerseAnnotations>({});
  const [translation, setTranslation] = useState<string>("kjv");
  const [dailyGoal, setDailyGoal] = useState<number>(2);
  const [selectedChapter, setSelectedChapter] = useState<SelectedChapter>({
    book: "Genesis",
    chapter: 1,
  });
  const [chapterCache, setChapterCache] = useState<
    Record<string, ChapterCacheEntry>
  >({});
  const [openBook, setOpenBook] = useState<string | null>("Genesis");
  const [ttsSupported, setTtsSupported] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speechRate, setSpeechRate] = useState(1);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [bookQuery, setBookQuery] = useState("");
  const [activeVerseKey, setActiveVerseKey] = useState<string | null>(null);

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
    const raw = localStorage.getItem(ANNOTATIONS_KEY);
    if (!raw) {
      return;
    }

    try {
      const parsed = JSON.parse(raw) as VerseAnnotations;
      if (parsed && typeof parsed === "object") {
        setAnnotations(parsed);
      }
    } catch {
      localStorage.removeItem(ANNOTATIONS_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  useEffect(() => {
    localStorage.setItem(DAILY_GOAL_KEY, String(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem(ANNOTATIONS_KEY, JSON.stringify(annotations));
  }, [annotations]);

  const chapterNumbers = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const book of bibleBooks) {
      map[book.name] = Array.from({ length: book.chapters }, (_, index) => {
        return index + 1;
      });
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

  const deferredBookQuery = useDeferredValue(bookQuery);
  const normalizedQuery = deferredBookQuery.trim().toLowerCase();

  const filteredOldTestament = useMemo(() => {
    if (!normalizedQuery) {
      return oldTestament;
    }

    return oldTestament.filter((book) =>
      book.name.toLowerCase().includes(normalizedQuery)
    );
  }, [normalizedQuery, oldTestament]);

  const filteredNewTestament = useMemo(() => {
    if (!normalizedQuery) {
      return newTestament;
    }

    return newTestament.filter((book) =>
      book.name.toLowerCase().includes(normalizedQuery)
    );
  }, [newTestament, normalizedQuery]);

  const selectedKey = useMemo(() => {
    return `${translation}:${selectedChapter.book}:${selectedChapter.chapter}`;
  }, [selectedChapter, translation]);

  const selectedEntry = useMemo(() => {
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
    (hasDisplayedVerses || hasSelectedText);

  const selectableVoices = useMemo(() => {
    const englishVoices = voices.filter((voice) =>
      voice.lang.toLowerCase().startsWith("en")
    );
    return englishVoices.length > 0 ? englishVoices : voices;
  }, [voices]);

  const currentTranslationLabel =
    translations.find((option) => option.id === translation)?.label ||
    translation.toUpperCase();

  const selectedBookMeta = useMemo(() => {
    return bibleBooks.find((book) => book.name === selectedChapter.book);
  }, [selectedChapter.book]);

  const chapterRead = chapterSets[selectedChapter.book]?.has(
    selectedChapter.chapter
  );

  const verseItems = useMemo(() => {
    return displayedVerses.map((verse) => {
      const verseKey = getVerseKey(
        selectedChapter.book,
        selectedChapter.chapter,
        verse.verse
      );

      return {
        verse,
        verseKey,
        annotation: annotations[verseKey],
      };
    });
  }, [annotations, displayedVerses, selectedChapter]);

  const activeVerse = useMemo(() => {
    return verseItems.find((item) => item.verseKey === activeVerseKey);
  }, [activeVerseKey, verseItems]);

  const chapterNotes = useMemo(() => {
    return verseItems
      .map((item) => {
        const note = item.annotation?.note?.trim();
        if (!note) {
          return null;
        }

        return {
          verse: item.verse.verse,
          note,
          verseKey: item.verseKey,
        };
      })
      .filter((item): item is { verse: number; note: string; verseKey: string } =>
        Boolean(item)
      );
  }, [verseItems]);

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
      setSelectedVoice((current) => current || preferred?.voiceURI || "");
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
    if (!selectedKey || !selectedChapter) {
      return;
    }

    if (
      selectedEntry?.status === "loading" ||
      selectedEntry?.status === "success"
    ) {
      return;
    }

    const loadChapter = async () => {
      setChapterCache((current) => ({
        ...current,
        [selectedKey]: {
          status: "loading",
        },
      }));

      const ref = `${selectedChapter.book} ${selectedChapter.chapter}`;
      const url = `/api/bible?ref=${encodeURIComponent(
        ref
      )}&translation=${translation}`;

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

        setChapterCache((current) => ({
          ...current,
          [selectedKey]: {
            status: "success",
            verses,
            text,
            reference: data.reference || ref,
            copyright: data.copyright,
          },
        }));
      } catch (error) {
        setChapterCache((current) => ({
          ...current,
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

    void loadChapter();
  }, [selectedChapter, selectedEntry?.status, selectedKey, translation]);

  useEffect(() => {
    if (displayedVerses.length === 0) {
      setActiveVerseKey(null);
      return;
    }

    const availableKeys = displayedVerses.map((verse) =>
      getVerseKey(selectedChapter.book, selectedChapter.chapter, verse.verse)
    );

    setActiveVerseKey((current) => {
      if (current && availableKeys.includes(current)) {
        return current;
      }

      return availableKeys[0] ?? null;
    });
  }, [displayedVerses, selectedChapter]);

  const openChapter = (book: string, chapter: number) => {
    setSelectedChapter({ book, chapter });
    setOpenBook(book);
  };

  const toggleChapter = (bookName: string, chapter: number) => {
    setChapterProgress((current) => {
      const chapters = Array.isArray(current[bookName]) ? current[bookName] : [];
      const next = new Set(chapters);

      if (next.has(chapter)) {
        next.delete(chapter);
      } else {
        next.add(chapter);
      }

      return {
        ...current,
        [bookName]: Array.from(next).sort((left, right) => left - right),
      };
    });
  };

  const markPlanRead = () => {
    if (planChapters.length === 0) {
      return;
    }

    setChapterProgress((current) => {
      const next: ChapterProgress = { ...current };

      for (const item of planChapters) {
        const chapters = Array.isArray(next[item.book]) ? next[item.book] : [];
        const set = new Set(chapters);
        set.add(item.chapter);
        next[item.book] = Array.from(set).sort((left, right) => left - right);
      }

      return next;
    });
  };

  const updateAnnotation = (
    verseKey: string,
    transform: (current: VerseAnnotation) => VerseAnnotation
  ) => {
    setAnnotations((current) => {
      const nextValue = transform(current[verseKey] ?? {});
      const hasNote = Boolean(nextValue.note?.trim());
      const hasAnyMark =
        Boolean(nextValue.highlighted) ||
        Boolean(nextValue.underlined) ||
        hasNote;

      if (!hasAnyMark) {
        if (!(verseKey in current)) {
          return current;
        }

        const next = { ...current };
        delete next[verseKey];
        return next;
      }

      return {
        ...current,
        [verseKey]: {
          highlighted: Boolean(nextValue.highlighted),
          underlined: Boolean(nextValue.underlined),
          note: hasNote ? nextValue.note : undefined,
        },
      };
    });
  };

  const startSpeech = () => {
    if (!canSpeak || !selectedEntry || typeof window === "undefined") {
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
    const voice = selectableVoices.find(
      (candidate) => candidate.voiceURI === selectedVoice
    );

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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(156,112,66,0.5),_transparent_35%),linear-gradient(180deg,_#795433_0%,_#4c331d_100%)] px-3 py-4 text-[#2b1b0f] md:px-5 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1700px] flex-col gap-4">
        <header className="flex flex-wrap items-start justify-between gap-4 px-2 text-[#f4e7d0]">
          <div>
            <p className="text-[11px] uppercase tracking-[0.45em] text-[#dcc3a1]">
              Halo List
            </p>
            <h1 className="font-display text-4xl leading-none md:text-5xl">
              Open Bible Reader
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-[#f4e7d0]/80">
              The whole screen now reads like a Bible spread, with room for
              highlights, underlines, and margin notes that save in this
              browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setMainTab("reader")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                mainTab === "reader"
                  ? "border-[#f2dfbc] bg-[#f2dfbc] text-[#362112]"
                  : "border-[#d6b892] bg-transparent text-[#f4e7d0] hover:border-[#f2dfbc]"
              }`}
            >
              Bible Reader
            </button>
            <button
              type="button"
              onClick={() => setMainTab("kids")}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                mainTab === "kids"
                  ? "border-[#f2dfbc] bg-[#f2dfbc] text-[#362112]"
                  : "border-[#d6b892] bg-transparent text-[#f4e7d0] hover:border-[#f2dfbc]"
              }`}
            >
              Kids Corner
            </button>
            <a
              href="/dashboard"
              className="rounded-full border border-[#d6b892] px-4 py-2 text-sm font-semibold text-[#f4e7d0] transition hover:border-[#f2dfbc]"
            >
              Dashboard
            </a>
          </div>
        </header>

        {mainTab === "kids" ? (
          <section className="relative flex-1 overflow-hidden rounded-[40px] border border-[#8d6841] bg-[#8d6841] p-3 shadow-[0_35px_90px_rgba(20,11,3,0.45)]">
            <div className="absolute inset-x-1/2 top-3 bottom-3 hidden w-5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#5d3d23_0%,_#b78d5c_50%,_#5d3d23_100%)] shadow-[inset_0_0_18px_rgba(0,0,0,0.45)] lg:block" />
            <div className="grid h-full gap-3 lg:grid-cols-[minmax(0,1fr)_24px_minmax(0,1fr)]">
              <div className="rounded-[34px] border border-[#d8c29c] bg-[#efe2c6] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_12px_28px_rgba(62,35,10,0.18)]">
                <div className="h-full overflow-y-auto pr-1">
                  <KidsContent />
                </div>
              </div>
              <div className="hidden lg:block" />
              <div className="rounded-[34px] border border-[#d8c29c] bg-[#f7efd8] p-6 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_12px_28px_rgba(62,35,10,0.18)]">
                <div className="flex h-full flex-col justify-between rounded-[26px] border border-[#dcc9aa] bg-[#fbf7ee] p-6">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a6339]">
                      Storybook mode
                    </p>
                    <h2 className="mt-3 font-display text-3xl text-[#2b1b0f]">
                      A softer page for younger readers
                    </h2>
                    <p className="mt-4 max-w-lg text-sm leading-7 text-[#705d45]">
                      Kids Corner stays separate, so the main Bible reader can
                      feel like an open Bible while children still get their own
                      friendly space.
                    </p>
                  </div>
                  <div className="rounded-[24px] border border-[#d9c6a7] bg-[#efe3c7] p-5">
                    <p className="text-sm font-semibold text-[#2b1b0f]">
                      Switch back to Bible Reader whenever you want the full
                      chapter experience with annotations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="relative flex-1 overflow-hidden rounded-[40px] border border-[#8d6841] bg-[#8d6841] p-3 shadow-[0_35px_90px_rgba(20,11,3,0.45)]">
            <div className="absolute inset-x-1/2 top-3 bottom-3 hidden w-5 -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,_#5d3d23_0%,_#b78d5c_50%,_#5d3d23_100%)] shadow-[inset_0_0_18px_rgba(0,0,0,0.45)] lg:block" />
            <div className="grid h-full gap-3 lg:grid-cols-[minmax(360px,430px)_24px_minmax(0,1fr)]">
              <aside className="min-h-0 rounded-[34px] border border-[#d8c29c] bg-[#efe2c6] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_12px_28px_rgba(62,35,10,0.18)]">
                <div className="flex h-full flex-col gap-5">
                  <div className="rounded-[26px] border border-[#d7c19a] bg-[#f7eed8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                    <p className="text-[11px] uppercase tracking-[0.34em] text-[#8a6339]">
                      Bible at a glance
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-[#2b1b0f]">
                      Read on a real spread
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-[#705d45]">
                      Choose a chapter on the left, then read, listen, and add
                      verse notes on the right page like margin notes in a study
                      Bible.
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                      <div className="rounded-[20px] border border-[#d9c6a7] bg-white/60 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a6339]">
                          Complete
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-[#2b1b0f]">
                          {chapterPercent}%
                        </p>
                      </div>
                      <div className="rounded-[20px] border border-[#d9c6a7] bg-white/60 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a6339]">
                          Chapters
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-[#2b1b0f]">
                          {chapterStats.completed}/{chapterStats.total}
                        </p>
                      </div>
                      <div className="rounded-[20px] border border-[#d9c6a7] bg-white/60 px-4 py-3">
                        <p className="text-[11px] uppercase tracking-[0.2em] text-[#8a6339]">
                          Notes
                        </p>
                        <p className="mt-1 text-2xl font-semibold text-[#2b1b0f]">
                          {Object.keys(annotations).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-1 xl:grid-cols-2">
                    <section className="rounded-[26px] border border-[#d7c19a] bg-[#f7eed8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] uppercase tracking-[0.32em] text-[#8a6339]">
                          Reading plan
                        </p>
                        <span className="text-xs font-semibold text-[#6f5739]">
                          {unreadChapters.length} chapters left
                        </span>
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#2b1b0f]">
                            Chapters per day
                          </p>
                          <p className="text-xs text-[#866f52]">
                            Keep the pace steady.
                          </p>
                        </div>
                        <select
                          value={planGoal}
                          onChange={(event) =>
                            setDailyGoal(Number(event.target.value))
                          }
                          className="rounded-full border border-[#d3bea0] bg-white px-3 py-2 text-sm font-semibold text-[#2b1b0f] outline-none transition focus:border-[#8a6339]"
                        >
                          {[1, 2, 3, 4, 5, 6].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-4 rounded-[22px] border border-[#ddc9aa] bg-white/65 p-4">
                        <div className="h-2 rounded-full bg-[#e5d8bf]">
                          <div
                            className="h-2 rounded-full bg-[linear-gradient(90deg,_#7b5b39_0%,_#c89c56_100%)]"
                            style={{ width: `${chapterPercent}%` }}
                          />
                        </div>
                        {planChapters.length === 0 ? (
                          <p className="mt-3 text-sm text-[#705d45]">
                            Every chapter is marked complete.
                          </p>
                        ) : (
                          <>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {planChapters.map((item) => (
                                <button
                                  key={`${item.book}-${item.chapter}`}
                                  type="button"
                                  onClick={() =>
                                    openChapter(item.book, item.chapter)
                                  }
                                  className="rounded-full border border-[#d3bea0] bg-white px-3 py-1.5 text-xs font-semibold text-[#2b1b0f] transition hover:border-[#8a6339]"
                                >
                                  {item.book} {item.chapter}
                                </button>
                              ))}
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  openChapter(
                                    planChapters[0].book,
                                    planChapters[0].chapter
                                  )
                                }
                                className="rounded-full bg-[#2f3b52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#394865]"
                              >
                                Open today&apos;s first chapter
                              </button>
                              <button
                                type="button"
                                onClick={markPlanRead}
                                className="rounded-full border border-[#d3bea0] px-4 py-2 text-xs font-semibold text-[#2b1b0f] transition hover:border-[#8a6339]"
                              >
                                Mark plan read
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </section>

                    <section className="rounded-[26px] border border-[#d7c19a] bg-[#f7eed8] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[#8a6339]">
                        Reader settings
                      </p>
                      <div className="mt-4 grid gap-4">
                        <div>
                          <label className="text-xs uppercase tracking-[0.18em] text-[#8a6339]">
                            Translation
                          </label>
                          <select
                            value={translation}
                            onChange={(event) =>
                              setTranslation(event.target.value)
                            }
                            className="mt-2 w-full rounded-[18px] border border-[#d3bea0] bg-white px-3 py-3 text-sm font-medium text-[#2b1b0f] outline-none transition focus:border-[#8a6339]"
                          >
                            {translations.map((option) => (
                              <option
                                key={option.id}
                                value={option.id}
                                disabled={option.disabled}
                              >
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <p className="mt-2 text-xs leading-5 text-[#866f52]">
                            ESV still requires the server API key if you choose
                            it.
                          </p>
                        </div>

                        <div>
                          <label className="text-xs uppercase tracking-[0.18em] text-[#8a6339]">
                            Search books
                          </label>
                          <div className="mt-2 flex gap-2">
                            <input
                              value={bookQuery}
                              onChange={(event) =>
                                setBookQuery(event.target.value)
                              }
                              placeholder="Genesis, John, Psalms..."
                              className="h-11 w-full rounded-[18px] border border-[#d3bea0] bg-white px-3 text-sm text-[#2b1b0f] outline-none transition focus:border-[#8a6339]"
                            />
                            {bookQuery ? (
                              <button
                                type="button"
                                onClick={() => setBookQuery("")}
                                className="rounded-[18px] border border-[#d3bea0] px-3 text-xs font-semibold text-[#6f5739] transition hover:border-[#8a6339] hover:text-[#2b1b0f]"
                              >
                                Clear
                              </button>
                            ) : null}
                          </div>
                        </div>

                        {ttsSupported && selectableVoices.length > 0 ? (
                          <div>
                            <label className="text-xs uppercase tracking-[0.18em] text-[#8a6339]">
                              Voice
                            </label>
                            <select
                              value={selectedVoice}
                              onChange={(event) =>
                                setSelectedVoice(event.target.value)
                              }
                              className="mt-2 w-full rounded-[18px] border border-[#d3bea0] bg-white px-3 py-3 text-sm font-medium text-[#2b1b0f] outline-none transition focus:border-[#8a6339]"
                            >
                              {selectableVoices.map((voice) => (
                                <option key={voice.voiceURI} value={voice.voiceURI}>
                                  {voice.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        ) : null}
                      </div>
                    </section>
                  </div>

                  <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                    <div className="space-y-5">
                      <BookCollection
                        title="Old Testament"
                        books={filteredOldTestament}
                        emptyText="No Old Testament books match your search."
                        chapterSets={chapterSets}
                        chapterNumbers={chapterNumbers}
                        openBook={openBook}
                        selectedChapter={selectedChapter}
                        onBookToggle={(bookName, isOpen) =>
                          setOpenBook(isOpen ? bookName : null)
                        }
                        onOpenChapter={openChapter}
                      />
                      <BookCollection
                        title="New Testament"
                        books={filteredNewTestament}
                        emptyText="No New Testament books match your search."
                        chapterSets={chapterSets}
                        chapterNumbers={chapterNumbers}
                        openBook={openBook}
                        selectedChapter={selectedChapter}
                        onBookToggle={(bookName, isOpen) =>
                          setOpenBook(isOpen ? bookName : null)
                        }
                        onOpenChapter={openChapter}
                      />
                    </div>
                  </div>
                </div>
              </aside>

              <div className="hidden lg:block" />

              <section className="min-h-0 rounded-[34px] border border-[#d8c29c] bg-[#f7efd8] p-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35),0_12px_28px_rgba(62,35,10,0.18)]">
                <div className="flex h-full flex-col gap-5">
                  <div className="rounded-[26px] border border-[#d7c19a] bg-[#fbf7ee] px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.35em] text-[#8a6339]">
                          Open chapter
                        </p>
                        <h2 className="mt-2 font-display text-4xl text-[#2b1b0f]">
                          {selectedEntry?.reference ||
                            `${selectedChapter.book} ${selectedChapter.chapter}`}
                        </h2>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs text-[#6f5739]">
                          <span className="rounded-full border border-[#d5c1a0] bg-[#f3e7cf] px-3 py-1">
                            {currentTranslationLabel}
                          </span>
                          <span className="rounded-full border border-[#d5c1a0] bg-[#f3e7cf] px-3 py-1">
                            Chapter {selectedChapter.chapter}
                            {selectedBookMeta
                              ? ` of ${selectedBookMeta.chapters}`
                              : ""}
                          </span>
                          <span className="rounded-full border border-[#d5c1a0] bg-[#f3e7cf] px-3 py-1">
                            {chapterNotes.length} notes in this chapter
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            toggleChapter(
                              selectedChapter.book,
                              selectedChapter.chapter
                            )
                          }
                          className="rounded-full bg-[#2f3b52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#394865]"
                        >
                          {chapterRead ? "Mark unread" : "Mark read"}
                        </button>
                        {selectedEntry?.status === "success" &&
                        selectedEntry.copyright ? (
                          <span className="max-w-xs text-right text-[11px] leading-5 text-[#7f694f]">
                            {selectedEntry.copyright}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="grid min-h-0 flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
                    <div className="min-h-0 rounded-[28px] border border-[#d8c5a7] bg-[#fbf7ee] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <div className="flex h-full flex-col gap-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1d0b2] pb-4">
                          <div>
                            <p className="text-[11px] uppercase tracking-[0.28em] text-[#8a6339]">
                              Reading page
                            </p>
                            <p className="mt-1 text-sm text-[#6f5739]">
                              Tap any verse to highlight it, underline it, or
                              write a margin note.
                            </p>
                          </div>
                          {activeVerse ? (
                            <button
                              type="button"
                              onClick={() => setActiveVerseKey(activeVerse.verseKey)}
                              className="rounded-full border border-[#d5c1a0] bg-[#f3e7cf] px-3 py-1.5 text-xs font-semibold text-[#6f5739]"
                            >
                              Verse {activeVerse.verse.verse} selected
                            </button>
                          ) : null}
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto pr-2">
                          {selectedEntry?.status === "loading" || !selectedEntry ? (
                            <div className="flex h-full min-h-[420px] items-center justify-center rounded-[24px] border border-dashed border-[#dac7a8] bg-[#f8f1e0] px-6 text-center text-sm text-[#705d45]">
                              Loading chapter text...
                            </div>
                          ) : null}

                          {selectedEntry?.status === "error" ? (
                            <div className="rounded-[24px] border border-[#d7bf9e] bg-[#f8f1e0] px-5 py-6 text-sm text-[#7b5b39]">
                              {selectedEntry.error}
                            </div>
                          ) : null}

                          {selectedEntry?.status === "success" && hasDisplayedVerses ? (
                            <div className="space-y-3">
                              {verseItems.map((item) => {
                                const isActive = item.verseKey === activeVerseKey;
                                const noteCount = item.annotation?.note?.trim()
                                  ? 1
                                  : 0;

                                return (
                                  <button
                                    key={item.verseKey}
                                    type="button"
                                    onClick={() => setActiveVerseKey(item.verseKey)}
                                    className={`w-full rounded-[22px] border px-4 py-4 text-left transition ${
                                      item.annotation?.highlighted
                                        ? "border-[#d8be6f] bg-[#f5e8a7]"
                                        : "border-transparent bg-transparent hover:border-[#e3d2b6] hover:bg-[#f5ecdb]"
                                    } ${isActive ? "ring-2 ring-[#7b5b39]" : ""}`}
                                  >
                                    <div className="grid grid-cols-[32px_1fr] gap-4">
                                      <span className="pt-1 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8a6339]">
                                        {item.verse.verse}
                                      </span>
                                      <div>
                                        <p
                                          className={`text-base leading-8 text-[#2b1b0f] ${
                                            item.annotation?.underlined
                                              ? "underline decoration-[#7b5b39] decoration-2 underline-offset-[6px]"
                                              : ""
                                          }`}
                                        >
                                          {item.verse.text}
                                        </p>
                                        {item.annotation?.highlighted ||
                                        item.annotation?.underlined ||
                                        noteCount > 0 ? (
                                          <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-[#7c613c]">
                                            {item.annotation?.highlighted ? (
                                              <span className="rounded-full bg-white/70 px-2.5 py-1">
                                                highlighted
                                              </span>
                                            ) : null}
                                            {item.annotation?.underlined ? (
                                              <span className="rounded-full bg-white/70 px-2.5 py-1">
                                                underlined
                                              </span>
                                            ) : null}
                                            {noteCount > 0 ? (
                                              <span className="rounded-full bg-white/70 px-2.5 py-1">
                                                note saved
                                              </span>
                                            ) : null}
                                          </div>
                                        ) : null}
                                      </div>
                                    </div>
                                  </button>
                                );
                              })}
                            </div>
                          ) : null}

                          {selectedEntry?.status === "success" &&
                          !hasDisplayedVerses &&
                          hasSelectedText ? (
                            <div className="rounded-[24px] border border-[#e1d0b2] bg-[#f8f1e0] px-6 py-5">
                              <p className="whitespace-pre-line text-base leading-8 text-[#2b1b0f]">
                                {selectedEntry.text}
                              </p>
                            </div>
                          ) : null}

                          {selectedEntry?.status === "success" &&
                          !hasDisplayedVerses &&
                          !hasSelectedText ? (
                            <div className="rounded-[24px] border border-[#d7bf9e] bg-[#f8f1e0] px-5 py-6 text-sm text-[#7b5b39]">
                              No text was returned for this chapter.
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <aside className="rounded-[28px] border border-[#d8c5a7] bg-[#efe3c7] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                      <div className="space-y-5">
                        <section className="rounded-[22px] border border-[#d7c19a] bg-[#fbf7ee] p-4">
                          <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a6339]">
                            Verse tools
                          </p>
                          {activeVerse ? (
                            <>
                              <p className="mt-3 text-sm font-semibold text-[#2b1b0f]">
                                {selectedChapter.book} {selectedChapter.chapter}:
                                {activeVerse.verse.verse}
                              </p>
                              <p className="mt-2 text-sm leading-6 text-[#705d45]">
                                {activeVerse.verse.text}
                              </p>
                              <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  aria-pressed={Boolean(
                                    activeVerse.annotation?.highlighted
                                  )}
                                  onClick={() =>
                                    updateAnnotation(activeVerse.verseKey, (current) => ({
                                      ...current,
                                      highlighted: !current.highlighted,
                                    }))
                                  }
                                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    activeVerse.annotation?.highlighted
                                      ? "bg-[#d4b75b] text-[#2b1b0f]"
                                      : "border border-[#d3bea0] bg-white text-[#6f5739] hover:border-[#8a6339]"
                                  }`}
                                >
                                  Highlight
                                </button>
                                <button
                                  type="button"
                                  aria-pressed={Boolean(
                                    activeVerse.annotation?.underlined
                                  )}
                                  onClick={() =>
                                    updateAnnotation(activeVerse.verseKey, (current) => ({
                                      ...current,
                                      underlined: !current.underlined,
                                    }))
                                  }
                                  className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                                    activeVerse.annotation?.underlined
                                      ? "bg-[#cab29a] text-[#2b1b0f]"
                                      : "border border-[#d3bea0] bg-white text-[#6f5739] hover:border-[#8a6339]"
                                  }`}
                                >
                                  Underline
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateAnnotation(activeVerse.verseKey, () => ({}))
                                  }
                                  className="rounded-full border border-[#d3bea0] px-4 py-2 text-xs font-semibold text-[#6f5739] transition hover:border-[#8a6339] hover:text-[#2b1b0f]"
                                >
                                  Clear
                                </button>
                              </div>
                              <div className="mt-4">
                                <label className="text-[11px] uppercase tracking-[0.22em] text-[#8a6339]">
                                  Margin note
                                </label>
                                <textarea
                                  value={activeVerse.annotation?.note ?? ""}
                                  onChange={(event) =>
                                    updateAnnotation(activeVerse.verseKey, (current) => ({
                                      ...current,
                                      note: event.target.value,
                                    }))
                                  }
                                  placeholder="Write a thought, prayer, or observation for this verse."
                                  className="mt-2 min-h-[150px] w-full rounded-[18px] border border-[#d3bea0] bg-white px-3 py-3 text-sm leading-6 text-[#2b1b0f] outline-none transition focus:border-[#8a6339]"
                                />
                                <p className="mt-2 text-xs text-[#866f52]">
                                  Notes save automatically in this browser.
                                </p>
                              </div>
                            </>
                          ) : (
                            <p className="mt-3 text-sm leading-6 text-[#705d45]">
                              Select a verse on the reading page to highlight,
                              underline, or add a note.
                            </p>
                          )}
                        </section>

                        <section className="rounded-[22px] border border-[#d7c19a] bg-[#fbf7ee] p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a6339]">
                              Audio
                            </p>
                            {!ttsSupported ? (
                              <span className="text-xs text-[#866f52]">
                                Not supported
                              </span>
                            ) : null}
                          </div>
                          {!ttsSupported ? (
                            <p className="mt-3 text-sm text-[#705d45]">
                              Speech controls are not available in this browser.
                            </p>
                          ) : (
                            <>
                              <div className="mt-4 flex gap-2">
                                {!isSpeaking ? (
                                  <button
                                    type="button"
                                    onClick={startSpeech}
                                    disabled={!canSpeak}
                                    className="flex-1 rounded-full bg-[#2f3b52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#394865] disabled:cursor-not-allowed disabled:opacity-60"
                                  >
                                    Play
                                  </button>
                                ) : isPaused ? (
                                  <button
                                    type="button"
                                    onClick={resumeSpeech}
                                    className="flex-1 rounded-full bg-[#2f3b52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#394865]"
                                  >
                                    Resume
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={pauseSpeech}
                                    className="flex-1 rounded-full bg-[#2f3b52] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#394865]"
                                  >
                                    Pause
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={stopSpeech}
                                  disabled={!isSpeaking && !isPaused}
                                  className="rounded-full border border-[#d3bea0] px-4 py-2 text-xs font-semibold text-[#6f5739] transition hover:border-[#8a6339] hover:text-[#2b1b0f] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  Stop
                                </button>
                              </div>
                              <div className="mt-4">
                                <label className="text-[11px] uppercase tracking-[0.22em] text-[#8a6339]">
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
                                    className="w-full accent-[#8a6339]"
                                  />
                                  <span className="text-xs font-semibold text-[#6f5739]">
                                    {speechRate.toFixed(2)}x
                                  </span>
                                </div>
                              </div>
                            </>
                          )}
                        </section>

                        <section className="rounded-[22px] border border-[#d7c19a] bg-[#fbf7ee] p-4">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] uppercase tracking-[0.3em] text-[#8a6339]">
                              Chapter notes
                            </p>
                            <span className="text-xs font-semibold text-[#6f5739]">
                              {chapterNotes.length}
                            </span>
                          </div>
                          {chapterNotes.length === 0 ? (
                            <p className="mt-3 text-sm leading-6 text-[#705d45]">
                              No verse notes yet for this chapter.
                            </p>
                          ) : (
                            <div className="mt-4 max-h-[280px] space-y-3 overflow-y-auto pr-1">
                              {chapterNotes.map((note) => (
                                <button
                                  key={note.verseKey}
                                  type="button"
                                  onClick={() => setActiveVerseKey(note.verseKey)}
                                  className={`w-full rounded-[18px] border px-3 py-3 text-left transition ${
                                    activeVerseKey === note.verseKey
                                      ? "border-[#8a6339] bg-[#f3e7cf]"
                                      : "border-[#d8c5a7] bg-white hover:border-[#8a6339]"
                                  }`}
                                >
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8a6339]">
                                    Verse {note.verse}
                                  </p>
                                  <p className="mt-2 line-clamp-4 text-sm leading-6 text-[#2b1b0f]">
                                    {note.note}
                                  </p>
                                </button>
                              ))}
                            </div>
                          )}
                        </section>
                      </div>
                    </aside>
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
