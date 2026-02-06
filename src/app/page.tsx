"use client";

import { useEffect, useMemo, useState } from "react";

type Filter = "all" | "active" | "done";

type TodoItem = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: number;
};

type BibleBook = {
  name: string;
  chapters: number;
  testament: "OT" | "NT";
};

type ChapterProgress = Record<string, number[]>;

const getFilteredItems = (items: TodoItem[], filter: Filter) => {
  if (filter === "active") {
    return items.filter((item) => !item.completed);
  }
  if (filter === "done") {
    return items.filter((item) => item.completed);
  }
  return items;
};

const reorderWithinFilter = (
  items: TodoItem[],
  filter: Filter,
  sourceId: string,
  targetId: string
) => {
  const visible = getFilteredItems(items, filter);
  const sourceIndex = visible.findIndex((item) => item.id === sourceId);
  const targetIndex = visible.findIndex((item) => item.id === targetId);

  if (sourceIndex === -1 || targetIndex === -1) {
    return items;
  }

  const nextVisible = [...visible];
  const [moved] = nextVisible.splice(sourceIndex, 1);
  nextVisible.splice(targetIndex, 0, moved);

  if (filter === "all") {
    return nextVisible;
  }

  const visibleSet = new Set(nextVisible.map((item) => item.id));
  const queue = [...nextVisible];
  return items.map((item) => {
    if (!visibleSet.has(item.id)) {
      return item;
    }
    return queue.shift() ?? item;
  });
};

