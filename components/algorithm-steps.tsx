"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface AlgorithmStepsProps {
  steps: any[]
  currentStep: number
  algorithm: string
}

export default function AlgorithmSteps({ steps, currentStep, algorithm }: AlgorithmStepsProps) {
  const stepsContainerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to current step
  useEffect(() => {
    if (stepsContainerRef.current && steps.length > 0) {
      const stepElement = stepsContainerRef.current.querySelector(`[data-step="${currentStep}"]`)
      if (stepElement) {
        stepElement.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }, [currentStep, steps.length])

  if (steps.length === 0) {
    return <div className="flex items-center justify-center h-64 text-slate-400">Generating steps...</div>
  }

  return (
    <div ref={stepsContainerRef} className="overflow-y-auto h-[calc(100vh-24rem)] pr-2 space-y-2 custom-scrollbar">
      {steps.map((step, index) => {
        const isCurrent = index === currentStep
        const isPast = index < currentStep

        let stepDescription = ""

        if (algorithm === "dijkstra") {
          if (index === 0) {
            stepDescription = `Initialize distances: Set distance to source node ${step.current} as 0, all others as ∞`
          } else if (step.current !== null) {
            stepDescription = `Visiting node ${step.current} with distance ${step.distances[step.current]}`

            if (step.relaxedEdges && step.relaxedEdges.length > 0) {
              const edgeDescriptions = step.relaxedEdges.map(
                (edge: any) => `${edge.source} → ${edge.target} (new distance: ${step.distances[edge.target]})`,
              )
              stepDescription += `. Relaxing edges: ${edgeDescriptions.join(", ")}`
            }
          } else {
            stepDescription = "Algorithm complete. All nodes visited."
          }
        } else {
          // Bellman-Ford
          if (index === 0) {
            stepDescription = `Initialize distances: Set distance to source node ${step.source} as 0, all others as ∞`
          } else if (step.iteration !== undefined) {
            stepDescription = `Iteration ${step.iteration + 1}`

            if (step.relaxedEdges && step.relaxedEdges.length > 0) {
              const edgeDescriptions = step.relaxedEdges.map(
                (edge: any) => `${edge.source} → ${edge.target} (new distance: ${step.distances[edge.target]})`,
              )
              stepDescription += `. Relaxing edges: ${edgeDescriptions.join(", ")}`
            } else {
              stepDescription += ". No edges relaxed in this iteration."
            }

            if (step.iteration === steps.length - 2) {
              stepDescription += " Final iteration complete."
            }
          } else {
            stepDescription = "Algorithm complete. No negative cycles detected."
          }
        }

        return (
          <motion.div
            key={index}
            data-step={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`p-3 rounded-md border ${
              isCurrent
                ? algorithm === "dijkstra"
                  ? "bg-purple-900/30 border-purple-600"
                  : "bg-orange-900/30 border-orange-600"
                : isPast
                  ? "bg-slate-800/50 border-slate-700"
                  : "bg-slate-800/20 border-slate-700/50"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isCurrent
                    ? algorithm === "dijkstra"
                      ? "bg-purple-600 text-white"
                      : "bg-orange-600 text-white"
                    : "bg-slate-700 text-slate-300"
                }`}
              >
                Step {index + 1}
              </span>

              {isCurrent && (
                <span className="flex h-2 w-2">
                  <span
                    className={`animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 ${
                      algorithm === "dijkstra" ? "bg-purple-400" : "bg-orange-400"
                    }`}
                  ></span>
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      algorithm === "dijkstra" ? "bg-purple-500" : "bg-orange-500"
                    }`}
                  ></span>
                </span>
              )}
            </div>

            <p className="text-sm text-slate-300">{stepDescription}</p>

            {step.distances && (
              <div className="mt-2 grid grid-cols-4 gap-1 text-xs">
                {Object.entries(step.distances).map(([nodeId, distance]: [string, any]) => (
                  <div
                    key={nodeId}
                    className={`px-2 py-1 rounded border ${
                      step.current === Number.parseInt(nodeId)
                        ? algorithm === "dijkstra"
                          ? "bg-purple-900/50 border-purple-600"
                          : "bg-orange-900/50 border-orange-600"
                        : step.visited?.includes(Number.parseInt(nodeId))
                          ? "bg-slate-800 border-slate-600"
                          : "bg-slate-800/30 border-slate-700"
                    }`}
                  >
                    <span className="font-mono">
                      {nodeId}: {distance === Number.POSITIVE_INFINITY ? "∞" : distance}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}

