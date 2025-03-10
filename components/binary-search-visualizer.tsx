"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipForward, RotateCcw, Zap, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"

interface BinarySearchStep {
  left: number
  right: number
  mid: number
  comparison: number | null
  found: boolean | null
  array: number[]
  description: string
}

export default function BinarySearchVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [steps, setSteps] = useState<BinarySearchStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [target, setTarget] = useState<number>(42)
  
  // Generate a random sorted array on component mount
  useEffect(() => {
    generateNewArray()
  }, [])
  
  // Generate algorithm steps when array or target changes
  useEffect(() => {
    if (array.length === 0) return
    
    const newSteps: BinarySearchStep[] = []
    let left = 0
    let right = array.length - 1
    let foundTarget = false
    
    // Initial step
    newSteps.push({
      left,
      right,
      mid: Math.floor((left + right) / 2),
      comparison: null,
      found: null,
      array: [...array],
      description: `Initialize binary search for target ${target}`
    })
    
    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      const midValue = array[mid]
      
      // Step before comparison
      newSteps.push({
        left,
        right,
        mid,
        comparison: midValue,
        found: null,
        array: [...array],
        description: `Examining middle element at index ${mid} with value ${midValue}`
      })
      
      if (midValue === target) {
        foundTarget = true
        newSteps.push({
          left,
          right,
          mid,
          comparison: midValue,
          found: true,
          array: [...array],
          description: `Found target ${target} at index ${mid}!`
        })
        break
      } else if (midValue < target) {
        newSteps.push({
          left,
          right,
          mid,
          comparison: midValue,
          found: false,
          array: [...array],
          description: `${midValue} < ${target}, search right half`
        })
        left = mid + 1
      } else {
        newSteps.push({
          left,
          right,
          mid,
          comparison: midValue,
          found: false,
          array: [...array],
          description: `${midValue} > ${target}, search left half`
        })
        right = mid - 1
      }
    }
    
    if (!foundTarget) {
      newSteps.push({
        left,
        right,
        mid: Math.floor((left + right) / 2),
        comparison: null,
        found: false,
        array: [...array],
        description: `Target ${target} not found in the array`
      })
    }
    
    setSteps(newSteps)
    setCurrentStep(0)
  }, [array, target])
  
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
    const size = Math.floor(Math.random() * 6) + 15 // 15-20 elements
    // Generate sorted array with no duplicates
    const newArray = Array.from(new Set(
      Array.from({ length: size * 2 }, () => Math.floor(Math.random() * 100))
    )).slice(0, size).sort((a, b) => a - b)
    
    setArray(newArray)
    
    // Set a random target (sometimes in the array, sometimes not)
    const randomIndex = Math.floor(Math.random() * (newArray.length + 5))
    const randomTarget = randomIndex < newArray.length 
      ? newArray[randomIndex]  // Target exists in array
      : Math.floor(Math.random() * 100) // Random target (might not exist)
    
    setTarget(randomTarget)
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
  
  const handleTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value)
    if (!isNaN(value)) {
      setTarget(value)
    }
  }
  
  const currentStepData = steps[currentStep] || {
    left: 0,
    right: array.length - 1,
    mid: Math.floor((0 + array.length - 1) / 2),
    comparison: null,
    found: null,
    array: [],
    description: "Loading..."
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <div className="text-lg font-semibold">Binary Search</div>
            <div className="text-xs text-slate-400">O(log n) search in sorted arrays</div>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-white">Target:</span>
              <Input 
                type="number" 
                value={target} 
                onChange={handleTargetChange}
                className="w-20 h-9 text-black"
              />
            </div>
            
            <Button variant="outline" size="sm" onClick={generateNewArray} className="bg-red-400">
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
                <CardTitle>Binary Search Visualization</CardTitle>
                <CardDescription>
                  Looking for {target} in a sorted array
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {/* Binary search visualization */}
                  <div className="relative py-8">
                    <div className="flex justify-center">
                      <div className="flex flex-wrap gap-1 max-w-2xl">
                        {currentStepData.array.map((value, index) => {
                          const isLeft = index === currentStepData.left && index !== currentStepData.mid
                          const isRight = index === currentStepData.right && index !== currentStepData.mid
                          const isMid = index === currentStepData.mid
                          const isInSearchRange = index >= currentStepData.left && index <= currentStepData.right
                          const isTarget = value === target
                          const isFound = isMid && currentStepData.found === true
                          
                          return (
                            <div
                              key={index}
                              className={`w-12 h-12 flex items-center justify-center text-base font-bold border-2 rounded
                                ${isFound
                                  ? "bg-green-600 border-green-400 text-white"
                                  : isMid
                                    ? "bg-purple-600 border-purple-400 text-white"
                                    : isLeft || isRight
                                      ? "bg-indigo-600 border-indigo-400 text-white"
                                      : isInSearchRange 
                                        ? "bg-slate-700 border-slate-600 text-slate-200"
                                        : "bg-slate-800/50 border-slate-700/50 text-slate-400"
                                }
                                ${isTarget && !isFound ? "ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-800" : ""}`}
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
                    
                    {/* Pointer labels */}
                    <div className="flex justify-center mt-2">
                      <div className="flex flex-wrap gap-1 max-w-2xl">
                        {currentStepData.array.map((_, index) => {
                          const isLeft = index === currentStepData.left && currentStepData.left <= currentStepData.right
                          const isRight = index === currentStepData.right && currentStepData.left <= currentStepData.right
                          const isMid = index === currentStepData.mid
                          
                          return (
                            <div key={index} className="w-12 flex justify-center">
                              {isLeft && <div className="text-xs font-semibold text-blue-400">left</div>}
                              {isMid && <div className="text-xs font-semibold text-purple-400">mid</div>}
                              {isRight && <div className="text-xs font-semibold text-yellow-400">right</div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Search range visualization */}
                  <div className="bg-slate-700 p-3 rounded-md mb-4">
                    <div className="flex items-center mb-2">
                      <Search className="w-4 h-4 mr-2 text-slate-400" />
                      <span className="text-sm font-medium text-white">Current Search Space</span>
                    </div>
                    <div className="relative h-6 bg-slate-800 rounded overflow-hidden">
                      {currentStepData.left <= currentStepData.right && (
                        <div 
                          className="absolute h-full bg-purple-600/30"
                          style={{
                            left: `${(currentStepData.left / currentStepData.array.length) * 100}%`,
                            width: `${((currentStepData.right - currentStepData.left + 1) / currentStepData.array.length) * 100}%`
                          }}
                        ></div>
                      )}
                      {currentStepData.mid <= currentStepData.right && currentStepData.mid >= currentStepData.left && (
                        <div 
                          className="absolute h-full w-1 bg-purple-500"
                          style={{
                            left: `${(currentStepData.mid / currentStepData.array.length) * 100}%`,
                          }}
                        ></div>
                      )}
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
                <CardTitle>Binary Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Time Complexity</h3>
                    <div className="p-3 bg-slate-700 rounded-md">
                      <p className="text-sm text-white">
                        <span className="font-mono text-green-300">O(log n)</span> - We eliminate half of the remaining elements in each step
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">When to Use</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="p-2 bg-slate-700 rounded-md text-white">
                        Searching in sorted arrays
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md text-white">
                        Finding elements in sorted data structures
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md text-white">
                        Finding insertion points in sorted arrays
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md text-white">
                        Finding boundaries in monotonic functions
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs text-black" >
                    <p>Binary search is significantly faster than linear search for large datasets. For example, finding an element in a million-item sorted array would take at most 20 comparisons with binary search.</p>
                    <p className="mt-2">The key requirement is that the data must be sorted, and random access must be available (like in arrays).</p>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Comparisons</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-slate-700 rounded-md">
                        <span className="block font-semibold mb-1 text-white">Linear Search</span>
                        <span className="font-mono text-blue-400">O(n)</span>
                      </div>
                      <div className="p-2 bg-slate-700 rounded-md">
                        <span className="block font-semibold mb-1 text-white">Binary Search</span>
                        <span className="font-mono text-orange-500">O(log n)</span>
                      </div>
                    </div>
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
