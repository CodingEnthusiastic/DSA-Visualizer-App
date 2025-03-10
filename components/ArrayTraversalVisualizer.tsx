"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'

interface ArrayStep {
  currentIndex: number
  array: number[]
  description: string
  highlightedIndices: number[]
}

export default function ArrayTraversalVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [steps, setSteps] = useState<ArrayStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  
  // Generate a random array on component mount
  useEffect(() => {
    generateNewArray()
  }, [])
  
  // Generate algorithm steps
  useEffect(() => {
    const newSteps: ArrayStep[] = []
    
    // Initial step
    newSteps.push({
      currentIndex: -1,
      array: [...array],
      description: "Array initialized. Traversal not started yet.",
      highlightedIndices: []
    })
    
    // Steps for basic traversal
    for (let i = 0; i < array.length; i++) {
      newSteps.push({
        currentIndex: i,
        array: [...array],
        description: `Visiting element at index ${i} with value ${array[i]}`,
        highlightedIndices: [i]
      })
    }
    
    // Final step
    newSteps.push({
      currentIndex: array.length,
      array: [...array],
      description: "Traversal complete! All elements visited.",
      highlightedIndices: []
    })
    
    setSteps(newSteps)
    setCurrentStep(0)
  }, [array])
  
  // Animation control
  useEffect(() => {
    let timer: NodeJS.Timeout
    
    if (isRunning && currentStep < steps.length - 1) {
      const stepDuration = 1000 - (speed * 9) // Map 1-100 to 1000-100ms
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1)
      }, stepDuration)
    } else if (currentStep >= steps.length - 1) {
      setIsRunning(false)
    }
    
    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isRunning, currentStep, steps.length, speed])
  
  const generateNewArray = () => {
    const size = Math.floor(Math.random() * 6) + 5 // 5-10 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
    setArray(newArray)
    setCurrentStep(0)
    setIsRunning(false)
  }
  
  const togglePlayPause = () => {
    setIsRunning(!isRunning)
  }
  
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }
  
  const resetVisualization = () => {
    setCurrentStep(0)
    setIsRunning(false)
  }
  
  const currentStepData = steps[currentStep] || {
    currentIndex: -1,
    array: [],
    description: "Loading...",
    highlightedIndices: []
  }

  
  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold text-white">Array Traversal</div>
          <Button variant="outline" size="sm" className="bg-red-500 text-white" onClick={generateNewArray}>
            <RotateCcw className="w-4 h-4 mr-2 text-white" />
            New Array
          </Button>
        </div>
      </div>
  
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Array Visualization</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center h-64 mb-4">
                  <div className="flex items-center space-x-1">
                    {currentStepData.array.map((value, index) => (
                      <div
                        key={index}
                        className={`w-5 h-5 sm:w-7 sm:h-7 md:w-11 md:h-11 flex items-center justify-center text-lg font-bold border-2 rounded 
                          ${currentStepData.currentIndex === index 
                            ? "bg-purple-600 border-purple-400 text-white" 
                            : currentStepData.highlightedIndices.includes(index)
                              ? "bg-purple-500/30 border-purple-500 text-white"
                              : "bg-slate-700 border-slate-600 text-slate-200"}`}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
  
                <div className="p-3 bg-slate-700 rounded-md text-center">
                  <p className="text-slate-200">{currentStepData.description}</p>
                </div>
  
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayPause}
                      disabled={currentStep >= steps.length - 1}
                      className="bg-green-500 text-white"
                    >
                      {isRunning ? <Pause className="h-4 w-4 text-white" /> : <Play className="h-4 w-4 text-white" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={stepForward}
                      disabled={isRunning || currentStep >= steps.length - 1}
                      className="bg-red-500 text-white"
                    >
                      <SkipForward className="h-4 w-4 text-white" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={resetVisualization} className="bg-blue-500 text-white">
                      <RotateCcw className="h-4 w-4 text-white" />
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
              </CardContent>
            </Card>
          </div>
  
          <div>
            <Card className="bg-slate-900 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-purple-400">Array Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2 text-yellow-400">Time Complexity</h3>
                    <div className="p-3 bg-slate-700 rounded-md">
                      <p className="text-sm text-white">
                        <span className="font-mono text-green-400">Traversal: O(n)</span> - We must visit each element once.
                      </p>
                    </div>
                  </div>
  
                  <div>
                    <h3 className="text-base font-medium mb-2 text-yellow-400">Common Operations</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between p-2 bg-slate-700 rounded-md text-white">
                        <span>Access</span>
                        <span className="font-mono text-green-400">O(1)</span>
                      </li>
                      <li className="flex justify-between p-2 bg-slate-700 rounded-md text-white">
                        <span>Search</span>
                        <span className="font-mono text-green-400">O(n)</span>
                      </li>
                      <li className="flex justify-between p-2 bg-slate-700 rounded-md text-white">
                        <span>Insertion</span>
                        <span className="font-mono text-green-400">O(n)</span>
                      </li>
                      <li className="flex justify-between p-2 bg-slate-700 rounded-md text-white">
                        <span>Deletion</span>
                        <span className="font-mono text-green-400">O(n)</span>
                      </li>
                    </ul>
                  </div>
  
                  <div className="text-xs text-slate-400">
                    <p>Array traversal is the foundation for many algorithms including searching, filtering, and transforming data.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
  
}
