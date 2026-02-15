// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { Input } from "@/components/ui/input";
// import { motion } from "framer-motion";
// import { useToast } from "../ui/use-toast";

// // The symbols: ▲ ▲ ■ ▲ ■ ■ ▲
// // Triangle = 1, Square = 0
// // Binary: 1101001 = 105 decimal
// // 1 + 0 + 5 = 6  →  6th letter = F
// const SYMBOLS = [
//   { shape: "triangle", value: 1 },
//   { shape: "triangle", value: 1 },
//   { shape: "square", value: 0 },
//   { shape: "triangle", value: 1 },
//   { shape: "square", value: 0 },
//   { shape: "square", value: 0 },
//   { shape: "triangle", value: 1 },
// ];

// const ANSWER = "f";

// const Level6 = ({ onComplete }) => {
//   const [inputValue, setInputValue] = useState("");
//   const [isHelpModalOpen, setHelpModalOpen] = useState(false);
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [attempts, setAttempts] = useState([]);
//   const { toast } = useToast();

//   useEffect(() => {
//     if (isSuccess) {
//       toast({
//         title: "Decoded! 🔓",
//         description: "The answer is F — brilliant decoding!",
//         variant: "success",
//         className:
//           "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white opacity-100 border-0 shadow-lg",
//       });

//       setTimeout(() => {
//         onComplete(4);
//       }, 2000);
//     }
//   }, [isSuccess, onComplete, toast]);

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value);
//   };

//   const handleEnter = (e) => {
//     if (e.key === "Enter") {
//       handleCommandSubmit();
//     }
//   };

//   const handleCommandSubmit = () => {
//     const cmd = inputValue.trim().toLowerCase();

//     const enterMatch = cmd.match(/^\/enter\s+(.+)$/i);
//     const resetMatch = cmd.match(/^\/reset$/i);
//     const helpMatch = cmd.match(/^\/help$/i);

//     if (enterMatch) {
//       const guess = enterMatch[1].trim().toLowerCase();
//       setAttempts((prev) => [...prev, guess]);

//       if (guess === ANSWER) {
//         setIsSuccess(true);
//       } else {
//         toast({
//           title: "Incorrect ❌",
//           description: `"${guess.toUpperCase()}" is not the right letter. Think about what the shapes represent.`,
//           variant: "destructive",
//           className:
//             "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white opacity-100 shadow-lg",
//         });
//       }
//     } else if (resetMatch) {
//       setAttempts([]);
//       setIsSuccess(false);
//       toast({
//         title: "Level Reset",
//         description: "Try decoding the symbols again.",
//         variant: "default",
//         className:
//           "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
//       });
//     } else if (helpMatch) {
//       setHelpModalOpen(true);
//     } else {
//       toast({
//         title: "Unknown Command",
//         description: "Type /help to see available commands",
//         variant: "destructive",
//         className:
//           "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white opacity-100 shadow-lg",
//       });
//     }

//     setInputValue("");
//   };

//   const closeHelpModal = () => {
//     setHelpModalOpen(false);
//   };

//   // Render a single symbol (triangle or square)
//   const renderSymbol = (symbol, index) => {
//     const cx = 35 + index * 48;
//     const cy = 80;

//     if (symbol.shape === "triangle") {
//       return (
//         <motion.g
//           key={index}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: index * 0.1 }}
//         >
//           <polygon
//             points={`${cx},${cy - 22} ${cx - 18},${cy + 14} ${cx + 18},${cy + 14}`}
//             fill="#F9DC34"
//             stroke="#F5A623"
//             strokeWidth="2"
//             strokeLinejoin="round"
//           />
//           <text
//             x={cx}
//             y={cy + 34}
//             textAnchor="middle"
//             fontSize="11"
//             fill="#F9DC34"
//             fontWeight="bold"
//             opacity="0.6"
//           >
//             ▲
//           </text>
//         </motion.g>
//       );
//     } else {
//       return (
//         <motion.g
//           key={index}
//           initial={{ opacity: 0, y: -20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4, delay: index * 0.1 }}
//         >
//           <rect
//             x={cx - 16}
//             y={cy - 16}
//             width="32"
//             height="32"
//             rx="3"
//             fill="#A78BFA"
//             stroke="#7C3AED"
//             strokeWidth="2"
//           />
//           <text
//             x={cx}
//             y={cy + 34}
//             textAnchor="middle"
//             fontSize="11"
//             fill="#A78BFA"
//             fontWeight="bold"
//             opacity="0.6"
//           >
//             ■
//           </text>
//         </motion.g>
//       );
//     }
//   };

