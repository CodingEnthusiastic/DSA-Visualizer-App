"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TwoPointersStep {
  leftIndex: number
  rightIndex: number
  array: number[]
  result: number[] | boolean
  description: string
}

export default function TwoPointersVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [steps, setSteps] = useState<TwoPointersStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [problem, setProblem] = useState<"pairSum" | "palindrome" | "removeDuplicates">("pairSum")
  const [target, setTarget] = useState(10)
  
  // Generate a random array on component mount
  useEffect(() => {
    generateNewArray()
  }, [])
  
  // Generate algorithm steps
  useEffect(() => {
    if (array.length === 0) return
    
    let newSteps: TwoPointersStep[] = []
    
    if (problem === "pairSum") {
      // Pair with target sum
      const sortedArray = [...array].sort((a, b) => a - b)
      
      // Initial step
      newSteps.push({
        leftIndex: 0,
        rightIndex: sortedArray.length - 1,
        array: [...sortedArray],
        result: [],
        description: `Initialize two pointers to find pair with sum ${target}`
      })
      
      let left = 0
      let right = sortedArray.length - 1
      let foundPair = false
      
      while (left < right) {
        const currentSum = sortedArray[left] + sortedArray[right]
        
        newSteps.push({
          leftIndex: left,
          rightIndex: right,
          array: [...sortedArray],
          result: [],
          description: `Current sum: ${sortedArray[left]} + ${sortedArray[right]} = ${currentSum}`
        })
        
        if (currentSum === target) {
          foundPair = true
          newSteps.push({
            leftIndex: left,
            rightIndex: right,
            array: [...sortedArray],
            result: [sortedArray[left], sortedArray[right]],
            description: `Found pair with target sum: ${sortedArray[left]} + ${sortedArray[right]} = ${target}`
          })
          break
        } else if (currentSum < target) {
          newSteps.push({
            leftIndex: left,
            rightIndex: right,
            array: [...sortedArray],
            result: [],
            description: `Sum ${currentSum} < ${target}, move left pointer right`
          })
          left++
        } else {
          newSteps.push({
            leftIndex: left,
            rightIndex: right,
            array: [...sortedArray],
            result: [],
            description: `Sum ${currentSum} > ${target}, move right pointer left`
          })
          right--
        }
      }
      
      if (!foundPair) {
        newSteps.push({
          leftIndex: left,
          rightIndex: right,
          array: [...sortedArray],
          result: [],
          description: `No pair found with sum ${target}`
        })
      }
    } else if (problem === "palindrome") {
      // Check if string is a palindrome
      const characters = array.map(val => String.fromCharCode(97 + (val % 26))) // Convert to lowercase letters
      
      // Initial step
      newSteps.push({
        leftIndex: 0,
        rightIndex: characters.length - 1,
        array: characters.map(char => char.charCodeAt(0) - 97),
        result: true,
        description: `Initialize two pointers to check if "${characters.join('')}" is a palindrome`
      })
      
      let left = 0
      let right = characters.length - 1
      let isPalindrome = true
      
      while (left < right) {
        const leftChar = characters[left]
        const rightChar = characters[right]
        
        if (leftChar === rightChar) {
          newSteps.push({
            leftIndex: left,
            rightIndex: right,
            array: characters.map(char => char.charCodeAt(0) - 97),
            result: true,
            description: `Characters match: ${leftChar} = ${rightChar}. Move both pointers inward.`
          })
          left++
          right--
        } else {
          isPalindrome = false
          newSteps.push({
            leftIndex: left,
            rightIndex: right,
            array: characters.map(char => char.charCodeAt(0) - 97),
            result: false,
            description: `Characters don't match: ${leftChar} ≠ ${rightChar}. Not a palindrome.`
          })
          break
        }
      }
      
      // Final step
      if (isPalindrome) {
        newSteps.push({
          leftIndex: Math.floor(characters.length / 2),
          rightIndex: Math.floor(characters.length / 2),
          array: characters.map(char => char.charCodeAt(0) - 97),
          result: true,
          description: `"${characters.join('')}" is a palindrome!`
        })
      }
    } else if (problem === "removeDuplicates") {
      // Remove duplicates from sorted array
      const sortedArray = [...array].sort((a, b) => a - b)
      
      // Initial step
      newSteps.push({
        leftIndex: 0,
        rightIndex: 1,
        array: [...sortedArray],
        result: [sortedArray[0]],
        description: `Initialize pointers to remove duplicates. First unique element: ${sortedArray[0]}`
      })
      
      let insertIndex = 1
      const uniqueElements = [sortedArray[0]]
      
      for (let i = 1; i < sortedArray.length; i++) {
        if (sortedArray[i] !== sortedArray[i-1]) {
          uniqueElements.push(sortedArray[i])
          newSteps.push({
            leftIndex: insertIndex,
            rightIndex: i,
            array: [...sortedArray],
            result: [...uniqueElements],
            description: `Found new unique element: ${sortedArray[i]}. Add to result.`
          })
          insertIndex++
        } else {
          newSteps.push({
            leftIndex: insertIndex - 1,
            rightIndex: i,
            array: [...sortedArray],
            result: [...uniqueElements],
            description: `Duplicate found: ${sortedArray[i]}. Skip it.`
          })
        }
      }
      
      // Final step
      newSteps.push({
        leftIndex: insertIndex - 1,
        rightIndex: sortedArray.length - 1,
        array: [...sortedArray],
        result: [...uniqueElements],
        description: `Removed all duplicates! Unique elements: ${uniqueElements.join(', ')}`
      })
    }
    
    setSteps(newSteps)
    setCurrentStep(0)
  }, [array, problem, target])
  
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
    const size = Math.floor(Math.random() * 6) + 8 // 8-13 elements
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 20))
    setArray(newArray)
    
    // Set a random target for pair sum problem
    const randomTarget = Math.floor(Math.random() * 30) + 5
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
  
  const currentStepData = steps[currentStep] || {
    leftIndex: 0,
    rightIndex: 0,
    array: [],
    result: problem === "pairSum" ? [] : true,
    description: "Loading..."
  }

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <div className="text-lg font-semibold">Two Pointers Technique</div>
            <div className="text-xs text-slate-400">Efficiently solve array and string problems</div>
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
                <SelectItem value="pairSum">Pair with Target Sum</SelectItem>
                <SelectItem value="palindrome">Check Palindrome</SelectItem>
                <SelectItem value="removeDuplicates">Remove Duplicates</SelectItem>
              </SelectContent>
            </Select>
            
            {problem === "pairSum" && (
              <div className="flex items-center">
                <span className="text-sm mr-2">Target:</span>
                <Select
                  value={target.toString()}
                  onValueChange={(value) => setTarget(parseInt(value))}
                  
                >
                  <SelectTrigger className="w-[70px] text-black">
                    <SelectValue placeholder="Target" />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20, 25, 30].map(t => (
                      <SelectItem key={t} value={t.toString()}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <Button variant="outline" size="sm" onClick={generateNewArray} className="bg-red-500 text-white">
              <RotateCcw className="w-4 h-4 mr-2 " />
              New Data
            </Button>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>
                  {problem === "pairSum" 
                    ? `Find Pair with Sum ${target}`
                    : problem === "palindrome" 
                      ? "Check if String is Palindrome"
                      : "Remove Duplicates from Sorted Array"
                  }
                </CardTitle>
                <CardDescription>
                  {problem === "pairSum" 
                    ? "Find two numbers that add up to the target sum"
                    : problem === "palindrome"
                      ? "Check if a string reads the same forward and backward"
                      : "Remove duplicates in-place from a sorted array"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="relative py-8">
                    <div className="flex justify-center">
                      <div className="flex flex-wrap gap-1 max-w-2xl">
                        {currentStepData.array.map((value, index) => {
                          const isLeftPointer = index === currentStepData.leftIndex
                          const isRightPointer = index === currentStepData.rightIndex
                          const displayValue = problem === "palindrome" 
                            ? String.fromCharCode(97 + value) // Convert to letter
                            : value

                          // If result contains this value (for pairSum)
                          const isInResult = Array.isArray(currentStepData.result) && 
                            currentStepData.result.includes(value) &&
                            (index === currentStepData.leftIndex || index === currentStepData.rightIndex)
                          
                          return (
                            <div
                              key={index}
                              className={`w-12 h-12 flex items-center justify-center text-base font-bold border-2 rounded
                                ${isInResult
                                  ? "bg-green-600 border-green-400 text-white"
                                  : isLeftPointer || isRightPointer
                                    ? "bg-purple-600 border-purple-400 text-white" 
                                    : Array.isArray(currentStepData.result) && currentStepData.result.includes(value)
                                      ? "bg-purple-500/30 border-purple-500 text-white"
                                      : "bg-slate-700 border-slate-600 text-slate-200"}`}
                            >
                              {displayValue}
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
                          const isLeftPointer = index === currentStepData.leftIndex
                          const isRightPointer = index === currentStepData.rightIndex
                          
                          return (
                            <div key={index} className="w-12 flex justify-center">
                              {isLeftPointer && <div className="text-xs font-semibold text-green-400">left</div>}
                              {isRightPointer && <div className="text-xs font-semibold text-yellow-400">right</div>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-slate-700 rounded-md">
                    <p className="text-slate-200">{currentStepData.description}</p>
                  </div>
                  
                  {problem === "removeDuplicates" && Array.isArray(currentStepData.result) && (
                    <div className="mt-4 p-3 bg-slate-800 rounded-md">
                      <div className="text-sm text-slate-400 mb-2">Current Unique Elements:</div>
                      <div className="flex flex-wrap gap-1">
                        {currentStepData.result.map((value, idx) => (
                          <div key={idx} className="px-2 py-1 bg-purple-600/30 border border-purple-500 rounded text-white">
                            {value}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
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

                  <div className="text-sm text-slate-700">
                    Step: {currentStep + 1}/{steps.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Two Pointers Technique</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Time Complexity</h3>
                    <div className="p-3 bg-slate-700 rounded-md">
                      <p className="text-sm text-white">
                        <span className="font-mono">O(n)</span> - Since we're only traversing the array once, the time complexity is linear
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-base font-medium mb-2">Common Use Cases</h3>
                    <ul className="space-y-2 text-sm text-white">
                      <li className="p-2 bg-slate-700 rounded-md">
                        Searching for pairs in a sorted array
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        Comparing opposite ends of an array/string
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        In-place array transformations
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        Merging two sorted arrays
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs text-slate-700">
                    <p>The two pointers technique is most effective when working with sorted data structures or when relationships exist between pairs of elements.</p>
                    <p className="mt-2">It often reduces the time complexity from O(n²) to O(n), making it a powerful optimization for many problems.</p>
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
