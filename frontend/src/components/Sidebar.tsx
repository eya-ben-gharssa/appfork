"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useChatContext } from '@/context/chatContext'



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

const getPointColor = (sentiment:string) => {
  switch (sentiment) {
    case 'Positive':
      return 'bg-green-500'; // Green for Positive
    case 'Neutral':
      return 'bg-yellow-500'; // Yellow for Neutral
    case 'Negative':
      return 'bg-red-500'; // Red for Negative
    default:
      return 'bg-gray-400'; // Default for Unknown sentiment
  }
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
  const { latestRequestId } = useChatContext()

  const fetchSentimentAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      const url = latestRequestId
        ? `http://127.0.0.1:8000/analyze-sentiment?request_id=${latestRequestId}`
        : 'http://127.0.0.1:8000/analyze-sentiment';
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Don't need to send a body when using request_id
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
  }, [latestRequestId]); // Dependency array goes here as second argument
  
  useEffect(() => {
    if (latestRequestId) {
      fetchSentimentAnalysis();
    }
  }, [latestRequestId, fetchSentimentAnalysis]); // Added fetchSentimentAnalysis to dependencies

  
  return (
    <div className="w-64 h-screen flex flex-col bg-gradient-to-b from-white via-blue-50 to-white border-r shadow-lg p-6 mr-4">
      {/* Top Logo Section */}
      <div className="flex flex-col items-center gap-2">
      <Image
        src="/mood-componion.png"
        alt="Mood Companion"
        width={128}
        height={128}
        className="rounded-full border-4 border-blue-200 shadow-md"
      />
      </div>

      {/* Middle: Sentiment Card */}
      <div className="flex-1 mt-16">
      <div className="bg-white shadow-md rounded-xl p-4 text-center hover:shadow-lg">
        <div className="flex items-center justify-center mb-2 gap-2">
        {/* Sentiment Indicator Point */}
        {/* "Your Mood" Text */}
        <h2 className="text-md font-semibold text-gray-700">Your Mood</h2>
        {sentimentData && (
          <div
            className={`w-4 h-4 rounded-full mr-2 ${getPointColor(sentimentData.sentiment)}`}
          ></div>
        )}
      </div>
        {loading && (
          <div className="flex justify-center items-center">
            <div className="w-6 h-6 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}
        {sentimentData && !loading && (
        <div className="text-4xl text-center">
          {getMoodEmoji(sentimentData.sentiment, sentimentData.confidence)}
        </div>
        )}
      </div>
      </div>

      {/* Bottom: Username */}
      <div className="text-center text-gray-600 font-medium">
      <span className="text-blue-400 font-bold">Ezzehi Nour</span>
      </div>
    </div>
  );
}