//   return (
//     <div className="flex flex-col items-center mt-8 max-w-4xl mx-auto px-4">
//       {/* Level title badge */}
//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="px-6 py-3 text-2xl font-bold text-[#2D1B4B] dark:text-[#1A0F2E] bg-gradient-to-r from-[#F9DC34] to-[#F5A623] rounded-full shadow-lg"
//       >
//         Level 6
//       </motion.h1>

//       {/* Question */}
//       <motion.p
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.2 }}
//         className="mt-8 text-xl font-semibold mb-4 text-center text-purple-900 dark:text-[#F9DC34]"
//       >
//         Decode the symbols.
//       </motion.p>

//       {/* Symbol display */}
//       <motion.div
//         initial={{ opacity: 0, scale: 0.9 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.6, delay: 0.3 }}
//         className="bg-[#0a0a1a] dark:bg-[#0a0a1a] rounded-2xl p-4 shadow-lg border border-purple-700/30 w-full max-w-md relative overflow-hidden"
//       >
//         <svg viewBox="0 0 370 160" className="w-full">
//           {/* Background grid pattern */}
//           {[...Array(15)].map((_, i) => (
//             <line
//               key={`vg${i}`}
//               x1={i * 25}
//               y1={0}
//               x2={i * 25}
//               y2={160}
//               stroke="#1a1a3a"
//               strokeWidth="0.5"
//             />
//           ))}
//           {[...Array(7)].map((_, i) => (
//             <line
//               key={`hg${i}`}
//               x1={0}
//               y1={i * 25}
//               x2={370}
//               y2={i * 25}
//               stroke="#1a1a3a"
//               strokeWidth="0.5"
//             />
//           ))}

//           {/* Title */}
//           <text
//             x="185"
//             y="25"
//             textAnchor="middle"
//             fontSize="13"
//             fill="#8888BB"
//             fontWeight="bold"
//           >
//             DECODE THE SEQUENCE
//           </text>

//           {/* Symbols */}
//           {SYMBOLS.map((symbol, index) => renderSymbol(symbol, index))}

//           {/* Legend */}
//           <g>
//             {/* Triangle legend */}
//             <polygon
//               points="60,135 52,149 68,149"
//               fill="#F9DC34"
//               stroke="#F5A623"
//               strokeWidth="1.5"
//               strokeLinejoin="round"
//             />
//             <text x="78" y="146" fontSize="11" fill="#8888BB">
//               = ?
//             </text>

//             {/* Square legend */}
//             <rect
//               x="130"
//               y="132"
//               width="18"
//               height="18"
//               rx="2"
//               fill="#A78BFA"
//               stroke="#7C3AED"
//               strokeWidth="1.5"
//             />
//             <text x="158" y="146" fontSize="11" fill="#8888BB">
//               = ?
//             </text>

//             {/* Question mark */}
//             <text
//               x="270"
//               y="148"
//               textAnchor="middle"
//               fontSize="12"
//               fill="#F9DC34"
//               fontWeight="bold"
//             >
//               → ? → LETTER
//             </text>
//           </g>
//         </svg>
//       </motion.div>

//       {/* Attempts display */}
//       {attempts.length > 0 && (
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="w-full max-w-md mt-3 flex flex-wrap gap-2 justify-center"
//         >
//           {attempts.slice(-5).map((attempt, i) => (
//             <span
//               key={i}
//               className={`text-xs px-3 py-1 rounded-full border ${attempt === ANSWER
//                   ? "bg-green-500/20 text-green-400 border-green-500/40"
//                   : "bg-red-500/20 text-red-400 border-red-500/40 line-through"
//                 }`}
//             >
//               {attempt.toUpperCase()}
//             </span>
//           ))}
//         </motion.div>
//       )}

