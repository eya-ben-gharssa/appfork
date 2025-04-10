"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"
import Image from "next/image";


// Function to determine which emoji to display based on sentiment and confidence
const getMoodEmoji = (sentiment: string, confidence: number) => {
  if (sentiment === "Negative") {
    return confidence > 80 ? "😡" : "😞";
  } else if (sentiment === "Neutral") {
    return "😐";
  } else if (sentiment === "Positive") {
    return confidence > 80 ? "😄" : "🙂";
  }
  return "❓";
};

export default function Sidebar() {
  interface SentimentData {
    sentiment: string;
    confidence: number;
    score: number;
  }

  const [sentimentData, setSentimentData] = useState<SentimentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://127.0.0.1:8000/analyze-sentiment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: "I'm feeling good today!" }), // Replace with dynamic text if needed
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        setSentimentData(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch sentiment data:", err);
        setError("Failed to load sentiment analysis. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, []);

  return (
    <div className="w-64 h-screen flex flex-col justify-between bg-white border-r p-4">
      <div className="flex flex-col items-start space-y-4 mb-4">
        <Image
          src="/mood-componion.png"
          alt="Mood Companion"
          width={128}
          height={128}
          className="rounded-full"
        />
      </div>
      <div>
        {/* Sentiment Analysis Section */}
        <div className="my-4 p-3 rounded">
          {loading && <p className="text-sm text-gray-500">Loading sentiment data...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          {sentimentData && !loading && (
            <div className="text-sm">
              <div className="text-2xl mb-2 text-center">
                <p>Mood: {getMoodEmoji(sentimentData.sentiment, sentimentData.confidence)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout at the bottom */}
      <ul className="space-y-2">
        <li>
          <Button>
            <Link href="/signin" className="text-red-600 hover:underline">
            Logout
            </Link>
          </Button>
        </li>
      </ul>
    </div>
  );
}
