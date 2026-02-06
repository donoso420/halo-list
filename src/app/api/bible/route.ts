import { NextResponse } from "next/server";

const ALLOWED_TRANSLATIONS = new Set(["kjv", "asv", "web", "bbe"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ref = searchParams.get("ref");
  const translation = searchParams.get("translation") ?? "web";

  if (!ref) {
    return NextResponse.json(
      { error: "Missing Bible reference." },
      { status: 400 }
    );
  }

  if (translation === "esv") {
    const apiKey = process.env.ESV_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "ESV requires an API key. Set ESV_API_KEY on the server." },
        { status: 401 }
      );
    }

    const params = new URLSearchParams({
      q: ref,
      "include-verse-numbers": "true",
      "include-footnotes": "false",
      "include-headings": "false",
      "include-short-copyright": "true",
      "include-passage-references": "false",
      "indent-poetry": "false",
      "indent-paragraphs": "false",
      "line-length": "0",
    });

    const url = `https://api.esv.org/v3/passage/text/?${params.toString()}`;

    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Token ${apiKey}`,
        },
        cache: "no-store",
      });

      const raw = await response.text();
      let data: {
        passages?: string[];
        canonical?: string;
        copyright?: string;
        detail?: string;
        error?: string;
      } | null = null;

      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        return NextResponse.json(
          { error: data?.detail || data?.error || "Unable to load this chapter." },
          { status: response.status }
        );
      }

      const passages = Array.isArray(data?.passages) ? data?.passages : [];
      const text = passages.join("\n\n").trim();

      return NextResponse.json({
        reference: data?.canonical || ref,
        text,
        copyright: data?.copyright,
      });
    } catch {
      return NextResponse.json(
        { error: "Unable to load this chapter right now." },
        { status: 500 }
      );
    }
  }

  const safeTranslation = ALLOWED_TRANSLATIONS.has(translation)
    ? translation
    : "web";

  const url = `https://bible-api.com/${encodeURIComponent(
    ref
  )}?translation=${safeTranslation}&single_chapter_book_matching=indifferent`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    const data = await response.json();

    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Unable to load this chapter right now." },
      { status: 500 }
    );
  }
}
