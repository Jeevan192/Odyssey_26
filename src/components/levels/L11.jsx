"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../ui/use-toast";
import { useCommandHistory } from "@/hooks/useCommandHistory";import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";
// Fan directions: "center" (at player), "left" (toward paper), "right" (away)
const FAN_DIRS = ["left", "center", "right"];
const HIDDEN_CODE = "ODYSSEY";

const Level11 = ({ onComplete }) => {
  const [inputValue, setInputValue] = useState("");
  const { pushCommand, handleKeyDown: handleHistoryKeys } = useCommandHistory(setInputValue);
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [fanDir, setFanDir] = useState("center"); // starts facing the player
  const [fanOn, setFanOn] = useState(false);
  const [dustCleared, setDustCleared] = useState(false);
  const [fanRotation, setFanRotation] = useState(0); // for blade spin animation
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Paper Revealed! 📄✨",
        description: `The code was "${HIDDEN_CODE}". Door unlocked!`,
        variant: "success"
      });
      setTimeout(() => {
        onComplete(4);
      }, 2000);
    }
  }, [isSuccess, onComplete, toast]);

  // Blade spin animation
  useEffect(() => {
    let interval;
    if (fanOn) {
      interval = setInterval(() => {
        setFanRotation((r) => r + 30);
      }, 50);
    }
    return () => clearInterval(interval);
  }, [fanOn]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleEnter = (e) => {
    if (e.key === "Enter") {
      handleCommandSubmit();
    }
  };

  const handleCommandSubmit = () => {
    pushCommand(inputValue);
    const cmd = inputValue.trim().toLowerCase();

    const turnMatch = cmd.match(/^\/turn\s+fan\s+(left|right)$/i);
    const powerMatch = cmd.match(/^\/power\s+(on|off)$/i);
    const enterMatch = cmd.match(/^\/enter\s+(.+)$/i);
    const resetMatch = cmd.match(/^\/reset$/i);
    const helpMatch = cmd.match(/^\/help$/i);

    if (turnMatch) {
      const dir = turnMatch[1].toLowerCase();
      if (fanOn) {
        toast({
          title: "Turn off the fan first!",
          description: "You can't rotate the fan while it's running.",
          variant: "destructive"
        });
      } else {
        setFanDir(dir);
        toast({
          title: `Fan turned ${dir}`,
          description: `The fan now faces ${dir === "left" ? "toward the paper" : "away from the paper"}.`,
          variant: "default"
        });
      }
    } else if (powerMatch) {
      const state = powerMatch[1].toLowerCase();
      if (state === "on") {
        setFanOn(true);
        if (fanDir === "left" && !dustCleared) {
          // Blow dust away!
          setTimeout(() => {
            setDustCleared(true);
            toast({
              title: "💨 Dust blown away!",
              description: `A code is revealed on the paper: "${HIDDEN_CODE}". Use /enter to submit it!`,
              variant: "default"
            });
          }, 1200);
          toast({
            title: "Fan powered on! 💨",
            description: "The fan is blowing toward the paper...",
            variant: "default"
          });
        } else if (fanDir === "center") {
          toast({
            title: "Fan powered on! 💨",
            description: "The fan is blowing in your face... not very useful.",
            variant: "default"
          });
        } else {
          toast({
            title: "Fan powered on! 💨",
            description: "The fan is blowing to the right... away from the paper.",
            variant: "default"
          });
        }
      } else {
        setFanOn(false);
        toast({
          title: "Fan powered off",
          description: "The fan stops spinning.",
          variant: "default"
        });
      }
    } else if (enterMatch) {
      const guess = enterMatch[1].trim().toUpperCase();
      if (!dustCleared) {
        toast({
          title: "No code visible",
          description: "The paper is still covered in dust. Blow it away first!",
          variant: "destructive"
        });
      } else if (guess === HIDDEN_CODE) {
        setIsSuccess(true);
      } else {
        toast({
          title: "Wrong code ❌",
          description: `"${guess}" is not what the paper says. Look carefully!`,
          variant: "destructive"
        });
      }
    } else if (resetMatch) {
      setFanDir("center");
      setFanOn(false);
      setDustCleared(false);
      setIsSuccess(false);
      setFanRotation(0);
      toast({
        title: "Level Reset",
        description: "Everything restored. The paper is dusty again.",
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

  // Fan angle for SVG rotation
  const fanAngle = fanDir === "left" ? -45 : fanDir === "right" ? 45 : 0;

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
        The Directional Fan — Reveal the hidden code.
      </motion.p>

      {/* Scene */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-[#0a0a1a] dark:bg-[#0a0a1a] rounded-2xl p-4 shadow-lg border border-purple-700/30 w-full max-w-md relative overflow-hidden"
      >
        <svg viewBox="0 0 380 240" className="w-full">
          {/* Room background */}
          <rect x="0" y="0" width="380" height="240" fill="#0d0d1a" />

          {/* Wall pattern */}
          {[...Array(10)].map((_, i) => (
            <line key={`w${i}`} x1={0} y1={i * 25} x2={380} y2={i * 25} stroke="#141428" strokeWidth="0.5" />
          ))}

          {/* Desk surface */}
          <rect x="30" y="150" width="320" height="12" rx="3" fill="#5D4037" stroke="#4E342E" strokeWidth="1" />
          {/* Desk front */}
          <rect x="35" y="162" width="310" height="55" rx="4" fill="#4E342E" stroke="#3E2723" strokeWidth="1" />
          {/* Desk drawer lines */}
          <line x1="190" y1="165" x2="190" y2="215" stroke="#3E2723" strokeWidth="1" />
          <circle cx="130" cy="190" r="3" fill="#795548" />
          <circle cx="250" cy="190" r="3" fill="#795548" />

          {/* === PAPER (left side of desk) === */}
          <g>
            {/* Paper */}
            <rect x="55" y="115" width="100" height="38" rx="2" fill="#F5F5DC" stroke="#DDD" strokeWidth="0.5" />
            {/* Paper lines (the hidden code) */}
            {dustCleared && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <text x="105" y="140" textAnchor="middle" fontSize="16" fill="#1a1a2e" fontWeight="bold" fontFamily="monospace">
                  {HIDDEN_CODE}
                </text>
              </motion.g>
            )}
            {/* Dust overlay */}
            <AnimatePresence>
              {!dustCleared && (
                <motion.g
                  exit={{ opacity: 0, x: fanDir === "left" ? -80 : 0 }}
                  transition={{ duration: 1 }}
                >
                  {/* Dust particles */}
                  <rect x="55" y="115" width="100" height="38" rx="2" fill="#888888" opacity="0.7" />
                  <rect x="58" y="118" width="94" height="32" rx="2" fill="#999999" opacity="0.5" />
                  {/* Dust texture dots */}
                  {[...Array(20)].map((_, i) => (
                    <circle
                      key={`dust${i}`}
                      cx={60 + Math.random() * 88}
                      cy={118 + Math.random() * 28}
                      r={1 + Math.random() * 2}
                      fill="#AAAAAA"
                      opacity={0.3 + Math.random() * 0.4}
                    />
                  ))}
                  <text x="105" y="138" textAnchor="middle" fontSize="9" fill="#666" fontStyle="italic">
                    ~ dusty ~
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
            {/* Paper label */}
            <text x="105" y="112" textAnchor="middle" fontSize="9" fill="#8888AA">
              📄 PAPER
            </text>
          </g>

          {/* Wind lines when fan is on and pointing left */}
          {fanOn && fanDir === "left" && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <line x1="240" y1="125" x2="160" y2="125" stroke="#88BBFF" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="250" y1="135" x2="160" y2="135" stroke="#88BBFF" strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="240" y1="145" x2="160" y2="145" stroke="#88BBFF" strokeWidth="1" strokeDasharray="3 5" />
            </motion.g>
          )}

          {/* Wind lines when fan is on and pointing center (at player) */}
          {fanOn && fanDir === "center" && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <circle cx="280" cy="115" r="8" fill="none" stroke="#88BBFF" strokeWidth="0.5" opacity="0.3" />
              <circle cx="280" cy="115" r="16" fill="none" stroke="#88BBFF" strokeWidth="0.5" opacity="0.2" />
              <circle cx="280" cy="115" r="24" fill="none" stroke="#88BBFF" strokeWidth="0.5" opacity="0.1" />
            </motion.g>
          )}

          {/* Wind lines when fan is on and pointing right */}
          {fanOn && fanDir === "right" && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              <line x1="300" y1="125" x2="370" y2="125" stroke="#88BBFF" strokeWidth="1" strokeDasharray="4 6" />
              <line x1="290" y1="135" x2="370" y2="135" stroke="#88BBFF" strokeWidth="1.5" strokeDasharray="6 4" />
              <line x1="300" y1="145" x2="370" y2="145" stroke="#88BBFF" strokeWidth="1" strokeDasharray="3 5" />
            </motion.g>
          )}

          {/* === FAN (right side of desk) === */}
          <g>
            {/* Fan base */}
            <rect x="262" y="140" width="36" height="12" rx="3" fill="#37474F" stroke="#263238" strokeWidth="1" />
            {/* Fan stem */}
            <rect x="277" y="105" width="6" height="38" rx="2" fill="#455A64" />

            {/* Fan head (rotates based on direction) */}
            <motion.g
              animate={{ rotate: fanAngle }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{ originX: "280px", originY: "100px" }}
            >
              {/* Fan cage circle */}
              <circle cx="280" cy="100" r="22" fill="#263238" stroke="#37474F" strokeWidth="2" />
              {/* Fan blades */}
              <motion.g
                animate={{ rotate: fanOn ? fanRotation : 0 }}
                style={{ originX: "280px", originY: "100px" }}
              >
                <line x1="280" y1="82" x2="280" y2="118" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
                <line x1="262" y1="100" x2="298" y2="100" stroke="#78909C" strokeWidth="3" strokeLinecap="round" />
                <line x1="267" y1="87" x2="293" y2="113" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="293" y1="87" x2="267" y2="113" stroke="#78909C" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
              {/* Center hub */}
              <circle cx="280" cy="100" r="4" fill="#546E7A" />
            </motion.g>

            {/* Direction indicator */}
            <text x="280" y="92" textAnchor="middle" fontSize="7" fill="#90A4AE" fontWeight="bold">
            </text>
            {/* Fan label */}
            <text x="280" y="165" textAnchor="middle" fontSize="9" fill="#8888AA">
              🌀 FAN
            </text>
          </g>

          {/* Fan direction indicator */}
          <text x="280" y="75" textAnchor="middle" fontSize="9" fill="#90A4AE">
            {fanDir === "left" ? "← facing paper" : fanDir === "right" ? "facing right →" : "↑ facing you"}
          </text>

          {/* Power status */}
          <g>
            <circle cx="330" cy="80" r="6" fill={fanOn ? "#22c55e" : "#333"} stroke="#555" strokeWidth="1" />
            <text x="345" y="84" fontSize="9" fill={fanOn ? "#22c55e" : "#666"}>
              {fanOn ? "ON" : "OFF"}
            </text>
          </g>

          {/* Floor */}
          <rect x="0" y="220" width="380" height="20" fill="#111122" />

          {/* Scene title */}
          <text x="190" y="18" textAnchor="middle" fontSize="10" fill="#555577" fontWeight="bold">
            THE DIRECTIONAL FAN
          </text>
        </svg>
      </motion.div>



      {/* Sticky Command Panel */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-purple-50/95 via-purple-50/90 to-transparent dark:from-[#1A0F2E] dark:via-[#1A0F2E]/95 dark:to-transparent backdrop-blur-sm border-t border-purple-300/30 dark:border-purple-500/20 py-4 mt-8">
        <div className="flex flex-col items-center gap-3 max-w-4xl mx-auto px-4">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="text-sm text-center cursor-pointer text-purple-700 dark:text-purple-300 hover:text-[#F5A623] dark:hover:text-[#F9DC34] transition-colors"
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
              onKeyDown={(e) => { handleEnter(e); handleHistoryKeys(e); }}
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
        </div>
      </div>

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
                    /theme
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[dark/light]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Switch between dark and light themes.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /turn fan
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[left/right]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Turn the fan to face left (toward paper) or right (away).
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /power
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[on/off]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Turn the fan on or off.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /enter
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[code]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Enter the code revealed on the paper.
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
                Hint:
              </h3>
              <p className="text-gray-600 dark:text-gray-300 italic">
                Breath reveals what the earth has hidden.
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

export default Level11;