//       {/* Help prompt */}
//       <motion.span
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.6, delay: 0.5 }}
//         className="mx-10 my-6 text-center cursor-pointer text-purple-700 dark:text-purple-300 hover:text-[#F5A623] dark:hover:text-[#F9DC34] transition-colors"
//         onClick={() => setHelpModalOpen(true)}
//       >
//         Type{" "}
//         <span className="font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">
//           /help
//         </span>{" "}
//         to get commands and hints
//       </motion.span>

//       {/* Command input */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6, delay: 0.6 }}
//         className="flex gap-2 w-full max-w-md"
//       >
//         <Input
//           type="text"
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyPress={handleEnter}
//           placeholder="Enter command..."
//           className="border-purple-300 dark:border-purple-600/50 bg-white dark:bg-[#1A0F2E]/70 shadow-inner focus:ring-[#F5A623] focus:border-[#F9DC34]"
//         />
//         <button
//           onClick={handleCommandSubmit}
//           className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] p-2 rounded-lg shadow-md transition-transform hover:scale-105"
//         >
//           <Image
//             src="/runcode.png"
//             alt="Run"
//             height={20}
//             width={20}
//             className="rounded-sm"
//           />
//         </button>
//       </motion.div>

//       {/* Help Modal */}
//       {isHelpModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300">
//           <motion.div
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             className="bg-white dark:bg-[#2D1B4B] rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4"
//           >
//             <div className="p-6">
//               <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-[#F9DC34]">
//                 Available Commands:
//               </h2>
//               <div className="space-y-1 mb-6">
//                 <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
//                   <span className="font-bold text-purple-700 dark:text-purple-300">
//                     /enter
//                   </span>{" "}
//                   <span className="text-blue-600 dark:text-blue-300">[letter]</span>
//                   <p className="mt-1 text-gray-600 dark:text-gray-300">
//                     Enter the decoded letter.
//                   </p>
//                 </div>

//                 <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
//                   <span className="font-bold text-purple-700 dark:text-purple-300">
//                     /reset
//                   </span>
//                   <p className="mt-1 text-gray-600 dark:text-gray-300">
//                     Reset the level.
//                   </p>
//                 </div>

//                 <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
//                   <span className="font-bold text-purple-700 dark:text-purple-300">
//                     /help
//                   </span>
//                   <p className="mt-1 text-gray-600 dark:text-gray-300">
//                     Show available commands and hints.
//                   </p>
//                 </div>
//               </div>

//               <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
//                 Rules:
//               </h3>
//               <div className="space-y-2 mb-4 text-gray-600 dark:text-gray-300 text-sm">
//                 <p>
//                   • <span className="text-[#F9DC34]">▲</span> Triangle = 1
//                 </p>
//                 <p>
//                   • <span className="text-[#A78BFA]">■</span> Square = 0
//                 </p>
//                 <p>• Binary → Decimal → Word index (A=1, B=2, ...)</p>
//               </div>

//               <h3 className="text-xl font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">
//                 Hint:
//               </h3>
//               <p className="text-gray-600 dark:text-gray-300 italic">
//                 Read the shapes as ones and zeros. Convert to a number. Then think about digits adding up.
//               </p>
//             </div>

//             <div className="bg-purple-50 dark:bg-purple-900/30 px-6 py-4 text-center">
//               <button
//                 onClick={closeHelpModal}
//                 className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] hover:from-[#FFE55C] hover:to-[#FFBD4A] px-6 py-2 rounded-lg text-purple-900 font-medium shadow-md transition-transform hover:scale-105"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Level6;

"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../ui/use-toast";

