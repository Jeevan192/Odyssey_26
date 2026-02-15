"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

/*
  Setup:
  - TOP road    → GREEN (almost empty — wastes time)
  - RIGHT road  → RED   (JAMMED — needs green!)
  - LEFT road   → RED   (normal traffic)
  - BOTTOM road → RED   (normal traffic)

  Solution: /red top → /green right
*/

const Level19 = ({ onComplete }) => {
    const [inputValue, setInputValue] = useState("");
    const [isHelpModalOpen, setHelpModalOpen] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const { toast } = useToast();

    const [signals, setSignals] = useState({
        top: "green",
        right: "red",
        bottom: "red",
        left: "red",
    });

    useEffect(() => {
        // Win condition: the jammed road (right) must be green
        // AND the empty road (top) must NOT be green
        if (signals.right === "green" && signals.top === "red" && !isSuccess) {
            setIsSuccess(true);
        }
    }, [signals, isSuccess]);

    useEffect(() => {
        if (isSuccess) {
            toast({
                title: "Traffic Fixed! 🚦✅",
                description: "The jammed road now has green. Traffic is flowing!",
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

        const redMatch = cmd.match(/^\/red\s+(top|bottom|left|right)$/i);
        const greenMatch = cmd.match(/^\/green\s+(top|bottom|left|right)$/i);
        const resetMatch = cmd.match(/^\/reset$/i);
        const helpMatch = cmd.match(/^\/help$/i);

        if (redMatch) {
            const dir = redMatch[1].toLowerCase();
            if (signals[dir] === "red") {
                toast({
                    title: `${dir.charAt(0).toUpperCase() + dir.slice(1)} is already red`,
                    description: "No change needed.",
                    variant: "default",
                    className:
                        "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
                });
            } else {
                setSignals((prev) => ({ ...prev, [dir]: "red" }));
                toast({
                    title: `🔴 ${dir.charAt(0).toUpperCase() + dir.slice(1)} → RED`,
                    description: `${dir.charAt(0).toUpperCase() + dir.slice(1)} road signal set to red.`,
                    variant: "default",
                    className:
                        "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
                });
            }
        } else if (greenMatch) {
            const dir = greenMatch[1].toLowerCase();
            if (signals[dir] === "green") {
                toast({
                    title: `${dir.charAt(0).toUpperCase() + dir.slice(1)} is already green`,
                    description: "No change needed.",
                    variant: "default",
                    className:
                        "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
                });
            } else {
                setSignals((prev) => ({ ...prev, [dir]: "green" }));
                toast({
                    title: `🟢 ${dir.charAt(0).toUpperCase() + dir.slice(1)} → GREEN`,
                    description: `${dir.charAt(0).toUpperCase() + dir.slice(1)} road signal set to green.`,
                    variant: "default",
                    className:
                        "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
                });
            }
        } else if (resetMatch) {
            setSignals({ top: "green", right: "red", bottom: "red", left: "red" });
            setIsSuccess(false);
            toast({
                title: "Level Reset",
                description: "Signals restored to initial state.",
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

    // Car rendering helper
    const renderCar = (x, y, rotation, color) => (
        <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
            <rect x="-7" y="-4" width="14" height="8" rx="2" fill={color} />
            <rect x="-4" y="-3" width="5" height="6" rx="1" fill="#87CEEB" opacity="0.6" />
            <rect x="2" y="-3" width="3" height="6" rx="1" fill="#87CEEB" opacity="0.4" />
        </g>
    );

    // Traffic light rendering helper
    const renderLight = (x, y, state, label) => (
        <g>
            <rect x={x - 7} y={y - 18} width="14" height="36" rx="3" fill="#222" stroke="#444" strokeWidth="1" />
            {/* Red */}
            <circle cx={x} cy={y - 11} r="4" fill={state === "red" ? "#ef4444" : "#331111"} />
            {state === "red" && <circle cx={x} cy={y - 11} r="7" fill="#ef4444" opacity="0.2" />}
            {/* Yellow */}
            <circle cx={x} cy={y} r="4" fill="#332200" />
            {/* Green */}
            <circle cx={x} cy={y + 11} r="4" fill={state === "green" ? "#22c55e" : "#003311"} />
            {state === "green" && <circle cx={x} cy={y + 11} r="7" fill="#22c55e" opacity="0.2" />}
            {/* Label */}
            <text x={x} y={y + 28} textAnchor="middle" fontSize="7" fill="#AAA" fontWeight="bold">
                {label}
            </text>
        </g>
    );

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
                The Wrong Green — Fix the traffic signal.
            </motion.p>

            {/* Intersection SVG */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-full max-w-md"
            >
                <div className="bg-[#1a1a2e] rounded-xl p-3 border border-purple-700/30 shadow-lg">
                    <svg viewBox="0 0 340 340" className="w-full">
                        {/* Grass background */}
                        <rect x="0" y="0" width="340" height="340" fill="#1B5E20" rx="8" />

                        {/* Roads */}
                        {/* Vertical road */}
                        <rect x="130" y="0" width="80" height="340" fill="#37474F" />
                        {/* Horizontal road */}
                        <rect x="0" y="130" width="340" height="80" fill="#37474F" />
                        {/* Intersection center */}
                        <rect x="130" y="130" width="80" height="80" fill="#455A64" />

                        {/* Road markings — dashed center lines */}
                        {/* Vertical center line */}
                        {[0, 20, 40, 60, 80, 240, 260, 280, 300].map((y) => (
                            <rect key={`vc${y}`} x="168" y={y} width="4" height="12" fill="#F9DC34" opacity="0.6" rx="1" />
                        ))}
                        {/* Horizontal center line */}
                        {[0, 20, 40, 60, 80, 240, 260, 280, 300].map((x) => (
                            <rect key={`hc${x}`} x={x} y="168" width="12" height="4" fill="#F9DC34" opacity="0.6" rx="1" />
                        ))}

                        {/* Crosswalk stripes */}
                        {/* Top crosswalk */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <rect key={`ct${i}`} x={135 + i * 9} y="122" width="6" height="8" fill="white" opacity="0.4" rx="1" />
                        ))}
                        {/* Bottom crosswalk */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <rect key={`cb${i}`} x={135 + i * 9} y="210" width="6" height="8" fill="white" opacity="0.4" rx="1" />
                        ))}
                        {/* Left crosswalk */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <rect key={`cl${i}`} x="122" y={135 + i * 9} width="8" height="6" fill="white" opacity="0.4" rx="1" />
                        ))}
                        {/* Right crosswalk */}
                        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <rect key={`cr${i}`} x="210" y={135 + i * 9} width="8" height="6" fill="white" opacity="0.4" rx="1" />
                        ))}

                        {/* ========== CARS ========== */}

                        {/* TOP road — almost EMPTY (1 car far away) */}
                        {renderCar(155, 45, 0, "#78909C")}

                        {/* RIGHT road — JAMMED (many cars packed) */}
                        {renderCar(240, 155, 90, "#e53935")}
                        {renderCar(258, 155, 90, "#F57F17")}
                        {renderCar(276, 155, 90, "#1565C0")}
                        {renderCar(294, 155, 90, "#e53935")}
                        {renderCar(312, 155, 90, "#4527A0")}
                        {renderCar(240, 175, 90, "#2E7D32")}
                        {renderCar(258, 175, 90, "#e53935")}
                        {renderCar(276, 175, 90, "#FF8F00")}
                        {renderCar(294, 175, 90, "#1565C0")}
                        {renderCar(312, 175, 90, "#e53935")}

                        {/* LEFT road — normal (3 cars) */}
                        {renderCar(50, 155, 90, "#1E88E5")}
                        {renderCar(75, 175, 90, "#8E24AA")}
                        {renderCar(100, 155, 90, "#43A047")}

                        {/* BOTTOM road — normal (2 cars) */}
                        {renderCar(155, 260, 0, "#FF7043")}
                        {renderCar(180, 290, 0, "#5C6BC0")}

                        {/* ========== TRAFFIC LIGHTS ========== */}
                        {renderLight(125, 115, signals.top, "TOP")}
                        {renderLight(215, 225, signals.bottom, "BOTTOM")}
                        {renderLight(115, 215, signals.left, "LEFT")}
                        {renderLight(225, 115, signals.right, "RIGHT")}

                        {/* ========== LABELS ========== */}
                        {/* Top label — empty */}
                        <g>
                            <rect x="155" y="8" width="50" height="14" rx="3" fill={signals.top === "green" ? "#22c55e" : "#333"} opacity="0.8" />
                            <text x="180" y="18" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                                EMPTY
                            </text>
                        </g>

                        {/* Right label — jammed */}
                        <g>
                            <rect x="240" y="120" width="55" height="14" rx="3" fill="#ef4444" opacity="0.8" />
                            <text x="267" y="130" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">
                                ⚠ JAMMED
                            </text>
                        </g>

                        {/* Left label */}
                        <g>
                            <rect x="45" y="120" width="50" height="14" rx="3" fill="#666" opacity="0.6" />
                            <text x="70" y="130" textAnchor="middle" fontSize="7" fill="white">
                                Normal
                            </text>
                        </g>

                        {/* Bottom label */}
                        <g>
                            <rect x="155" y="318" width="50" height="14" rx="3" fill="#666" opacity="0.6" />
                            <text x="180" y="328" textAnchor="middle" fontSize="7" fill="white">
                                Normal
                            </text>
                        </g>

                        {/* Warning indicator for wrong green */}
                        {signals.top === "green" && signals.right === "red" && (
                            <g>
                                <motion.text
                                    x="170"
                                    y="175"
                                    textAnchor="middle"
                                    fontSize="9"
                                    fill="#F9DC34"
                                    fontWeight="bold"
                                    animate={{ opacity: [1, 0.3] }}
                                    transition={{ repeat: Infinity, duration: 1 }}
                                >
                                    ⚠ INEFFICIENT
                                </motion.text>
                            </g>
                        )}

                        {/* Success indicator */}
                        {isSuccess && (
                            <g>
                                <motion.text
                                    x="170"
                                    y="175"
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#22c55e"
                                    fontWeight="bold"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                >
                                    ✓ TRAFFIC FLOWING
                                </motion.text>
                            </g>
                        )}
                    </svg>
                </div>
            </motion.div>

            {/* Signal status bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="w-full max-w-md mt-3 grid grid-cols-4 gap-2"
            >
                {["top", "right", "bottom", "left"].map((dir) => (
                    <div
                        key={dir}
                        className={`text-xs px-2 py-1 rounded-full border text-center ${signals[dir] === "green"
                                ? "bg-green-500/20 text-green-400 border-green-500/40"
                                : "bg-red-500/20 text-red-400 border-red-500/40"
                            }`}
                    >
                        {dir.charAt(0).toUpperCase() + dir.slice(1)}: {signals[dir] === "green" ? "🟢" : "🔴"}
                    </div>
                ))}
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
                                        /red
                                    </span>{" "}
                                    <span className="text-blue-600 dark:text-blue-300">[top|right|bottom|left]</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Set a road's signal to red.
                                    </p>
                                </div>

                                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                                    <span className="font-bold text-purple-700 dark:text-purple-300">
                                        /green
                                    </span>{" "}
                                    <span className="text-blue-600 dark:text-blue-300">[top|right|bottom|left]</span>
                                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                                        Set a road's signal to green.
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
                                <p>• A 4-way intersection with traffic lights.</p>
                                <p>• The <strong>top road</strong> has green but is <strong>almost empty</strong>.</p>
                                <p>• The <strong>right road</strong> is <strong>fully jammed</strong> but stuck on red.</p>
                                <p>• The other roads have normal traffic.</p>
                            </div>

                            <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                                Hint:
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 italic">
                                The empty road keeps getting green while the crowded road stays stuck. Fix the signal so traffic actually moves!
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

export default Level19;