const STORAGE_KEY = "focus-list.items.v1";
const CHAPTERS_KEY = "focus-list.chapters.v1";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "done", label: "Done" },
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
  const [items, setItems] = useState<TodoItem[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [chapterProgress, setChapterProgress] = useState<ChapterProgress>({});

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    try {
      const parsed = JSON.parse(raw) as TodoItem[];
      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

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
    localStorage.setItem(CHAPTERS_KEY, JSON.stringify(chapterProgress));
  }, [chapterProgress]);

  const stats = useMemo(() => {
    const total = items.length;
    const completed = items.filter((item) => item.completed).length;
    const active = total - completed;
    return { total, completed, active };
  }, [items]);

  const visibleItems = useMemo(() => {
    return getFilteredItems(items, filter);
  }, [items, filter]);

  const chapterNumbers = useMemo(() => {
    const map: Record<string, number[]> = {};
    for (const book of bibleBooks) {
      map[book.name] = Array.from({ length: book.chapters }, (_, i) => i + 1);
    }
    return map;
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

  const addItem = () => {
    const title = input.trim();
    if (!title) {
      return;
    }
    const newItem: TodoItem = {
      id: crypto.randomUUID(),
      title,
      completed: false,
      createdAt: Date.now(),
    };
    setItems((prev) => [newItem, ...prev]);
    setInput("");
  };

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCompleted = () => {
    setItems((prev) => prev.filter((item) => !item.completed));
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

  const handleDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    id: string
  ) => {
    setDragId(id);
    event.dataTransfer.setData("text/plain", id);
    event.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLIElement>,
    id: string
  ) => {
    event.preventDefault();
    setDragOverId(id);
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLIElement>,
    targetId: string
  ) => {
    event.preventDefault();
    const sourceId = dragId ?? event.dataTransfer.getData("text/plain");
    setDragId(null);
    setDragOverId(null);

    if (!sourceId || sourceId === targetId) {
      return;
    }

    setItems((prev) => reorderWithinFilter(prev, filter, sourceId, targetId));
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
            <p className="font-mono text-xs uppercase tracking-[0.45em] text-[#8b6a3d]">
              Halo List
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Read gently. Finish faithfully.
            </h1>
            <p className="max-w-2xl text-base text-[#5a534b] md:text-lg">
              A calm, dedicated space for your Bible-reading plan. Everything
              saves locally in your browser.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-[32px] bg-white/90 p-6 shadow-[0_30px_90px_rgba(62,54,41,0.18)] backdrop-blur">
              <div className="flex flex-col gap-4">
                <label className="text-sm font-medium text-[#7a6b5a]">
                  Add a reading
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        addItem();
                      }
                    }}
                    placeholder="e.g., Read Psalm 23, John 1:1–18..."
                    className="h-12 w-full rounded-2xl border border-transparent bg-[#f1ece3] px-4 text-base outline-none transition focus:border-[#d6c3a6] focus:ring-2 focus:ring-[#eadcc8]"
                  />
                  <button
                    type="button"
                    onClick={addItem}
                    className="h-12 shrink-0 rounded-2xl bg-[#2f3b52] px-5 text-sm font-semibold text-white shadow-[0_12px_25px_rgba(47,59,82,0.3)] transition hover:translate-y-[-1px] hover:bg-[#3b4a63]"
                  >
                    Add reading
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-[#7a6b5a]">
                  {filters.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setFilter(option.id)}
                      className={`rounded-full px-4 py-1 transition ${
                        filter === option.id
                          ? "bg-[#2f3b52] text-white"
                          : "bg-[#f1ece3] hover:bg-[#e7dfd3]"
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-[#b39b7a]">
                  Drag the handle to reorder.
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-[#7a6b5a]">
                <span>
                  {stats.active} to read · {stats.completed} finished
                </span>
                <button
                  type="button"
                  onClick={clearCompleted}
                  className="font-medium text-[#2b241d] transition hover:text-[#8b6a3d]"
                >
                  Clear completed
                </button>
              </div>

              <ul className="mt-6 space-y-3">
                {visibleItems.length === 0 ? (
                  <li className="rounded-2xl border border-dashed border-[#e1d6c6] bg-white/80 p-6 text-center text-sm text-[#8b6a3d]">
                    Your list is blank. Add a reading to begin.
                  </li>
                ) : (
                  visibleItems.map((item) => (
                    <li
                      key={item.id}
                      onDragOver={(event) => handleDragOver(event, item.id)}
                      onDrop={(event) => handleDrop(event, item.id)}
                      onDragLeave={() => setDragOverId(null)}
                      className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 shadow-sm transition ${
                        dragOverId === item.id
                          ? "border-[#b4894f] bg-[#f7f1e7]"
                          : "border-[#e7dfd3] bg-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          aria-label="Drag to reorder"
                          draggable
                          onDragStart={(event) =>
                            handleDragStart(event, item.id)
                          }
                          onDragEnd={() => {
                            setDragId(null);
                            setDragOverId(null);
                          }}
                          className="cursor-grab rounded-full border border-transparent px-2 py-1 text-xs font-mono text-[#b7a48a] transition hover:border-[#e7ddcd] active:cursor-grabbing"
                        >
                          ::
                        </button>
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleItem(item.id)}
                            className="h-5 w-5 rounded border-[#cbb89a] text-[#2b241d] accent-[#b4894f]"
                          />
                          <span
                            className={`text-sm font-medium ${
                              item.completed
                                ? "text-[#b7ad9f] line-through"
                                : "text-[#2b241d]"
                            }`}
                          >
                            {item.title}
                          </span>
                        </label>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full border border-transparent px-3 py-1 text-xs font-semibold text-[#8b6a3d] transition hover:border-[#e1d6c6] hover:text-[#2b241d]"
                      >
                        Remove
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </div>

            <aside className="flex flex-col gap-4">
              <div className="rounded-[32px] bg-[#2f3b52] p-6 text-white shadow-[0_30px_80px_rgba(47,59,82,0.35)]">
                <p className="text-sm uppercase tracking-[0.4em] text-[#e9d9c4]">
                  Today
                </p>
                <p className="mt-3 text-4xl font-semibold">
                  {stats.active}
                </p>
                <p className="mt-2 text-sm text-[#e9d9c4]">
                  readings still in motion
                </p>
              </div>
              <div className="rounded-[32px] bg-white/90 p-6 shadow-[0_25px_80px_rgba(62,54,41,0.14)] backdrop-blur">
                <p className="text-sm font-medium text-[#7a6b5a]">
                  Best way to read
                </p>
                <ul className="mt-4 space-y-3 text-sm text-[#5a534b]">
                  <li>Start with a Gospel (Mark or John).</li>
                  <li>Read Acts next to see the early church.</li>
                  <li>Add a Psalm or Proverb for daily prayer.</li>
                  <li>Move to Genesis and Exodus for the story arc.</li>
                </ul>
              </div>
            </aside>
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
                  Tap a chapter as you finish it.
                </p>
              </div>
              <div className="rounded-2xl bg-[#2f3b52] px-5 py-4 text-white shadow-[0_15px_35px_rgba(47,59,82,0.35)]">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#e9d9c4]">
                  Progress
                </p>
                <p className="text-2xl font-semibold">
                  {chapterStats.completed} / {chapterStats.total}
                </p>
                <p className="text-xs text-[#e9d9c4]">chapters complete</p>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                  Old Testament
                </p>
                {oldTestament.map((book) => {
                  const completed = chapterSets[book.name]?.size ?? 0;
                  return (
                    <details
                      key={book.name}
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
                      <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                        {chapterNumbers[book.name].map((chapter) => {
                          const checked =
                            chapterSets[book.name]?.has(chapter) ?? false;
                          return (
                            <label
                              key={`${book.name}-${chapter}`}
                              className={`flex cursor-pointer items-center justify-center rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                                checked
                                  ? "border-[#b4894f] bg-[#f4ead8] text-[#2b241d]"
                                  : "border-[#e1d6c6] bg-white text-[#7a6b5a] hover:border-[#cdbd9f]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleChapter(book.name, chapter)
                                }
                                className="sr-only"
                              />
                              {chapter}
                            </label>
                          );
                        })}
                      </div>
                    </details>
                  );
                })}
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-[#8b6a3d]">
                  New Testament
                </p>
                {newTestament.map((book) => {
                  const completed = chapterSets[book.name]?.size ?? 0;
                  return (
                    <details
                      key={book.name}
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
                      <div className="mt-3 grid grid-cols-6 gap-2 sm:grid-cols-8 md:grid-cols-10">
                        {chapterNumbers[book.name].map((chapter) => {
                          const checked =
                            chapterSets[book.name]?.has(chapter) ?? false;
                          return (
                            <label
                              key={`${book.name}-${chapter}`}
                              className={`flex cursor-pointer items-center justify-center rounded-full border px-2 py-1 text-[11px] font-semibold transition ${
                                checked
                                  ? "border-[#b4894f] bg-[#f4ead8] text-[#2b241d]"
                                  : "border-[#e1d6c6] bg-white text-[#7a6b5a] hover:border-[#cdbd9f]"
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() =>
                                  toggleChapter(book.name, chapter)
                                }
                                className="sr-only"
                              />
                              {chapter}
                            </label>
                          );
                        })}
                      </div>
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