const Level6 = ({ onComplete }) => {
  // State for the 7 interactive bulbs (1 = ON, 0 = OFF)
  const [bits, setBits] = useState([1, 1, 0, 1, 0, 0, 1]); // Default binary: 1101001 (105)
  const [inputValue, setInputValue] = useState("");
  const [isHelpModalOpen, setHelpModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [attempts, setAttempts] = useState([]);
  const { toast } = useToast();

  /**
   * Puzzle Logic:
   * 1. Binary String (bits) -> Decimal Number
   * 2. Sum of Decimal Digits -> Alphabet Index
   * 3. Index -> Character (A=1, B=2...)
   */
  const currentAnswer = useMemo(() => {
    const decimal = parseInt(bits.join(""), 2);
    const digitSum = String(decimal)
      .split("")
      .reduce((acc, curr) => acc + parseInt(curr), 0);
    
    // Convert sum to 1-26 range for alphabet mapping
    const alphabetIndex = ((digitSum - 1) % 26) + 1;
    return String.fromCharCode(96 + alphabetIndex).toLowerCase();
  }, [bits]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Decoded! 🔓",
        description: `Signal Match: ${currentAnswer.toUpperCase()} — System access granted!`,
        variant: "success",
        className:
          "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white opacity-100 border-0 shadow-lg",
      });

      setTimeout(() => {
        onComplete(4);
      }, 2000);
    }
  }, [isSuccess, onComplete, toast, currentAnswer]);

  const toggleBulb = (index) => {
    const newBits = [...bits];
    newBits[index] = newBits[index] === 1 ? 0 : 1;
    setBits(newBits);
    // Reset success state if they change the circuit after winning
    if (isSuccess) setIsSuccess(false);
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

    const enterMatch = cmd.match(/^\/enter\s+(.+)$/i);
    const resetMatch = cmd.match(/^\/reset$/i);
    const helpMatch = cmd.match(/^\/help$/i);

    if (enterMatch) {
      const guess = enterMatch[1].trim().toLowerCase();

      if (guess === currentAnswer) {
        setIsSuccess(true);
      } else {
        setAttempts((prev) => [...prev, guess]);
        toast({
          title: "Incorrect ❌",
          description: `"${guess.toUpperCase()}" does not match the current circuit state.`,
          variant: "destructive",
          className:
            "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white opacity-100 shadow-lg",
        });
      }
    } else if (resetMatch) {
      setBits([1, 1, 0, 1, 0, 0, 1]);
      setAttempts([]);
      setIsSuccess(false);
      toast({
        title: "Level Reset",
        description: "Circuit restored to default parameters.",
        variant: "default",
        className:
          "fixed bottom-12 left-1/2 transform -translate-x-1/2 z-50 bg-white dark:bg-[#2D1B4B] opacity-100 shadow-lg",
      });
    } else if (helpMatch) {
      setHelpModalOpen(true);
    } else {
      toast({
        title: "Unknown Command",
        description: "Type /help for diagnostic protocols",
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

  const renderBulb = (isOn, index) => {
    const cx = 35 + index * 48;
    const cy = 75;

    return (
      <motion.g
        key={index}
        className="cursor-pointer"
        onClick={() => toggleBulb(index)}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
      >
        {/* Glow Effect */}
        <AnimatePresence>
          {isOn === 1 && (
            <motion.circle
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.4, scale: 1.6 }}
              exit={{ opacity: 0, scale: 0.5 }}
              cx={cx}
              cy={cy}
              r="14"
              fill="#F9DC34"
              style={{ filter: "blur(10px)" }}
            />
          )}
        </AnimatePresence>

        {/* Bulb Glass */}
        <motion.path
          animate={{
            fill: isOn === 1 ? "#F9DC34" : "#2D1B4B",
            scale: isOn === 1 ? [1, 1.1, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          d={`M${cx - 10},${cy} a10,10 0 1,1 20,0 c0,5 -3,7 -3,11 h-14 c0,-4 -3,-6 -3,-11`}
          stroke={isOn === 1 ? "#F5A623" : "#4A4A5A"}
          strokeWidth="2"
        />

        {/* Metal Base */}
        <rect x={cx - 6} y={cy + 11} width="12" height="5" fill="#666" rx="1" />
        
        {/* Wire connection dot */}
        <motion.circle
          cx={cx}
          cy={cy + 30}
          r="3"
          animate={{ fill: isOn === 1 ? "#F9DC34" : "#1a1a3a" }}
        />
      </motion.g>
    );
  };

  return (
    <div className="flex flex-col items-center mt-8 max-w-4xl mx-auto px-4">
      {/* Design: Level Title Badge */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-3 text-2xl font-bold text-[#2D1B4B] dark:text-[#1A0F2E] bg-gradient-to-r from-[#F9DC34] to-[#F5A623] rounded-full shadow-lg"
      >
        Level 6
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-8 text-xl font-semibold mb-4 text-center text-purple-900 dark:text-[#F9DC34]"
      >
        Interact with the circuit to decode.
      </motion.p>

      {/* Design: SVG Canvas (Grid Pattern and Bulbs) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a1a] rounded-2xl p-4 shadow-lg border border-purple-700/30 w-full max-w-md relative overflow-hidden"
      >
        <svg viewBox="0 0 370 160" className="w-full">
          {/* Background grid */}
          {[...Array(15)].map((_, i) => (
            <line key={`v${i}`} x1={i * 25} y1={0} x2={i * 25} y2={160} stroke="#1a1a3a" strokeWidth="0.5" />
          ))}
          {[...Array(7)].map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * 25} x2={370} y2={i * 25} stroke="#1a1a3a" strokeWidth="0.5" />
          ))}

          <text x="185" y="25" textAnchor="middle" fontSize="11" fill="#8888BB" fontWeight="bold" letterSpacing="1">
            CIRCUIT ANALYSIS MODE
          </text>

          {/* Render the 7 interactive bits */}
          {bits.map((bit, index) => renderBulb(bit, index))}

          
        </svg>
      </motion.div>

      {/* Design: Attempts Display */}
      {attempts.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-md mt-3 flex flex-wrap gap-2 justify-center">
          {attempts.slice(-5).map((attempt, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full border bg-red-500/20 text-red-400 border-red-500/40 line-through">
              {attempt.toUpperCase()}
            </span>
          ))}
        </motion.div>
      )}

      {/* Design: Help Prompt */}
      <motion.span
        className="mx-10 my-6 text-center cursor-pointer text-purple-700 dark:text-purple-300 hover:text-[#F9DC34] transition-colors"
        onClick={() => setHelpModalOpen(true)}
      >
        Type <span className="font-mono bg-purple-100 dark:bg-purple-900/30 px-2 py-1 rounded">/help</span> for protocol hints
      </motion.span>

      {/* Design: Input System */}
      <motion.div className="flex gap-2 w-full max-w-md">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleEnter}
          placeholder="Enter command..."
          className="border-purple-300 dark:border-purple-600/50 bg-white dark:bg-[#1A0F2E]/70 shadow-inner focus:ring-[#F5A623]"
        />
        <button
          onClick={handleCommandSubmit}
          className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] p-2 rounded-lg shadow-md hover:scale-105 transition-transform"
        >
          <Image src="/runcode.png" alt="Run" height={20} width={20} className="rounded-sm" />
        </button>
      </motion.div>

      {/* Design: Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-[#2D1B4B] rounded-xl overflow-hidden shadow-2xl max-w-md w-full mx-4">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-purple-800 dark:text-[#F9DC34]">Diagnostic Protocol:</h2>
              <div className="space-y-3 mb-6">
                <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-[#F5A623]">
                  <p className="text-sm">1. Read the 7 bulbs as <strong>binary bits</strong>.</p>
                  <p className="text-sm">2. Convert binary string to a <strong>decimal number</strong>.</p>
                  <p className="text-sm">3. <strong>Sum the digits</strong> of that decimal number.</p>
                  <p className="text-sm">4. Result maps to <strong>Alphabet Index</strong> (A=1, B=2...).</p>
                </div>
              </div>
              <h3 className="text-lg font-bold mb-2 text-purple-800 dark:text-[#F9DC34]">Available Commands:</h3>
              <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                <p>• <span className="font-mono text-purple-500">/enter [letter]</span> - Submit analysis</p>
                <p>• <span className="font-mono text-purple-500">/reset</span> - Restore circuit defaults</p>
              </div>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/30 px-6 py-4 text-center">
              <button onClick={closeHelpModal} className="bg-gradient-to-r from-[#F9DC34] to-[#F5A623] px-6 py-2 rounded-lg text-purple-900 font-bold shadow-md">
                Close Diagnostics
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Level6;