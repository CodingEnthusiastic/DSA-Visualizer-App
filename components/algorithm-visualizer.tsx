"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import GraphCanvas from "@/components/graph-canvas"
import AlgorithmSteps from "@/components/algorithm-steps"
import TimeComplexityComparison from "@/components/time-complexity-comparison"
import AlgorithmExplanation from "@/components/algorithm-explanation"
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { runDijkstra, runBellmanFord } from "@/lib/algorithms"
import { type Graph, createRandomGraph } from "@/lib/graph"

export default function AlgorithmVisualizer() {
  const [graph, setGraph] = useState<Graph>(() => createRandomGraph(8, 0.4))
  const [algorithm, setAlgorithm] = useState<"dijkstra" | "bellman-ford">("dijkstra")
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [startNode, setStartNode] = useState<number>(0)
  const [steps, setSteps] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState("visualization")
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)

  // Generate algorithm steps when graph or algorithm changes
  useEffect(() => {
    resetVisualization()
    if (algorithm === "dijkstra") {
      setSteps(runDijkstra(graph, startNode))
    } else {
      setSteps(runBellmanFord(graph, startNode))
    }
  }, [graph, algorithm, startNode])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) lastStepTimeRef.current = timestamp

        const elapsed = timestamp - lastStepTimeRef.current
        const stepDuration = 1000 - speed // Map 1-100 to 1000-100ms

        if (elapsed > stepDuration) {
          lastStepTimeRef.current = timestamp
          if (currentStep < steps.length - 1) {
            setCurrentStep((prev) => prev + 1)
          } else {
            setIsRunning(false)
            return
          }
        }

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, currentStep, steps.length, speed])

  const togglePlayPause = () => {
    setIsRunning(!isRunning)
  }

  const resetVisualization = () => {
    setIsRunning(false)
    setCurrentStep(0)
    lastStepTimeRef.current = 0
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const generateNewGraph = () => {
    setGraph(createRandomGraph(8, 0.4))
    resetVisualization()
  }

  const currentStepData = steps[currentStep] || {
    distances: {},
    visited: [],
    current: null,
    relaxedEdges: [],
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="bg-slate-900 p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="visualization" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 hover:bg-slate-700">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 hover:bg-slate-700">
                Time Complexity
              </TabsTrigger>
              <TabsTrigger value="explanation" className="data-[state=active]:bg-white data-[state=active]:text-slate-900 hover:bg-slate-700">
                Explanation
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlgorithm("dijkstra")}
                className={`${algorithm === "dijkstra" ? "bg-white text-slate-900" : "bg-slate-700 hover:bg-slate-600"}`}
              >
                Dijkstra
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAlgorithm("bellman-ford")}
                className={`${algorithm === "bellman-ford" ? "bg-white text-slate-900" : "bg-slate-700 hover:bg-slate-600"}`}
              >
                Bellman-Ford
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="visualization" className="p-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">Graph Visualization</h3>
                <Button variant="outline" size="sm" onClick={generateNewGraph} className="hover:bg-slate-700 bg-red-700">
                  <RotateCcw className="w-4 h-4 mr-2 " />
                  New Graph
                </Button>
              </div>

              <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative">
                <GraphCanvas
                  graph={graph}
                  currentStep={currentStepData}
                  startNode={startNode}
                  setStartNode={setStartNode}
                  algorithm={algorithm}
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={togglePlayPause}
                    disabled={currentStep >= steps.length - 1}
                    
                    className="hover:bg-slate-700 bg-red"
                  >
                    {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={stepForward}
                    disabled={isRunning || currentStep >= steps.length - 1}
                    className="hover:bg-slate-700 bg-red"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetVisualization} className="hover:bg-slate-700 bg-red">
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center space-x-2 flex-1 max-w-xs mx-4">
                  <Zap className="h-4 w-4 text-slate-400" />
                  <Slider
                    value={[speed]}
                    min={1}
                    max={100}
                    step={1}
                    onValueChange={(value) => setSpeed(value[0])}
                    className="flex-1"
                  />
                  <Zap className="h-4 w-4 text-yellow-400" />
                </div>

                <div className="text-sm text-slate-300">
                  Step: {currentStep + 1}/{steps.length}
                </div>
              </div>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Algorithm Steps</h3>
              <AlgorithmSteps steps={steps} currentStep={currentStep} algorithm={algorithm} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="p-4 m-0">
          <TimeComplexityComparison />
        </TabsContent>

        <TabsContent value="explanation" className="p-4 m-0">
          <AlgorithmExplanation algorithm={algorithm} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
