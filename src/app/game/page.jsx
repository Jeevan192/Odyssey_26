
"use client";

import React, { useState } from "react";
import Link from "next/link";
import Level1 from "@/components/levels/L1";
import Level2 from "@/components/levels/L2";
import Level3 from "@/components/levels/L3";
import Level4 from "@/components/levels/L4";
import Level5 from "@/components/levels/L5";
import Level6 from "@/components/levels/L6";
import Level7 from "@/components/levels/L7";
import Level8 from "@/components/levels/L8";
import Level9 from "@/components/levels/L9";
import Level10 from "@/components/levels/L10";
import Level11 from "@/components/levels/L11";
import Level12 from "@/components/levels/L12";
import Level13 from "@/components/levels/L13";
import Level14 from "@/components/levels/L14";
import Level15 from "@/components/levels/L15";

const levels = [
  Level1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6,
  Level7,
  Level8,
  Level9,
  Level10,
  Level11,
  Level12,
  Level13,
  Level14,
  Level15,
];

export default function Game() {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(0); // index for the grid selection

  const handleLevelComplete = () => {
    if (currentLevelIndex !== null && currentLevelIndex < levels.length - 1) {
      setCurrentLevelIndex(currentLevelIndex + 1);
    } else {
      setCurrentLevelIndex(null);
    }
  };

  // Playing a level
  if (currentLevelIndex !== null) {
    const CurrentLevel = levels[currentLevelIndex];
    return (
      <div className="fixed inset-0 z-[60] bg-gradient-to-b from-[#2D1B4B] to-[#1A0F2E] overflow-y-auto">
        <div className="sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-[#2D1B4B]/90 to-[#3D2060]/90 border-b border-purple-400/20 shadow-lg">
          <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
            <button
              className="px-5 py-2.5 rounded-lg font-bold text-purple-900 bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] transition-all shadow-lg"
              onClick={() => setCurrentLevelIndex(null)}
            >
              ← Back
            </button>
            <h1 className="px-6 py-2 text-xl font-bold text-[#2D1B4B] dark:text-[#1A0F2E] bg-gradient-to-r from-[#F9DC34] to-[#F5A623] rounded-full shadow-lg">
              Level {currentLevelIndex + 1}
            </h1>
            <Link href="/" className="flex items-center">
              <span className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F9DC34] to-[#F5A623]">
                Odyssey
              </span>
            </Link>
          </div>
        </div>
        <CurrentLevel onComplete={handleLevelComplete} />
      </div>
    );
  }

  // Level selection grid
  return (
    <div className="w-screen min-h-screen bg-gradient-to-b from-[#2D1B4B] to-[#1A0F2E] flex flex-col items-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,25 C20,10 50,40 80,5 L100,25 L100,100 L0,100 Z"
              fill="rgba(237, 139, 255, 0.4)"
            />
            <path
              d="M0,50 C30,35 70,65 100,40 L100,100 L0,100 Z"
              fill="rgba(138, 43, 226, 0.3)"
            />
          </svg>
        </div>
      </div>

      {/* Back button */}
      <div className="w-full max-w-2xl px-6 pt-6 z-10">
        <Link href="/">
          <button className="px-5 py-2.5 rounded-lg font-bold text-purple-900 bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] transition-all shadow-lg text-sm">
            ← Back
          </button>
        </Link>
      </div>

      {/* Title */}
      <div className="text-center mt-4 mb-6 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F9DC34] to-[#F5A623]">
          The Odyssey
        </h1>
        <p className="text-purple-200/80 mt-2 text-base">Select a level to play</p>
      </div>

      {/* Level grid */}
      <div className="w-full max-w-2xl px-6 z-10">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-5 border border-purple-300/20 shadow-xl">
          <div className="grid grid-cols-6 gap-2.5">
            {levels.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedLevel(index)}
                className={`
                  aspect-square rounded-xl font-bold text-lg md:text-xl flex items-center justify-center
                  transition-all duration-200 cursor-pointer border-2
                  ${selectedLevel === index
                    ? "bg-gradient-to-br from-[#F9DC34] to-[#F5A623] text-purple-900 border-[#F9DC34] shadow-lg shadow-yellow-500/30 scale-105"
                    : "bg-purple-700/60 text-[#F9DC34] border-purple-500/40 hover:bg-purple-600/70 hover:border-purple-400/60 hover:scale-105"
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Level detail panel */}
      <div className="w-full max-w-2xl px-6 mt-5 z-10">
        <div className="backdrop-blur-md bg-white/5 rounded-2xl p-6 border border-purple-300/20 shadow-xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#F9DC34] mb-1">
            Level {selectedLevel + 1}
          </h2>
          <p className="text-purple-200/70 text-sm mb-5">
            The Odyssey – Level {selectedLevel + 1} of {levels.length}
          </p>
          <button
            onClick={() => setCurrentLevelIndex(selectedLevel)}
            className="w-full py-3.5 rounded-xl font-bold text-lg text-purple-900 bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] transition-all shadow-lg shadow-yellow-500/20 transform hover:scale-[1.02]"
          >
            Play Level {selectedLevel + 1}
          </button>
        </div>
      </div>

      {/* Previous / Next buttons */}
      <div className="w-full max-w-2xl px-6 mt-4 mb-8 z-10 grid grid-cols-2 gap-3">
        <button
          onClick={() => setSelectedLevel((prev) => Math.max(0, prev - 1))}
          disabled={selectedLevel === 0}
          className={`
            py-3 rounded-xl font-bold text-base transition-all border-2
            ${selectedLevel === 0
              ? "bg-purple-900/30 text-purple-400/40 border-purple-700/30 cursor-not-allowed"
              : "bg-purple-700/50 text-purple-100 border-purple-500/40 hover:bg-purple-600/60 hover:border-purple-400/50 cursor-pointer"
            }
          `}
        >
          ← Previous Level
        </button>
        <button
          onClick={() => setSelectedLevel((prev) => Math.min(levels.length - 1, prev + 1))}
          disabled={selectedLevel === levels.length - 1}
          className={`
            py-3 rounded-xl font-bold text-base transition-all border-2
            ${selectedLevel === levels.length - 1
              ? "bg-purple-900/30 text-purple-400/40 border-purple-700/30 cursor-not-allowed"
              : "bg-purple-700/50 text-purple-100 border-purple-500/40 hover:bg-purple-600/60 hover:border-purple-400/50 cursor-pointer"
            }
          `}
        >
          Next Level →
        </button>
      </div>
    </div>
  );
}
