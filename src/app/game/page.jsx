"use client";

import React, { useState } from "react";
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
  const [currentLevel, setCurrentLevel] = useState(1);

  const handleLevelComplete = () => {
    if (currentLevel < levels.length) {
      setCurrentLevel((prev) => prev + 1);
    }
  };

  const CurrentLevel = levels[currentLevel - 1];

  return (
    <div className="w-screen">
      <CurrentLevel onComplete={handleLevelComplete} />
    </div>
  );
}
