"use client";

import { useState, useRef, useEffect } from "react";
import AlgorithmVisualizer from "@/components/algorithm-visualizer";
import ArrayTraversalVisualizer from "./ArrayTraversalVisualizer";
import SlidingWindowVisualizer from "./sliding-window-visualizer";
import TwoPointersVisualizer from "./two-pointers-visualizer";
import BinarySearchVisualizer from "./binary-search-visualizer";
import SortingAlgorithmsVisualizer from "./sorting-algorithm-visualizer";
import DynamicProgrammingVisualizer from "./dynamic-programming-visualizer";
import RecursionBacktrackingVisualizer from "./recursion-backtracking-visualizer";

const colors = [
  "bg-blue-500", "bg-green-500", "bg-red-500", "bg-yellow-500",
  "bg-purple-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500",
  "bg-orange-500", "bg-gray-500"
];

const algorithms = [
  { name: "Arrays", description: "Basic array operations", Component: ArrayTraversalVisualizer, premium: false },
  { name: "Sliding Window", description: "Optimize subarray problems", Component: SlidingWindowVisualizer, premium: false },
  { name: "Two Pointers", description: "Efficient searching techniques", Component: TwoPointersVisualizer, premium: false },
  { name: "Binary Search", description: "Find elements in sorted structures", Component: BinarySearchVisualizer, premium: false },
  { name: "Sorting Algorithms", description: "Comparison of sorting techniques", Component: SortingAlgorithmsVisualizer, premium: false },
  { name: "Recursion & Backtracking", description: "Solve problems recursively", Component: RecursionBacktrackingVisualizer, premium: false },
  { name: "Dynamic Programming", description: "Optimize overlapping subproblems", Component: DynamicProgrammingVisualizer, premium: false },
  { name: "Bellman-Ford Algorithm", description: "Single-source shortest paths", Component: AlgorithmVisualizer, premium: false },
  { name: "Graph Traversal", description: "BFS & DFS for graph problems", Component: AlgorithmVisualizer, premium: true },
  { name: "Dijkstra's Algorithm", description: "Shortest path in graphs", Component: AlgorithmVisualizer, premium: true },
  { name: "Topological Sorting", description: "Order of execution in DAGs", Component: AlgorithmVisualizer, premium: true },
  { name: "Trie Data Structure", description: "Efficient string searching", Component: AlgorithmVisualizer, premium: true },
  
];

export default function AlgorithmCards() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null);
  const algorithmRef = useRef(null);

  useEffect(() => {
    if (selectedAlgorithm && algorithmRef.current) {
      algorithmRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedAlgorithm]);

  return (
    <div className="flex flex-col items-center gap-6 mt-10" id="algorithms">
      {/* Motivational Header */}
      {/* Motivational Header */}
  <div className="w-full flex flex-col items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold p-6 shadow-lg text-center 
    md:p-6 md:text-4xl sm:p-4 sm:text-2xl">
    <div className="text-4xl text-yellow-300 md:text-5xl sm:text-2xl">Start your DSA journey</div>
    <div className="text-3xl text-green-100 mt-4 md:text-4xl sm:text-xl">"कल करे सो आज कर, आज करे सो अब"</div>
  </div>

      {/* Algorithm Selection Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 px-4 md:px-16">
        {algorithms.map((algo, index) => (
          <button 
            key={index}
            onClick={() => !algo.premium && setSelectedAlgorithm(algo)}
            className={`p-6 border rounded-lg shadow-lg text-white transition duration-300 ease-in-out 
              ${algo.premium ? "bg-gray-400 cursor-not-allowed" : colors[index % colors.length]}
              ${!algo.premium && "hover:scale-105 hover:shadow-2xl"}`}
            disabled={algo.premium}
          >
            <h2 className="text-lg font-semibold">{algo.name}</h2>
            <p className="text-gray-200">{algo.premium ? "Premium Only" : algo.description}</p>
          </button>
        ))}
      </div>

      {/* Display Selected Algorithm */}
      {selectedAlgorithm && (
        <div ref={algorithmRef} className="mt-6 p-6 border rounded-lg shadow-lg w-full max-w-4xl bg-white">
          <h2 className="text-xl font-bold text-gray-800">{selectedAlgorithm.name}</h2>
          <p className="text-gray-600">{selectedAlgorithm.description}</p>
          <div className="mt-4">
            <selectedAlgorithm.Component />
          </div>
        </div>
      )}
    </div>
  );
}
