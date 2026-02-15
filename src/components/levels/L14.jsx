"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

const PASSWORD = "unlock";
const MAX_BRIGHTNESS = 5;

const Level14 = ({ onComplete }) => {
  const [inputValue, setInputValue] = useState("");
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [brightness, setBrightness] = useState(0); // 0 = black, 5 = full
  const [hasLooked, setHasLooked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Access Granted! 🔓",
        description: "The password was \"unlock\"!",
        variant: "success"
      });
      setTimeout(() => {
        onComplete(4);
      }, 2000);
    }
  }, [isSuccess, onComplete, toast]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleCommandSubmit();
    }
  };

  const handleCommandSubmit = () => {
    const cmd = inputValue.trim().toLowerCase();

    const increaseBright = cmd.match(/^\/increase\s+brightness$/i);
    const decreaseBright = cmd.match(/^\/decrease\s+brightness$/i);
    const lookMatch = cmd.match(/^\/look$/i);
    const enterMatch = cmd.match(/^\/enter\s+(.+)$/i);
    const resetMatch = cmd.match(/^\/reset$/i);
    const helpMatch = cmd.match(/^\/help$/i);

    if (increaseBright) {
      if (brightness >= MAX_BRIGHTNESS) {
        toast({
          title: "Max brightness!",
          description: "The screen is already at full brightness.",
          variant: "default"
      });
      } else {
        setBrightness((b) => b + 1);
        setHasLooked(false);
        toast({
          title: `Brightness: ${brightness + 1}/${MAX_BRIGHTNESS} ☀️`,
          description: brightness + 1 >= 3 ? "The screen is getting readable..." : "Still quite dim...",
          variant: "default"
      });
      }
    } else if (decreaseBright) {
      if (brightness <= 0) {
        toast({
          title: "Already off!",
          description: "The screen can't get any darker.",
          variant: "default"
      });
      } else {
        setBrightness((b) => b - 1);
        setHasLooked(false);
        toast({
          title: `Brightness: ${brightness - 1}/${MAX_BRIGHTNESS}`,
          description: "The screen dims...",
          variant: "default"
      });
      }
    } else if (lookMatch) {
      setHasLooked(true);
      if (brightness === 0) {
        toast({
          title: "Too dark! 🌑",
          description: "You can't see anything. The screen is completely black.",
          variant: "destructive"
      });
      } else if (brightness <= 2) {
        toast({
          title: "Barely visible... 👀",
          description: "You can make out a faint message but can't read it clearly.",
          variant: "default"
      });
      } else {
        toast({
          title: "You can see the password! 👁️",
          description: "The screen reads: \"unlock\"",
          variant: "default"
      });
      }
    } else if (enterMatch) {
      const guess = enterMatch[1].trim().toLowerCase();
      if (guess === PASSWORD) {
        setIsSuccess(true);
      } else {
        toast({
          title: "Wrong password ❌",
          description: brightness < 3
            ? "Can you even read what's on screen?"
            : `"${guess}" is incorrect. Look at the screen carefully.`,
          variant: "destructive"
      });
      }
    } else if (resetMatch) {
      setBrightness(0);
      setHasLooked(false);
      setIsSuccess(false);
      toast({
        title: "Level Reset",
        description: "Screen returned to black.",
        variant: "default"
      });
    } else if (helpMatch) {
      setHelpModalOpen(true);
    } else {
      toast({
        title: "Unknown Command",
        description: "Type /help to see available commands",
        variant: "destructive"
      });
    }

    setInputValue("");
  };

  const closeHelpModal = () => {
    setHelpModalOpen(false);
  };

  // Visual brightness: 0 = fully black, 5 = fully visible
  const screenOpacity = brightness / MAX_BRIGHTNESS;
  const bgBrightness = Math.round(10 + (brightness / MAX_BRIGHTNESS) * 30); // 10 to 40

  return (
    <div className="flex flex-col items-center mt-8 max-w-4xl mx-auto px-4">
      {/* Level title badge - now in sticky header */}

      {/* Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 text-xl font-semibold mb-4 text-center text-purple-900 dark:text-[#F9DC34]"
      >
        The Brightness Lock — Find the password.
      </motion.p>

      {/* Monitor */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-md relative"
      >
        {/* Monitor bezel */}
        <div className="bg-[#1a1a2e] rounded-2xl p-3 border border-[#333] shadow-lg">
          {/* Screen */}
          <motion.div
            animate={{
              backgroundColor: `rgb(${bgBrightness}, ${bgBrightness}, ${bgBrightness + 10})`,
            }}
            transition={{ duration: 0.6 }}
            className="rounded-lg relative overflow-hidden"
            style={{ minHeight: 220 }}
          >
            {/* Scanlines effect */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)",
              }}
            />

            {/* Screen content */}
            <div className="relative z-0 flex flex-col items-center justify-center h-full p-6" style={{ minHeight: 220 }}>
              {/* Faint hint message (always very faintly visible at bottom) */}
              <motion.p
                animate={{ opacity: 0.03 + screenOpacity * 0.3 }}
                transition={{ duration: 0.5 }}
                className="text-xs text-center mb-6 font-mono"
                style={{ color: `rgba(200, 200, 200, ${0.05 + screenOpacity * 0.6})` }}
              >
                Password visible on screen.
              </motion.p>

              {/* Password display area */}
              <div className="relative mb-4">
                {/* Password - visibility depends on brightness */}
                <motion.div
                  animate={{ opacity: screenOpacity }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <p
                    className="text-4xl font-bold font-mono tracking-widest"
                    style={{
                      color: `rgba(74, 222, 128, ${screenOpacity})`,
                      textShadow: brightness >= 3
                        ? "0 0 10px rgba(74, 222, 128, 0.5)"
                        : "none",
                    }}
                  >
                    {brightness >= 3 ? "unlock" : brightness >= 1 ? "██████" : ""}
                  </p>
                </motion.div>
              </div>

              {/* Input field visual on screen */}
              <motion.div
                animate={{ opacity: 0.05 + screenOpacity * 0.8 }}
                transition={{ duration: 0.5 }}
                className="w-48 border rounded px-3 py-1.5 text-center font-mono text-sm"
                style={{
                  borderColor: `rgba(120, 120, 180, ${0.1 + screenOpacity * 0.5})`,
                  color: `rgba(200, 200, 220, ${screenOpacity * 0.8})`,
                  backgroundColor: `rgba(0, 0, 0, 0.3)`,
                }}
              >
                Enter password...
              </motion.div>

              {/* Look result overlay */}
              {hasLooked && brightness >= 3 && (
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: screenOpacity * 0.8 }}
                  className="mt-3 text-xs font-mono"
                  style={{ color: `rgba(249, 220, 52, ${screenOpacity * 0.9})` }}
                >
                  👁️ The password is &quot;unlock&quot;
                </motion.p>
              )}
              {hasLooked && brightness > 0 && brightness < 3 && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  className="mt-3 text-xs font-mono text-gray-500"
                >
                  ... too dim to read clearly ...
                </motion.p>
              )}
            </div>

            {/* Brightness indicator on screen */}
            <div className="absolute bottom-2 right-3 flex gap-0.5 z-20">
              {Array.from({ length: MAX_BRIGHTNESS }, (_, i) => (
                <div
                  key={i}
                  className="w-2 h-3 rounded-sm"
                  style={{
                    backgroundColor: i < brightness
                      ? `rgba(249, 220, 52, ${0.3 + (brightness / MAX_BRIGHTNESS) * 0.7})`
                      : `rgba(60, 60, 80, ${0.1 + screenOpacity * 0.3})`,
                  }}
                />
              ))}
            </div>

            {/* Power LED */}
            <div className="absolute bottom-2 left-3 z-20">
              <div
                className="w-2 h-2 rounded-full"
                style={{
                  backgroundColor: brightness > 0 ? "#22c55e" : "#333",
                  boxShadow: brightness > 0 ? "0 0 4px #22c55e" : "none",
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Monitor stand */}
        <div className="flex justify-center mt-1">
          <div className="w-16 h-3 bg-[#333] rounded-t-sm" />
        </div>
        <div className="flex justify-center">
          <div className="w-28 h-2 bg-[#2a2a3a] rounded-b-lg" />
        </div>
      </motion.div>

      {/* Brightness bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-md mt-4 flex items-center justify-center gap-3"
      >
        <span className="text-sm text-gray-400">🌑</span>
        <div className="flex-1 h-2 bg-[#1a1a2e] rounded-full overflow-hidden border border-purple-700/30">
          <motion.div
            animate={{ width: `${(brightness / MAX_BRIGHTNESS) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(to right, #F5A623, #F9DC34)",
            }}
          />
        </div>
        <span className="text-sm text-gray-400">☀️</span>
        <span className="text-xs text-gray-500 font-mono w-10 text-right">{brightness}/{MAX_BRIGHTNESS}</span>
      </motion.div>

      {/* Help prompt */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mx-10 my-6 text-center cursor-pointer text-purple-700 dark:text-purple-300 hover:text-[#F5A623] dark:hover:text-[#F9DC34] transition-colors"
        onClick={() => setHelpModalOpen(true)}
      >
        Type{" "}
        <span className="font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
          /help
        </span>{" "}
        to get commands and hints
      </motion.span>

      {/* Command input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex gap-2 w-full max-w-md"
      >
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleEnter}
          placeholder="Enter command..."
          className="border-purple-300 dark:border-purple-600/50 bg-white dark:bg-[#1A0F2E]/70 shadow-inner focus:ring-[#F5A623] focus:border-[#F9DC34]"
        />
        <button
          onClick={handleCommandSubmit}
          className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] p-2 rounded-lg shadow-md transition-transform hover:scale-105"
        >
          <Image
            src="/runcode.png"
            alt="Run"
            height={20}
            width={20}
            className="rounded-sm"
          />
        </button>
      </motion.div>

      {/* Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D1B4B] rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4 max-h-[80vh] flex flex-col"
          >
            <div className="p-6 overflow-y-auto flex-grow">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-[#F9DC34]">
                Available Commands:
              </h2>
              <div className="space-y-1 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /increase brightness
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Turn up the screen brightness by one level.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /decrease brightness
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Turn down the screen brightness by one level.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /look
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Look carefully at the screen to read what's displayed.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /enter
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[word]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Enter the password you see on screen.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /reset
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Reset the level.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /help
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Show commands and hints.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                Setup:
              </h3>
              <div className="space-y-1 mb-4 text-gray-600 dark:text-gray-300 text-sm">
                <p>• The monitor is completely <strong>black</strong>.</p>
                <p>• A message faintly says: <em>"Password visible on screen."</em></p>
                <p>• You can barely see anything.</p>
              </div>

              <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                Hint:
              </h3>
              <p className="text-gray-600 dark:text-gray-300 italic">
                If you can't see the password… the problem isn't the password.
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 px-6 py-4 text-center flex-shrink-0">
              <button
                onClick={closeHelpModal}
                className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] px-6 py-2 rounded-lg text-purple-900 font-medium shadow-md transition-transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Level14;