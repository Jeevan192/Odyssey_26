"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

const HIDDEN_WORD = "ESCAPE";

const Level16 = ({ onComplete }) => {
    const [inputValue, setInputValue] = useState("");
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [inverted, setInverted] = useState(false);
    const [inspected, setInspected] = useState(false);
    const [messageRead, setMessageRead] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Correct! 🖼️✨",
                description: `The hidden word was "${HIDDEN_WORD}"!`,
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

        const inspectMatch = cmd.match(/^\/inspect\s+image$/i);
        const invertMatch = cmd.match(/^\/invert\s+colors$/i);
        const readMatch = cmd.match(/^\/read\s+message$/i);
        const enterMatch = cmd.match(/^\/enter\s+(.+)$/i);
        const resetMatch = cmd.match(/^\/reset$/i);
        const helpMatch = cmd.match(/^\/help$/i);

        if (inspectMatch) {
            setInspected(true);
            if (!inverted) {
                toast({
                    title: "Inspecting the image... 🔍",
                    description: "A plain brick wall. Nothing visible... but the texture looks slightly uneven in places. Something might be hidden.",
                    variant: "default"
      });
            } else {
                toast({
                    title: "Inspecting the inverted image... 🔍",
                    description: "With colors inverted, you can clearly see letters formed in the wall pattern!",
                    variant: "default"
      });
            }
        } else if (invertMatch) {
            setInverted((prev) => !prev);
            toast({
                title: !inverted ? "Colors Inverted! 🎨" : "Colors Restored",
                description: !inverted
                    ? "The image flips to negative. New details appear..."
                    : "Back to the original image.",
                variant: "default"
      });
        } else if (readMatch) {
            if (!inverted) {
                toast({
                    title: "No message visible",
                    description: "You squint at the wall but can't make out any text...",
                    variant: "destructive"
      });
            } else {
                setMessageRead(true);
                toast({
                    title: "Message Revealed! 👁️",
                    description: `The inverted image reveals the word: "${HIDDEN_WORD}"`,
                    variant: "default"
      });
            }
        } else if (enterMatch) {
            const guess = enterMatch[1].trim().toUpperCase();
            if (guess === HIDDEN_WORD) {
                setIsSuccess(true);
            } else {
                toast({
                    title: "Wrong word ❌",
                    description: `"${guess}" is not correct. Look at the image more carefully.`,
                    variant: "destructive"
      });
            }
        } else if (resetMatch) {
            setInverted(false);
            setInspected(false);
            setMessageRead(false);
            setIsSuccess(false);
            toast({
                title: "Level Reset",
                description: "Image restored to original.",
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

    // Wall colors
    const brickFill = inverted ? "#5B8CCC" : "#A0522D";
    const brickStroke = inverted ? "#4A7AB8" : "#8B4513";
    const mortarFill = inverted ? "#2A2A4A" : "#D2B48C";
    const hiddenTextFill = inverted ? "#EEE" : "#A25530"; // nearly invisible normally, bright when inverted
    const hiddenTextStroke = inverted ? "none" : "#9E5028";

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
                The Photo Negative — Find the hidden message.
            </motion.p>

            {/* Image frame */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-md relative"
            >
                {/* Picture frame */}
                <div className="bg-[#3E2723] rounded-lg p-2 shadow-xl border-2 border-[#5D4037]">
                    <div className="bg-[#4E342E] rounded p-1">
                        <motion.svg
                            viewBox="0 0 380 220"
                            className="w-full rounded"
                            animate={{
                                filter: inverted ? "invert(1)" : "invert(0)",
                            }}
                            transition={{ duration: 0.6 }}
                        >
                            {/* Mortar/background */}
                            <rect x="0" y="0" width="380" height="220" fill={mortarFill} />

                            {/* Brick rows */}
                            {Array.from({ length: 11 }, (_, row) => {
                                const y = row * 20;
                                const offset = row % 2 === 0 ? 0 : 30;
                                const brickW = 60;
                                const brickH = 18;
                                const gap = 2;

                                return Array.from({ length: 8 }, (_, col) => {
                                    const x = offset + col * (brickW + gap) - 30;
                                    // Subtle color variation per brick
                                    const variation = ((row * 7 + col * 13) % 5) * 3;
                                    return (
                                        <rect
                                            key={`b${row}-${col}`}
                                            x={x}
                                            y={y + 1}
                                            width={brickW}
                                            height={brickH}
                                            rx="1"
                                            fill={brickFill}
                                            stroke={brickStroke}
                                            strokeWidth="0.5"
                                            opacity={0.85 + (variation / 100)}
                                        />
                                    );
                                });
                            })}

                            {/* Hidden text — blends with brick color normally, pops on invert */}
                            <text
                                x="190"
                                y="118"
                                textAnchor="middle"
                                fontSize="38"
                                fill={hiddenTextFill}
                                stroke={hiddenTextStroke}
                                strokeWidth="0.5"
                                fontWeight="bold"
                                fontFamily="serif"
                                letterSpacing="8"
                                opacity={inverted ? 1 : 0.12}
                            >
                                {HIDDEN_WORD}
                            </text>

                            {/* Subtle texture scratches (visible when inverted) */}
                            {[
                                { x1: 50, y1: 85, x2: 90, y2: 87 },
                                { x1: 280, y1: 130, x2: 330, y2: 128 },
                                { x1: 100, y1: 165, x2: 150, y2: 167 },
                                { x1: 220, y1: 55, x2: 260, y2: 53 },
                            ].map((s, i) => (
                                <line
                                    key={`scratch${i}`}
                                    {...s}
                                    stroke={inverted ? "#DDD" : brickStroke}
                                    strokeWidth="0.5"
                                    opacity={inverted ? 0.4 : 0.15}
                                />
                            ))}

                            {/* Inspected overlay hint */}
                            {inspected && !inverted && (
                                <g opacity="0.3">
                                    <circle cx="190" cy="110" r="50" fill="none" stroke="#F9DC34" strokeWidth="1" strokeDasharray="4 3" />
                                    <text x="190" y="170" textAnchor="middle" fontSize="8" fill="#F9DC34">
                                        Something hidden here...
                                    </text>
                                </g>
                            )}
                        </motion.svg>
                    </div>
                </div>

                {/* Frame label */}
                <div className="flex justify-center mt-2">
                    <span className="text-xs text-gray-500 italic">
                        {inverted ? "[ Inverted View ]" : "[ Original Image ]"}
                    </span>
                </div>
            </motion.div>

            {/* Status bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-md mt-3 flex justify-center gap-3"
            >
                <div className={`text-xs px-3 py-1 rounded-full border ${inverted
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>
                    🎨 {inverted ? "Inverted" : "Normal"}
                </div>
                <div className={`text-xs px-3 py-1 rounded-full border ${inspected
                        ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>
                    🔍 {inspected ? "Inspected" : "Not inspected"}
                </div>
                <div className={`text-xs px-3 py-1 rounded-full border ${messageRead
                        ? "bg-green-500/20 text-green-400 border-green-500/40"
                        : "bg-gray-500/20 text-gray-400 border-gray-500/40"
                    }`}>
                    💬 {messageRead ? "Message found" : "No message"}
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
                                        /inspect image
                                    </span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Look closely at the wall image for clues.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /invert colors
                                    </span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Toggle a color inversion filter on the image.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /read message
                                    </span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Try to read any text visible in the image.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /enter
                                    </span>{" "}
                                    <span className="text-blue-600 dark:text-blue-300">[word]</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Enter the hidden word to complete the level.
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
                                <p>• An image of a brick wall is displayed.</p>
                                <p>• Nothing special is visible at first glance.</p>
                                <p>• But a <strong>hidden message</strong> is embedded in the image using negative colors.</p>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                                Hint:
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 italic">
                                What you see isn't always what's there. Try looking at things from the opposite perspective.
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

export default Level16;
