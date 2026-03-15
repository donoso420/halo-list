"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
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
      "God asked Noah to build a big boat called an ark. Noah obeyed God even when it was really hard. Then God sent rain, and Noah, his family, and all the animals were safe inside. When the rain stopped, God put a rainbow in the sky as a promise that He would always love us.",
    verse: 'Genesis 6:22 — "Noah did everything just as God commanded him."',
    activity: "Draw a colorful rainbow. Write 3 promises you know God keeps.",
    image: "/kids-ark.svg",
    ref: "Genesis 6:9-22",
  },
  {
    id: "david",
    title: "David and Goliath",
    summary:
      "A giant named Goliath scared everyone — except a young boy named David. David trusted God and was not afraid. He picked up a small stone, used his sling, and with God's help the giant fell down! God can help us be brave even when things feel really big and scary.",
    verse: 'I Samuel 17:45 — "I come to you in the name of the Lord of Hosts."',
    activity: "Find 5 stones outside. On paper, write something big you trust God with.",
    image: "/kids-david.svg",
    ref: "1 Samuel 17:45-50",
  },
  {
    id: "daniel",
    title: "Daniel and the Lions",
    summary:
      "Daniel loved God and prayed every single day. Some people did not like this and threw Daniel into a den of hungry lions! But God sent an angel to shut the lions' mouths. Daniel was not hurt at all. God protects those who love and trust Him!",
    verse: 'Daniel 6:22 — "My God sent his angel and shut the lions\' mouths."',
    activity: "Draw Daniel safe in the lion's den. Write a thank-you prayer to God for protecting you.",
    image: "/kids-lion.svg",
    ref: "Daniel 6:16-23",
  },
  {
    id: "jonah",
    title: "Jonah and the Big Fish",
    summary:
      "God asked Jonah to go help a city, but Jonah ran away on a boat. A big storm came, and Jonah was swallowed by a giant fish! Inside the fish, Jonah prayed and said sorry to God. After three days, the fish spit Jonah onto the beach. Jonah obeyed God, and the city was saved. It is never too late to say sorry and do the right thing!",
    verse: 'Jonah 2:1 — "Then Jonah prayed to the Lord his God from inside the fish."',
    activity: "Draw a huge fish with Jonah inside. Write one thing you will obey God in this week.",
    image: "/kids-whale.svg",
    ref: "Jonah 1:17",
  },
  {
    id: "jesus-born",
    title: "Baby Jesus Is Born",
    summary:
      "God sent His Son Jesus to earth as a tiny baby. Mary and Joseph traveled to Bethlehem, but there was no room for them. Jesus was born in a stable with the animals. Angels sang in the sky, and shepherds and wise men came to visit. It was the most special birthday ever!",
    verse: 'Luke 2:11 — "A Savior has been born to you; he is the Messiah, the Lord."',
    activity: "Make a paper star. Hang it up to remember that Jesus came for everyone.",
    image: "/kids-star.svg",
    ref: "Luke 2:1-14",
  },
  {
    id: "loaves",
    title: "Jesus Feeds 5,000 People",
    summary:
      "A huge crowd was hungry and there was almost no food. A small boy shared his lunch — just 5 loaves of bread and 2 fish. Jesus took the food, said thank you to God, and broke it apart. Amazingly, everyone ate until they were full! There were even 12 baskets of leftovers. When we share what we have, God can do amazing things!",
    verse: 'John 6:11 — "Jesus gave thanks and distributed the food to those who were seated."',
    activity: "Pack a snack to share with a friend. Talk about how sharing shows God's love.",
    image: "/kids-loaves.svg",
    ref: "John 6:1-13",
  },
  {
    id: "zacchaeus",
    title: "Zacchaeus in the Tree",
    summary:
      "Zacchaeus was a short man who really wanted to see Jesus, but the crowd was in the way. So he climbed up a big tree! Jesus looked up, saw him, and said 'Come down — I want to come to your house today!' Zacchaeus was so happy he promised to give back money he had taken. Jesus loves everyone, even people who have made mistakes.",
    verse: 'Luke 19:9 — "Today salvation has come to this house."',
    activity: "Draw yourself in a tall tree. Write one way you will make things right with someone.",
    image: "/kids-tree.svg",
    ref: "Luke 19:1-10",
  },
  {
    id: "joseph",
    title: "Joseph's Colorful Coat",
    summary:
      "Joseph's father gave him a beautiful coat of many colors. His brothers were jealous and did mean things to him. Joseph had many hard days, but he never stopped trusting God. In the end, God used everything — even the painful parts — to help Joseph save many lives. God can turn hard situations into something good!",
    verse: 'Genesis 50:20 — "You intended to harm me, but God intended it for good."',
    activity: "Color a coat with as many colors as you can. Write the name of someone you will be extra kind to today.",
    image: "/kids-coat.svg",
    ref: "Genesis 37:3",
  },
  {
    id: "moses-sea",
    title: "Moses Parts the Red Sea",
    summary:
      "Moses led God's people out of Egypt, but they reached the Red Sea with no way across. The army was chasing them! God told Moses to stretch out his hand — and God parted the water to make a dry path right through the sea! Everyone walked through safely. Nothing is too hard for God!",
    verse: 'Exodus 14:21 — "The Lord drove the sea back by a strong east wind."',
    activity: "Fill a bowl with water and move your hand through it. Thank God for making a way when things seem impossible.",
    image: "/kids-waves.svg",
    ref: "Exodus 14:21-22",
  },
  {
    id: "creation",
    title: "God Made the World",
    summary:
      "In the very beginning there was nothing — then God spoke and everything came to be! He made light, the sky, the oceans, the land, the sun, the moon, the stars, all the animals, and finally people. God made you too, and everything He made is very good. Whenever you see something beautiful, remember — God made it, and He made you!",
    verse: 'Genesis 1:1 — "In the beginning God created the heavens and the earth."',
    activity: "Go outside and find 3 amazing things God made. Draw them and write why each one is wonderful.",
    image: "/kids-creation.svg",
    ref: "Genesis 1:1-5",
  },
  {
    id: "burning-bush",
    title: "Moses and the Burning Bush",
    summary:
      "Moses was watching sheep when he saw something incredible — a bush on fire that was not burning up! God spoke from the bush and called Moses by name. God gave Moses an important job: go free God's people. Even when Moses felt scared and not good enough, God said 'I will be with you.' God calls each of us for special things too.",
    verse: 'Exodus 3:4 — "God called to him from within the bush, \'Moses! Moses!\'"',
    activity: "With a grown-up, light a candle. Watch the flame and talk about how God speaks to us in amazing ways.",
    image: "/kids-fire.svg",
    ref: "Exodus 3:1-14",
  },
  {
    id: "good-shepherd",
    title: "The Good Shepherd",
    summary:
      "Jesus said He is like a shepherd who cares for every sheep. A good shepherd knows each sheep by name and goes out to find one if it gets lost. Jesus is our Good Shepherd — He knows your name, He loves you, and He will never leave you. You are never alone because Jesus is always with you.",
    verse: 'John 10:14 — "I am the good shepherd; I know my sheep and my sheep know me."',
    activity: "Draw a sheep with your name on it. Remember that Jesus knows your name and loves you every day.",
    image: "/kids-shepherd.svg",
    ref: "John 10:11-16",
  },
  {
    id: "love",
    title: "God's Big Love",
    summary:
      "The most important thing in the whole Bible is that God loves you! God loved the world so much that He sent His only Son Jesus for us. No matter what you do, no matter how you feel, nothing can separate you from God's love. His love is bigger than the sky, deeper than the ocean, and it lasts forever and ever.",
    verse: 'John 3:16 — "For God so loved the world that he gave his one and only Son."',
    activity: "Make a love card for someone in your family. On the back write: 'God loves you and so do I!'",
    image: "/kids-heart.svg",
    ref: "John 3:16",
  },
  {
    id: "memory",
    title: "Memory Verse Challenge",
    summary:
      "The Bible is full of verses that help us every day. When we remember God's Word it is like a light that guides us when things feel dark or confusing. This week's challenge: pick a verse, say it out loud, write it down, and try to remember it all week. You can do it — God will help you!",
    verse: 'Psalm 119:105 — "Your word is a lamp to my feet and a light to my path."',
    activity: "Write your favorite Bible verse on a card. Decorate it and put it somewhere you will see it every morning.",
    image: "/kids-book.svg",
    ref: "Psalm 119:105",
  },
  {
    id: "thankful",
    title: "A Thankful Heart",
    summary:
      "Every single day is a gift from God! The Bible tells us to be thankful in everything. When we wake up, when we eat, when we play, when we see something beautiful — we can say thank you to God. A thankful heart is a happy heart. Let's practice finding something to be grateful for every single day!",
    verse: 'Psalm 118:24 — "This is the day that the Lord has made; let us rejoice and be glad in it."',
    activity: "Start a thankfulness journal. Write or draw 3 things you are thankful for today. Do it again tomorrow!",
    image: "/kids-sun.svg",
    ref: "Psalm 118:24",
  },
];

