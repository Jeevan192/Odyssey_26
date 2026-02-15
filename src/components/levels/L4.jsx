"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { useToast } from "../ui/use-toast";

const GRID_SIZE = 5;
const START = { x: 1, y: 1 };
const TARGET = { x: 5, y: 5 };

// Valid L-shaped knight moves
const KNIGHT_DELTAS = [
  { dx: 2, dy: 1 },
  { dx: 2, dy: -1 },
  { dx: -2, dy: 1 },
  { dx: -2, dy: -1 },
  { dx: 1, dy: 2 },
  { dx: 1, dy: -2 },
  { dx: -1, dy: 2 },
  { dx: -1, dy: -2 },
];

const isValidKnightMove = (from, to) => {
  return KNIGHT_DELTAS.some(
    (d) => from.x + d.dx === to.x && from.y + d.dy === to.y
  );
};

const isInBounds = (pos) => {
  return pos.x >= 1 && pos.x <= GRID_SIZE && pos.y >= 1 && pos.y <= GRID_SIZE;
};

const Level4 = ({ onComplete }) => {
  const [inputValue, setInputValue] = useState("");
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [knightPos, setKnightPos] = useState({ ...START });
  const [moveHistory, setMoveHistory] = useState([{ ...START }]);
  const [visitedCells, setVisitedCells] = useState(new Set(["1,1"]));
  const { toast } = useToast();

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Level Completed! ♞",
        description: "The knight has reached the target!",
        variant: "success"
      });

      setTimeout(() => {
        onComplete(4);
      }, 2000);
    }
  }, [isSuccess, onComplete, toast]);

  // Check win - must cover all squares
  useEffect(() => {
    if (knightPos.x === TARGET.x && knightPos.y === TARGET.y && visitedCells.size === GRID_SIZE * GRID_SIZE && !isSuccess) {
      setIsSuccess(true);
    }
  }, [knightPos, isSuccess, visitedCells]);

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

    const moveMatch = cmd.match(/^\/move\s*(\d)\s*,\s*(\d)$/i);
    const resetMatch = cmd.match(/^\/reset$/i);
    const helpMatch = cmd.match(/^\/help$/i);
    const undoMatch = cmd.match(/^\/undo$/i);

    if (moveMatch) {
      const targetX = parseInt(moveMatch[1]);
      const targetY = parseInt(moveMatch[2]);
      const to = { x: targetX, y: targetY };

      if (!isInBounds(to)) {
        toast({
          title: "Out of Bounds",
          description: `(${targetX},${targetY}) is outside the ${GRID_SIZE}×${GRID_SIZE} grid.`,
          variant: "destructive"
      });
      } else if (!isValidKnightMove(knightPos, to)) {
        toast({
          title: "Invalid Move ❌",
          description: `A knight can't move from (${knightPos.x},${knightPos.y}) to (${targetX},${targetY}). Knights move in an L-shape: 2+1 squares.`,
          variant: "destructive"
      });
      } else {
        setKnightPos(to);
        setMoveHistory((prev) => [...prev, to]);
        setVisitedCells((prev) => new Set([...prev, `${to.x},${to.y}`]));
        toast({
          title: `Moved to (${targetX},${targetY})`,
          description:
            to.x === TARGET.x && to.y === TARGET.y
              ? "You reached the target! 🎉"
              : `Knight is now at (${targetX},${targetY}).`,
          variant: "default"
      });
      }
    } else if (undoMatch) {
      if (moveHistory.length > 1) {
        const newHistory = moveHistory.slice(0, -1);
        const prevPos = newHistory[newHistory.length - 1];
        setMoveHistory(newHistory);
        setKnightPos(prevPos);
        toast({
          title: "Move Undone",
          description: `Knight returned to (${prevPos.x},${prevPos.y}).`,
          variant: "default"
      });
      } else {
        toast({
          title: "Nothing to Undo",
          description: "You're at the starting position.",
          variant: "default"
      });
      }
    } else if (resetMatch) {
      setKnightPos({ ...START });
      setMoveHistory([{ ...START }]);
      setVisitedCells(new Set(["1,1"]));
      setIsSuccess(false);
      toast({
        title: "Level Reset",
        description: "Knight returned to (1,1).",
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

  // Compute valid moves from current position for highlighting
  const validMoves = KNIGHT_DELTAS.map((d) => ({
    x: knightPos.x + d.dx,
    y: knightPos.y + d.dy})).filter(isInBounds);

  // Grid rendering
  const CELL_SIZE = 90;
  const PADDING = 30;
  const SVG_SIZE = GRID_SIZE * CELL_SIZE + PADDING * 2;

  const cellToPixel = (gx, gy) => ({
    px: PADDING + (gx - 1) * CELL_SIZE + CELL_SIZE / 2,
    py: PADDING + (gy - 1) * CELL_SIZE + CELL_SIZE / 2});

  return (
    <div className="flex flex-col items-center mt-8 max-w-4xl mx-auto px-4">
      {/* Level title badge - now in sticky header */}

      {/* Question */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 text-lg font-semibold mb-4 text-center text-purple-900 dark:text-[#F9DC34]"
      >
        The Knight's Path — Cover all {GRID_SIZE}×{GRID_SIZE} squares and reach ({GRID_SIZE},{GRID_SIZE}).
      </motion.p>

      {/* Board */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="bg-[#1a1a2e] dark:bg-[#1a1a2e] rounded-2xl p-2 shadow-lg border border-purple-700/30 w-full max-w-sm relative"
      >
        <svg
          viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
          className="w-full"
        >
          {/* Grid cells */}
          {Array.from({ length: GRID_SIZE }, (_, row) =>
            Array.from({ length: GRID_SIZE }, (_, col) => {
              const gx = col + 1;
              const gy = row + 1;
              const { px, py } = cellToPixel(gx, gy);
              const isStart = gx === START.x && gy === START.y;
              const isTarget = gx === TARGET.x && gy === TARGET.y;
              const isKnight = gx === knightPos.x && gy === knightPos.y;
              const isValid = validMoves.some((m) => m.x === gx && m.y === gy);
              const wasVisited = visitedCells.has(`${gx},${gy}`);
              const isDark = (row + col) % 2 === 1;

              let fillColor = isDark ? "#2D1B4B" : "#3D2060";
              if (isTarget && isKnight) fillColor = "#22c55e";
              else if (isTarget) fillColor = "#7C3AED";
              else if (isKnight) fillColor = isDark ? "#2D1B4B" : "#3D2060";
              else if (isValid) fillColor = isDark ? "#3a2060" : "#4a2878";

              return (
                <g key={`${gx}-${gy}`}>
                  {/* Cell background */}
                  <rect
                    x={PADDING + col * CELL_SIZE}
                    y={PADDING + row * CELL_SIZE}
                    width={CELL_SIZE}
                    height={CELL_SIZE}
                    fill={fillColor}
                    stroke="#6B21A8"
                    strokeWidth="1.5"
                    rx="4"
                  />

                  {/* Valid move indicator */}
                  {isValid && !isKnight && (
                    <circle
                      cx={px}
                      cy={py}
                      r="8"
                      fill="#F9DC34"
                      opacity="0.4"
                    >
                      <animate
                        attributeName="opacity"
                        values="0.3;0.6;0.3"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}

                  {/* Start marker */}
                  {isStart && !isKnight && (
                    <text
                      x={px}
                      y={py + 4}
                      textAnchor="middle"
                      fontSize="12"
                      fill="#888"
                      fontWeight="bold"
                    >
                      START
                    </text>
                  )}

                  {/* Target marker */}
                  {isTarget && !isKnight && (
                    <>
                      <text
                        x={px}
                        y={py - 5}
                        textAnchor="middle"
                        fontSize="22"
                      >
                        ⭐
                      </text>
                      <text
                        x={px}
                        y={py + 20}
                        textAnchor="middle"
                        fontSize="10"
                        fill="#F9DC34"
                        fontWeight="bold"
                      >
                        GOAL
                      </text>
                    </>
                  )}

                  {/* Coordinate label */}
                  <text
                    x={PADDING + col * CELL_SIZE + 8}
                    y={PADDING + row * CELL_SIZE + 14}
                    fontSize="9"
                    fill="#8888BB"
                    opacity="0.6"
                  >
                    {gx},{gy}
                  </text>
                </g>
              );
            })
          )}

          {/* Move trail */}
          {moveHistory.length > 1 &&
            moveHistory.slice(0, -1).map((pos, i) => {
              const next = moveHistory[i + 1];
              const from = cellToPixel(pos.x, pos.y);
              const to = cellToPixel(next.x, next.y);
              return (
                <line
                  key={`trail-${i}`}
                  x1={from.px}
                  y1={from.py}
                  x2={to.px}
                  y2={to.py}
                  stroke="#F9DC34"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                  opacity="0.4"
                />
              );
            })}

          {/* Knight piece */}
          <motion.g
            animate={{
              x: cellToPixel(knightPos.x, knightPos.y).px - cellToPixel(1, 1).px,
              y: cellToPixel(knightPos.x, knightPos.y).py - cellToPixel(1, 1).py}}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
          >
            {/* Knight shadow */}
            <ellipse
              cx={cellToPixel(1, 1).px}
              cy={cellToPixel(1, 1).py + 20}
              rx="16"
              ry="6"
              fill="black"
              opacity="0.3"
            />
            {/* Knight body/symbol */}
            <text
              x={cellToPixel(1, 1).px}
              y={cellToPixel(1, 1).py + 10}
              textAnchor="middle"
              fontSize="40"
              className="select-none"
            >
              ♞
            </text>
          </motion.g>
        </svg>

        {/* Move counter */}
        <div className="flex justify-between px-4 pb-2 text-sm">
          <span className="text-purple-300">
            Covered: <span className="text-[#F9DC34] font-bold">{visitedCells.size}/{GRID_SIZE * GRID_SIZE}</span>
          </span>
          <span className="text-purple-300">
            Position: <span className="text-[#F9DC34] font-bold">({knightPos.x},{knightPos.y})</span>
          </span>
        </div>
      </motion.div>

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
                    /move
                  </span>{" "}
                  <span className="text-blue-600 dark:text-blue-300">[x],[y]</span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Move the knight to position (x,y). Must be a valid L-shaped move (2 squares + 1 square perpendicular).
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /undo
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Undo the last move.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /reset
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Reset the knight to the starting position.
                  </p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <span className="font-bold text-purple-700 dark:text-purple-300">
                    /help
                  </span>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">
                    Show available commands and hints.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
                Goal:
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Visit every square on the {GRID_SIZE}×{GRID_SIZE} board and end at position ({GRID_SIZE},{GRID_SIZE}).
              </p>
              <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                Squares visited: <strong>{visitedCells.size}/{GRID_SIZE * GRID_SIZE}</strong>
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

export default Level4;

