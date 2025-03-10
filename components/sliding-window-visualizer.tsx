"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SlidingWindowStep {
  windowStart: number
  windowEnd: number
  array: number[]
  currentSum: number
  maxSum: number
  description: string
}

export default function SlidingWindowVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [windowSize, setWindowSize] = useState(3)
  const [steps, setSteps] = useState<SlidingWindowStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [problem, setProblem] = useState<"maxSum" | "minSubarray" | "longestSubstring">("maxSum")
  
  // Generate a random array on component mount
  useEffect(() => {
    generateNewArray()
  }, [])
  
  // Generate algorithm steps
  useEffect(() => {
    if (array.length === 0) return
    
    let newSteps: SlidingWindowStep[] = []
    
    if (problem === "maxSum") {
      // Maximum Sum Subarray of Size K
      let maxSum = 0
      let windowSum = 0
      
      // Initial step
      newSteps.push({
        windowStart: 0,
        windowEnd: -1,
        array: [...array],
        currentSum: 0,
        maxSum: 0,
        description: "Initialize sliding window algorithm for maximum sum of size " + windowSize
      })
      
      // First window
      for (let i = 0; i < windowSize && i < array.length; i++) {
        windowSum += array[i]
        newSteps.push({
          windowStart: 0,
          windowEnd: i,
          array: [...array],
          currentSum: windowSum,
          maxSum: windowSum,
          description: `Building initial window: Add element at index ${i} (${array[i]}). Current sum: ${windowSum}`
        })
      }
      
      maxSum = windowSum
      
      // Slide the window
      for (let end = windowSize; end < array.length; end++) {
        const start = end - windowSize
        windowSum = windowSum - array[start] + array[end]
        
        // Remove element from start
        newSteps.push({
          windowStart: start + 1,
          windowEnd: end - 1,
          array: [...array],
          currentSum: windowSum - array[end],
          maxSum: maxSum,
          description: `Slide window: Remove element at index ${start} (${array[start]}). Current sum: ${windowSum - array[end]}`
        })
        
        // Add element at end
        newSteps.push({
          windowStart: start + 1,
          windowEnd: end,
          array: [...array],
          currentSum: windowSum,
          maxSum: Math.max(maxSum, windowSum),
          description: `Add element at index ${end} (${array[end]}). Current sum: ${windowSum}`
        })
        
        // Update max sum if needed
        if (windowSum > maxSum) {
          maxSum = windowSum
          newSteps.push({
            windowStart: start + 1,
            windowEnd: end,
            array: [...array],
            currentSum: windowSum,
            maxSum: maxSum,
            description: `Found new maximum sum: ${maxSum}`
          })
        }
      }
      
      // Final step
      newSteps.push({
        windowStart: array.length - windowSize,
        windowEnd: array.length - 1,
        array: [...array],
        currentSum: windowSum,
        maxSum: maxSum,
        description: `Algorithm complete! Maximum sum: ${maxSum}`
      })
    }
    
    setSteps(newSteps)
    setCurrentStep(0)
  }, [array, windowSize, problem])
  
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
    const size = Math.floor(Math.random() * 6) + 10 // 10-15 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 20) - 5) // Some negative numbers for interest
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
    windowStart: 0,
    windowEnd: -1,
    array: [],
    currentSum: 0,
    maxSum: 0,
    description: "Loading..."
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <div className="text-lg font-semibold">Sliding Window</div>
            <div className="text-xs text-slate-400">An efficient way to process subarrays</div>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <Select
              value={problem}
              onValueChange={(value) => setProblem(value as any)}
            >
              <SelectTrigger className="w-[180px] text-black">
                <SelectValue placeholder="Select Problem" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="maxSum">Maximum Sum</SelectItem>
                <SelectItem value="minSubarray">Minimum Subarray</SelectItem>
                <SelectItem value="longestSubstring">Longest Substring</SelectItem>
              </SelectContent>
            </Select>
            
            <div className="flex items-center">
              <span className="text-sm mr-2">Window Size:</span>
              <Select
                value={windowSize.toString()}
                onValueChange={(value) => setWindowSize(parseInt(value))}
              >
                <SelectTrigger className="w-[80px] text-black">
                  <SelectValue placeholder="K" />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5].map(size => (
                    <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" onClick={generateNewArray} className="bg-red-450">
              <RotateCcw className="w-4 h-4 mr-2" />
              New Array
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>{problem === "maxSum" ? "Maximum Sum Subarray" : problem === "minSubarray" ? "Minimum Size Subarray Sum" : "Longest Substring without Repeating Characters"}</CardTitle>
                <CardDescription>
                  {problem === "maxSum" 
                    ? `Find the subarray of size ${windowSize} with the maximum sum`
                    : problem === "minSubarray"
                      ? "Find the minimum length subarray with sum ≥ target"
                      : "Find the longest substring without repeating characters"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative py-8">
                    <div className="flex justify-center">
                      <div className="flex flex-wrap gap-1 max-w-2xl">
                        {currentStepData.array.map((value, index) => {
                          const isInWindow = index >= currentStepData.windowStart && index <= currentStepData.windowEnd
                          
                          return (
                            <div
                              key={index}
                              className={`w-12 h-12 flex items-center justify-center text-base font-bold border-2 rounded
                                ${isInWindow
                                  ? "bg-purple-600 border-purple-400 text-white" 
                                  : "bg-slate-700 border-slate-600 text-slate-200"}`}
                            >
                              {value}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Index labels */}
                    <div className="flex justify-center mt-2">
                      <div className="flex flex-wrap gap-1 max-w-2xl">
                        {currentStepData.array.map((_, index) => (
                          <div key={index} className="w-12 flex justify-center text-xs text-slate-400">
                            {index}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Current window markers */}
                    {currentStepData.windowEnd >= 0 && (
                      <div className="flex justify-center mt-2">
                        <div className="flex flex-wrap gap-1 max-w-2xl">
                          {currentStepData.array.map((_, index) => {
                            const isStart = index === currentStepData.windowStart
                            const isEnd = index === currentStepData.windowEnd
                            
                            return (
                              <div key={index} className="w-12 flex justify-center">
                                {isStart && <div className="text-xs font-semibold text-green-400">start</div>}
                                {isEnd && <div className="text-xs font-semibold text-yellow-400">end</div>}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-slate-700 p-3 rounded-md">
                      <div className="text-xs text-slate-400">Current Sum</div>
                      <div className="text-lg font-bold text-red-500">{currentStepData.currentSum}</div>
                    </div>
                    <div className="bg-slate-700 p-3 rounded-md">
                      <div className="text-xs text-slate-400">Maximum Sum</div>
                      <div className="text-lg font-bold text-purple-400">{currentStepData.maxSum}</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-md">
                    <p className="text-slate-200">{currentStepData.description}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayPause}
                      disabled={currentStep >= steps.length - 1}
                    >
                      {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={stepForward}
                      disabled={isRunning || currentStep >= steps.length - 1}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={resetVisualization}>
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

                  <div className="text-sm text-slate-600">
                    Step: {currentStep + 1}/{steps.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Sliding Window Technique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Time Complexity</h3>
                    <div className="p-3 rounded-md bg-green-200 text-red-600">
                      <p className="text-sm ">
                        <span className="font-mono">O(n)</span> - We process each element at most twice (once adding, once removing)
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">When to Use</h3>
                    <ul className="space-y-2 text-sm text-white">
                      <li className="p-2 bg-slate-700 rounded-md">
                        Calculating a running average or sum
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        Finding subarrays that meet certain criteria
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        String problems involving substrings
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        Fixed or variable size window problems
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs text-black">
                    <p>The sliding window pattern is particularly useful when we need to keep track of a subset of elements in an array or string.</p>
                    <p className="mt-2">It's a significant improvement over nested loops for many problems, reducing time complexity from O(n²) to O(n).</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
