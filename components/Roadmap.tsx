"use client";

import { FaArrowDown, FaArrowRight, FaArrowLeft } from "react-icons/fa";

export default function Roadmap() {
  const roadmapSteps = [
    { title: "Array Traversing", description: "Learn how to iterate over arrays efficiently.", color: "bg-blue-600", arrow: "right" },
    { title: "Sorting & Searching", description: "Master sorting algorithms and binary search.", color: "bg-green-600", arrow: "right" },
    { title: "Recursion & Backtracking", description: "Understand recursion and solve complex problems.", color: "bg-yellow-500", arrow: "down" },
    { title: "Stack, Queue & Linked List", description: "Learn about linear data structures.", color: "bg-purple-600", arrow: "left" },
    { title: "Trees & Graphs", description: "Explore tree traversal, graph algorithms, and shortest paths.", color: "bg-pink-600", arrow: "left" },
    { title: "Dynamic Programming", description: "Optimize solutions using DP techniques.", color: "bg-red-600", arrow: "down" },
    { title: "Segment Trees & Fenwick Trees", description: "Master advanced data structures for range queries.", color: "bg-indigo-600" },
  ];

  return (
    <div className="mt-24 mb-24 px-6">
      <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
        DSA Roadmap
      </h2>
      <div className="flex flex-col items-center gap-8">
        {roadmapSteps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            {/* Roadmap Step Card */}
            <div
              className={`w-64 md:w-80 p-4 rounded-lg shadow-lg text-white text-center ${step.color} transition transform hover:scale-105`}
            >
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="text-sm text-gray-200">{step.description}</p>
            </div>

            {/* Arrow Logic */}
            {index !== roadmapSteps.length - 1 && (
              <div className="text-white text-2xl mt-2">
                {step.arrow === "right" ? <FaArrowRight /> : step.arrow === "left" ? <FaArrowLeft /> : <FaArrowDown />}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
