"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

// Generate a random target number (3 digits, e.g., 105)
const generateTargetNumber = () => {
  return Math.floor(100 + Math.random() * 400); // 100-499
};

const Level6 = ({ onComplete }) => {
  const [inputValue, setInputValue] = useState("");
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  const [switches, setSwitches] = useState([false, false, false, false, false, false, false, false]);
  const [attempts, setAttempts] = useState([]);
  const { toast } = useToast();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      const num = generateTargetNumber();
      setTargetNumber(num);
      console.log("Target number:", num); // For debugging
    }
  }, []);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Binary Master! 🎯",
        description: `You recreated the number ${targetNumber}!`,
        variant: "success"
      });
      setTimeout(() => {
        onComplete(4);
      }, 2000);
    }
  }, [isSuccess, onComplete, toast, targetNumber]);

  const getCurrentBinary = () => {
    return switches.map(s => s ? 1 : 0).join("");
  };

  const getCurrentDecimal = () => {
    return parseInt(getCurrentBinary(), 2);
  };

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

    const toggleMatch = cmd.match(/^\/toggle\s+(\d)$/i);
    const checkMatch = cmd.match(/^\/check$/i);
    const resetMatch = cmd.match(/^\/reset$/i);
    const helpMatch = cmd.match(/^\/help$/i);

    if (toggleMatch) {
      const switchNum = parseInt(toggleMatch[1]);
      if (switchNum < 1 || switchNum > 8) {
        toast({
          title: "Invalid Switch",
          description: "Switch number must be between 1-8.",
          variant: "destructive"
      });
      } else {
        const newSwitches = [...switches];
        newSwitches[switchNum - 1] = !newSwitches[switchNum - 1];
        setSwitches(newSwitches);
        toast({
          title: `Switch ${switchNum} ${newSwitches[switchNum - 1] ? "ON" : "OFF"}`,
          description: `Current value: ${getCurrentDecimal()}`,
          variant: "default"
      });
      }
    } else if (checkMatch) {
      const currentValue = getCurrentDecimal();
      setAttempts([...attempts, currentValue]);
      
      if (currentValue === targetNumber) {
        setIsSuccess(true);
      } else {
        const diff = Math.abs(currentValue - targetNumber);
        let hint = "";
        if (currentValue < targetNumber) {
          hint = `Too low! Need ${diff} more.`;
        } else {
          hint = `Too high! Need to reduce by ${diff}.`;
        }
        toast({
          title: "Not Quite! ❌",
          description: hint,
          variant: "destructive"
      });
      }
    } else if (resetMatch) {
      setSwitches([false, false, false, false, false, false, false, false]);
      setAttempts([]);
      toast({
        title: "Switches Reset",
        description: "All bulbs turned off.",
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

  if (!targetNumber) return null;

  return (
    <div className="flex flex-col items-center mt-8 max-w-4xl mx-auto px-4">
      {/* Level title badge */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="px-6 py-3 text-xl font-bold text-[#2D1B4B] dark:text-[#1A0F2E] bg-gradient-to-r from-[#F9DC34] to-[#F5A623] rounded-full shadow-lg"
      >
        Level 6
      </motion.h1>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 text-center mb-6"
      >
        <p className="text-lg font-semibold text-purple-900 dark:text-[#F9DC34]">
          Binary Bulbs — Recreate the number: <span className="text-xl font-bold text-[#F9DC34]">{targetNumber}</span>
        </p>
        <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
          Use switches to control binary bulbs
        </p>
      </motion.div>

      {/* Bulb Display */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-gradient-to-b from-[#1a1a2e] to-[#0a0a1a] rounded-2xl p-8 shadow-xl border border-purple-700/30 w-full max-w-2xl"
      >
        <div className="grid grid-cols-8 gap-4 mb-6">
          {switches.map((isOn, idx) => {
            const power = 7 - idx;
            const value = Math.pow(2, power);
            return (
              <div key={idx} className="flex flex-col items-center">
                {/* Bulb */}
                <motion.div
                  animate={{
                    filter: isOn ? "drop-shadow(0 0 10px #FFD700)" : "none"
                  }}
                  className="relative"
                >
                  <svg width="50" height="70" viewBox="0 0 50 70">
                    {/* Bulb glow */}
                    {isOn && (
                      <circle
                        cx="25"
                        cy="25"
                        r="20"
                        fill="#FFD700"
                        opacity="0.3"
                        filter="blur(8px)"
                      />
                    )}
                    {/* Bulb glass */}
                    <ellipse
                      cx="25"
                      cy="25"
                      rx="15"
                      ry="20"
                      fill={isOn ? "#FFD700" : "#333"}
                      stroke="#666"
                      strokeWidth="2"
                    />
                    {/* Bulb base */}
                    <rect
                      x="20"
                      y="43"
                      width="10"
                      height="8"
                      fill="#444"
                      stroke="#666"
                      strokeWidth="1"
                    />
                    <rect
                      x="18"
                      y="51"
                      width="14"
                      height="4"
                      fill="#333"
                      stroke="#666"
                      strokeWidth="1"
                    />
                    {/* Light rays */}
                    {isOn && (
                      <>
                        <line x1="25" y1="10" x2="25" y2="2" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
                        <line x1="25" y1="40" x2="25" y2="48" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
                        <line x1="10" y1="25" x2="2" y2="25" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
                        <line x1="40" y1="25" x2="48" y2="25" stroke="#FFD700" strokeWidth="2" opacity="0.8" />
                      </>
                    )}
                  </svg>
                </motion.div>
                
                {/* Power value */}
                <div className="text-center mt-2">
                  <div className="text-xs text-purple-400 font-mono">2^{power}</div>
                  <div className="text-sm text-[#F9DC34] font-bold">{value}</div>
                </div>
                
                {/* Switch label */}
                <div className="text-[10px] text-purple-500 mt-1">SW{idx + 1}</div>
              </div>
            );
          })}
        </div>

        {/* Current value display */}
        <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-purple-400">Binary:</p>
              <p className="text-lg font-mono text-[#F9DC34] font-bold">{getCurrentBinary()}</p>
            </div>
            <div>
              <p className="text-xs text-purple-400">Decimal:</p>
              <p className="text-2xl font-bold text-[#F9DC34]">{getCurrentDecimal()}</p>
            </div>
            <div>
              <p className="text-xs text-purple-400">Target:</p>
              <p className="text-2xl font-bold text-green-400">{targetNumber}</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Attempts history */}
      {attempts.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-2xl mt-4 bg-purple-900/20 rounded-lg p-3 border border-purple-500/20"
        >
          <p className="text-xs text-purple-400 mb-2">Previous Attempts:</p>
          <div className="flex flex-wrap gap-2">
            {attempts.map((val, idx) => (
              <span key={idx} className="text-xs px-2 py-1 bg-purple-800/30 rounded-full text-purple-200">
                {val}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Help prompt */}
      {/* Sticky Command Panel */}
      <div className="sticky bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-[#1A0F2E] via-[#1A0F2E]/95 to-transparent backdrop-blur-sm border-t border-purple-500/20 py-4 mt-8">
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
            className="flex gap-2 w-full max-w-2xl"
          >
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleEnter}
          placeholder="Enter command... (e.g., /toggle 5)"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#2D1B4B] rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4"
          >
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-[#F9DC34]">
                Binary Bulbs Commands:
              </h2>
              <div className="space-y-2 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /toggle
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[1-8]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                    Toggle a switch ON/OFF. e.g., <code>/toggle 3</code>
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /check
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                    Check if your current value matches the target.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /reset
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                    Reset all switches to OFF.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /help
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">
                    Show this help menu.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                How It Works:
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                Each bulb represents a power of 2 in binary. When turned ON, its value is added to the total.
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                <strong>Example:</strong> If switches 1, 3, and 7 are ON:
                <br />
                128 + 32 + 2 = <strong>162</strong>
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm italic">
                Tip: Start with the largest values first!
              </p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/30 px-6 py-4 text-center">
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

export default Level6;
