"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

const CORRECT_ANSWERS = ["hollywood sign", "the hollywood sign", "hollywood"];

const Level18 = ({ onComplete }) => {
    const [inputValue, setInputValue] = useState("");
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [located, setLocated] = useState(false);
    const [hintUsed, setHintUsed] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Landmark Identified! 🏔️",
                description: "The Hollywood Sign — Los Angeles, California!",
                variant: "success",
                className:
                    "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white opacity-100 border-0 shadow-lg",
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

        const locateMatch = cmd.match(/^\/locate$/i);
        const submitMatch = cmd.match(/^\/submit\s+(.+)$/i);
        const hintMatch = cmd.match(/^\/hint$/i);
        const resetMatch = cmd.match(/^\/reset$/i);
        const helpMatch = cmd.match(/^\/help$/i);

        if (locateMatch) {
            setLocated(true);
            toast({
                title: "📍 Location traced!",
                description: "Visual data recovered. An image has appeared on screen.",
                variant: "default",
                className:
                    "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
            });
        } else if (submitMatch) {
            const guess = submitMatch[1].trim().toLowerCase();
            if (CORRECT_ANSWERS.includes(guess)) {
                setIsSuccess(true);
            } else {
                toast({
                    title: "Incorrect ❌",
                    description: `"${submitMatch[1].trim()}" is not the landmark. Use the coordinates and image.`,
                    variant: "destructive",
                    className:
                        "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white opacity-100 shadow-lg",
                });
            }
        } else if (hintMatch) {
            setHintUsed(true);
            toast({
                title: "Hint 💡",
                description: "This famous landmark sits on a hillside in Los Angeles and is made of giant white letters.",
                variant: "default",
                className:
                    "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
            });
        } else if (resetMatch) {
            setLocated(false);
            setHintUsed(false);
            setIsSuccess(false);
            toast({
                title: "Level Reset",
                description: "Transmission data restored.",
                variant: "default",
                className:
                    "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
            });
        } else if (helpMatch) {
            setHelpModalOpen(true);
        } else {
            toast({
                title: "Unknown Command",
                description: "Type /help to see available commands",
                variant: "destructive",
                className:
                    "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white opacity-100 shadow-lg",
            });
        }

        setInputValue("");
    };

    const closeHelpModal = () => {
        setHelpModalOpen(false);
    };

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
                The Landmark Trace — Identify the landmark.
            </motion.p>

            {/* Terminal / GPS Display */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="bg-[#1a1a2e] rounded-xl p-3 border border-[#333] shadow-lg">
                    {/* Terminal bar */}
                    <div className="flex items-center justify-between bg-[#111] rounded-t-lg px-3 py-1.5 border-b border-[#222]">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#F9DC34]" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]" />
                        </div>
                        <span className="text-[10px] text-[#555] font-mono">GPS RECOVERY TERMINAL</span>
                        <span className="text-[10px] text-[#ef4444] font-mono animate-pulse">● LIVE</span>
                    </div>

                    {/* Terminal content */}
                    <div className="bg-[#0a0a12] rounded-b-lg p-4 font-mono text-sm">
                        {/* Header */}
                        <p className="text-[#4ADE80] text-xs mb-3">
                            ▸ RECOVERED GPS TRANSMISSION
                        </p>
                        <div className="border border-[#333] rounded-lg p-4 mb-3 bg-[#0d0d1a]">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-[#ef4444] animate-pulse">📡</span>
                                <span className="text-gray-500 text-xs">Signal Status: DECODED</span>
                            </div>

                            {/* Coordinates */}
                            <div className="space-y-2">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-gray-500 text-xs w-10">LAT:</span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.6 }}
                                        className="text-[#F9DC34] text-lg font-bold tracking-wider"
                                    >
                                        34.1341° N
                                    </motion.span>
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-gray-500 text-xs w-10">LON:</span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.5, delay: 0.8 }}
                                        className="text-[#F9DC34] text-lg font-bold tracking-wider"
                                    >
                                        118.3215° W
                                    </motion.span>
                                </div>
                            </div>
                        </div>

                        {/* Locate instruction */}
                        {!located && (
                            <p className="text-gray-500 text-xs">
                                Use <span className="text-purple-400">/locate</span> to trace the signal and retrieve visual data.
                            </p>
                        )}

                        {/* Image area (shown after /locate) */}
                        {located && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <p className="text-[#4ADE80] text-xs mb-2">▸ VISUAL DATA RECOVERED</p>
                                <div className="border border-[#333] rounded-lg overflow-hidden bg-[#0d0d1a]">
                                    {/* SVG illustration of Hollywood Sign */}
                                    <svg viewBox="0 0 380 180" className="w-full">
                                        {/* Sky gradient */}
                                        <defs>
                                            <linearGradient id="sky18" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#1a237e" />
                                                <stop offset="50%" stopColor="#3949ab" />
                                                <stop offset="100%" stopColor="#7986cb" />
                                            </linearGradient>
                                        </defs>
                                        <rect x="0" y="0" width="380" height="180" fill="url(#sky18)" />

                                        {/* Hills/mountains */}
                                        <polygon points="0,130 50,95 100,110 160,80 220,100 280,75 340,95 380,85 380,180 0,180" fill="#2E7D32" opacity="0.3" />
                                        <polygon points="0,140 40,120 90,130 140,105 200,115 250,95 310,110 350,100 380,110 380,180 0,180" fill="#388E3C" opacity="0.5" />
                                        <polygon points="0,155 60,135 120,145 180,125 240,140 300,120 350,135 380,130 380,180 0,180" fill="#43A047" opacity="0.7" />

                                        {/* Hollywood Sign letters */}
                                        {["H", "O", "L", "L", "Y", "W", "O", "O", "D"].map((letter, i) => {
                                            const x = 60 + i * 30;
                                            const y = 120 + Math.sin(i * 0.5) * 5;
                                            return (
                                                <text
                                                    key={`hl${i}`}
                                                    x={x}
                                                    y={y}
                                                    textAnchor="middle"
                                                    fontSize="28"
                                                    fill="white"
                                                    fontWeight="bold"
                                                    fontFamily="serif"
                                                    opacity="0.95"
                                                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                                                >
                                                    {letter}
                                                </text>
                                            );
                                        })}

                                        {/* Ground */}
                                        <polygon points="0,155 380,145 380,180 0,180" fill="#33691E" opacity="0.6" />

                                        {/* Scan lines overlay */}
                                        {[...Array(18)].map((_, i) => (
                                            <line key={`sl${i}`} x1={0} y1={i * 10} x2={380} y2={i * 10} stroke="#000" strokeWidth="0.3" opacity="0.15" />
                                        ))}

                                        {/* Image label */}
                                        <rect x="5" y="5" width="100" height="14" rx="3" fill="#000" opacity="0.5" />
                                        <text x="55" y="15" textAnchor="middle" fontSize="7" fill="#4ADE80" fontFamily="monospace">
                                            📸 SAT IMAGE — LA
                                        </text>
                                    </svg>
                                </div>
                                <p className="text-gray-500 text-xs mt-2">
                                    Use <span className="text-purple-400">/submit [landmark name]</span> to identify it.
                                </p>
                            </motion.div>
                        )}

                        {/* Hint display */}
                        {hintUsed && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-3 bg-[#1a1a2e] border border-[#F9DC34]/30 rounded p-2"
                            >
                                <p className="text-[#F9DC34] text-xs">
                                    💡 This famous landmark sits on a hillside in Los Angeles and is made of giant white letters.
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Status bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-md mt-3 flex justify-center gap-3"
            >
                <div className="text-xs px-3 py-1 rounded-full border bg-green-500/20 text-green-400 border-green-500/40">
                    📡 Signal Decoded
                </div>
                <div className={`text-xs px-3 py-1 rounded-full border ${located
                        ? "bg-green-500/20 text-green-400 border-green-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>
                    📸 {located ? "Image Retrieved" : "No Image"}
                </div>
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
                                        /locate
                                    </span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Trace the GPS signal and retrieve visual data.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /submit
                                    </span>{" "}
                                    <span className="text-blue-600 dark:text-blue-300">[landmark name]</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Submit the name of the identified landmark.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /hint
                                    </span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Get a hint about the landmark.
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
                                <p>• A recovered GPS transmission shows coordinates.</p>
                                <p>• Use external tools or your knowledge to investigate.</p>
                                <p>• Use <strong>/locate</strong> to retrieve a satellite image.</p>
                                <p>• Identify the landmark and <strong>/submit</strong> its name.</p>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                                Hint:
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 italic">
                                The coordinates point to a famous location in Los Angeles, California.
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

export default Level18;
