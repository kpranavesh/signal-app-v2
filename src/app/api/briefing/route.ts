import "server-only";

import Parser from "rss-parser";
import { NextResponse } from "next/server";

type AIComfortLevel = "skeptic" | "beginner" | "active" | "power";

const parser = new Parser({
  timeout: 8000,
});

const FEEDS = [
  {
    id: "openai",
    url: "https://openai.com/news/rss.xml",
    topic: "Models & assistants",
  },
  {
    id: "anthropic",
    url: "https://anthropic.com/news/feed_anthropic.xml",
    topic: "Safety & Claude",
  },
  {
    id: "google-ai",
    url: "http://feeds.feedburner.com/blogspot/gJZg",
    topic: "Google AI & research",
  },
];

interface Article {
  id: string;
  title: string;
  link: string;
  source: string;
  published: string | null;
  topic: string;
  summary: string;
}

function normaliseText(input: string | undefined | null): string {
  if (!input) return "";
  return input.replace(/\s+/g, " ").trim();
}

function buildWhyItMatters(opts: {
  role: string;
  industry: string;
  comfort: AIComfortLevel;
  topic: string;
}) {
  const role = opts.role || "professional";
  const industry = opts.industry || "your industry";

  if (opts.topic.toLowerCase().includes("safety")) {
    return `As a ${role} in ${industry}, you don’t need to be an AI safety expert — but you do need a simple story for your team about how you’ll use AI without putting customers at risk.`;
  }

  if (opts.topic.toLowerCase().includes("research")) {
    return `Most research posts won’t change your week directly, but they signal where tools will be in 6–18 months so you can make calmer long‑term bets.`;
  }

  if (opts.topic.toLowerCase().includes("models")) {
    return `New model releases quietly change what’s realistic to automate in your role. Even skimming the highlights helps you spot “this used to be hard, now it’s a button.”`;
  }

  return `Your job is not to chase every headline, it’s to notice the 2–3 shifts that actually change how you work in ${industry} — and ignore the rest.`;
}

function buildComfortSummary(opts: {
  comfort: AIComfortLevel;
  base: string;
}) {
  const base = normaliseText(opts.base);
  if (!base) return "";

  if (opts.comfort === "skeptic") {
    return `${base} Think of this less as hype and more as a small, specific experiment you could run without committing your whole strategy.`;
  }

  if (opts.comfort === "beginner") {
    return `${base} If any jargon shows up when you read the full post, you can safely skip it — focus on the examples and screenshots.`;
  }

  if (opts.comfort === "active") {
    return `${base} The question for you is: does this meaningfully beat what you already use today, or is it just a sideways move?`;
  }

  return `${base} Read this like a changelog: what concrete new capability does this unlock for you or your team this quarter?`;
}

async function loadArticles(): Promise<Article[]> {
  const results = await Promise.all(
    FEEDS.map(async (feed) => {
      try {
        const parsed = await parser.parseURL(feed.url);
        return (parsed.items || []).slice(0, 15).map<Article>((item, index) => ({
          id: `${feed.id}-${item.guid || item.link || index}`,
          title: normaliseText(item.title || "Untitled"),
          link: item.link || "",
          source: feed.id,
          published: item.isoDate || item.pubDate || null,
          topic: feed.topic,
          summary:
            normaliseText(item.contentSnippet || item.content || item["content:encoded"]) ||
            "",
        }));
      } catch {
        return [];
      }
    }),
  );

  const flat = results.flat().filter((a) => a.link && a.title);

  flat.sort((a, b) => {
    if (a.published && b.published) {
      return new Date(b.published).getTime() - new Date(a.published).getTime();
    }
    return 0;
  });

  return flat.slice(0, 40);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || "";
  const industry = searchParams.get("industry") || "";
  const comfort = (searchParams.get("comfort") ||
    "beginner") as AIComfortLevel;

  const articles = await loadArticles();

  const items = articles.slice(0, 8).map((article) => ({
    id: article.id,
    title: article.title,
    topic: article.topic,
    source: article.source,
    link: article.link,
    published: article.published,
    comfortSummary: buildComfortSummary({
      comfort,
      base: article.summary || article.title,
    }),
    whyItMatters: buildWhyItMatters({
      role,
      industry,
      comfort,
      topic: article.topic,
    }),
  }));

  return NextResponse.json({ items });
}