function KidsPageInner() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get("story");
  const activeStory = useMemo(() => {
    const fallback = stories[0];
    if (!storyId) {
      return fallback;
    }
    return stories.find((item) => item.id === storyId) || fallback;
  }, [storyId]);
  const [translation, setTranslation] = useState("bbe"); // Bible in Basic English — simpler words for kids
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
              Back to reader
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
              All stories
            </p>
            <p className="mt-1 text-sm text-[#5a534b]">
              {stories.length} Bible stories — tap any one to read it!
            </p>
            <div className="mt-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {stories.map((story) => (
                <a
                  key={story.id}
                  href={`/kids?story=${story.id}`}
                  className={`rounded-[22px] bg-white/90 p-4 shadow-[0_16px_40px_rgba(62,54,41,0.12)] transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(62,54,41,0.18)] ${
                    activeStory.id === story.id
                      ? "ring-2 ring-[#b4894f]"
                      : ""
                  }`}
                >
                  <img
                    src={story.image}
                    alt={`${story.title} illustration`}
                    className="h-20 w-full rounded-2xl bg-white object-contain p-2"
                  />
                  <p className="mt-2 text-xs font-semibold text-[#2b241d] leading-snug">
                    {story.title}
                  </p>
                </a>
              ))}
            </div>
          </section>
        </div>
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
