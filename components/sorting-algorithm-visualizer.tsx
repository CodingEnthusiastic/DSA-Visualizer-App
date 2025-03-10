"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Play, Pause, SkipForward, RotateCcw, Zap } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartGrid, ChartLine, ChartLineSeries, ChartAxis, Chart } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";



interface SortingStep {
  array: number[]
  comparing: number[]
  swapping: number[]
  description: string
  sorted: number[]
}

type SortingAlgorithm = "bubble" | "selection" | "insertion" | "merge" | "quick" | "heap"

export default function SortingAlgorithmsVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [steps, setSteps] = useState<SortingStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [algorithm, setAlgorithm] = useState<SortingAlgorithm>("bubble")
  const [arraySize, setArraySize] = useState(10)
  
  // Generate a random array on component mount
  useEffect(() => {
    generateNewArray()
  }, [arraySize])
  
  // Generate algorithm steps
  useEffect(() => {
    if (array.length === 0) return
    
    const newSteps: SortingStep[] = []
    
    // Initial step
    newSteps.push({
      array: [...array],
      comparing: [],
      swapping: [],
      description: `Initialize ${getAlgorithmName(algorithm)} sort for an array of ${array.length} elements`,
      sorted: []
    })
    
    switch (algorithm) {
      case "bubble":
        generateBubbleSortSteps(newSteps)
        break
      case "selection":
        generateSelectionSortSteps(newSteps)
        break
      case "insertion":
        generateInsertionSortSteps(newSteps)
        break
      case "merge":
        generateMergeSortSteps(newSteps)
        break
      case "quick":
        generateQuickSortSteps(newSteps)
        break
      case "heap":
        generateHeapSortSteps(newSteps)
        break
    }
    
    setSteps(newSteps)
    setCurrentStep(0)
  }, [array, algorithm])
  
  const generateBubbleSortSteps = (steps: SortingStep[]) => {
    const arr = [...array]
    const n = arr.length
    const sorted: number[] = []
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Step: comparing elements
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          description: `Comparing elements at indices ${j} and ${j + 1}: ${arr[j]} and ${arr[j + 1]}`,
          sorted: [...sorted]
        })
        
        if (arr[j] > arr[j + 1]) {
          // Step: swapping elements
          steps.push({
            array: [...arr],
            comparing: [],
            swapping: [j, j + 1],
            description: `Swapping ${arr[j]} and ${arr[j + 1]} because ${arr[j]} > ${arr[j + 1]}`,
            sorted: [...sorted]
          })
          
          // Perform swap
          const a= arr[j]
          arr[j] = arr[j+1]
          arr[j+1] = a

          //[arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
        }
      }
      
      // Mark the last - i element as sorted
      sorted.unshift(n - i - 1)
      
      // Step: element in place
      if (i < n - 1) {
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [],
          description: `Element ${arr[n - i - 1]} is now in its correct position at index ${n - i - 1}`,
          sorted: [...sorted]
        })
      }
    }
    
    // Final step
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Bubble Sort: ${arr.join(', ')}`,
      sorted: [...Array(n).keys()]
    })
  }
  
  const generateSelectionSortSteps = (steps: SortingStep[]) => {
    const arr = [...array]
    const n = arr.length
    const sorted: number[] = []
    
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i
      
      // Step: start looking for minimum
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        description: `Finding the minimum element in the unsorted subarray[${i}...${n-1}]`,
        sorted: [...sorted]
      })
      
      // Find the minimum element in unsorted array
      for (let j = i + 1; j < n; j++) {
        // Step: comparing to find minimum
        steps.push({
          array: [...arr],
          comparing: [minIndex, j],
          swapping: [],
          description: `Comparing current minimum ${arr[minIndex]} at index ${minIndex} with ${arr[j]} at index ${j}`,
          sorted: [...sorted]
        })
        
        if (arr[j] < arr[minIndex]) {
          // Update minimum index
          minIndex = j
          
          // Step: new minimum found
          steps.push({
            array: [...arr],
            comparing: [minIndex],
            swapping: [],
            description: `Found new minimum value ${arr[minIndex]} at index ${minIndex}`,
            sorted: [...sorted]
          })
        }
      }
      
      // Swap the minimum element with the first element of unsorted subarray
      if (minIndex !== i) {
        // Step: swapping elements
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [i, minIndex],
          description: `Swapping ${arr[i]} at index ${i} with minimum value ${arr[minIndex]} at index ${minIndex}`,
          sorted: [...sorted]
        })
        
        // Perform swap

        //[arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        const b=arr[i]
        arr[i]=arr[minIndex]
        arr[minIndex]=arr[i]
      }
      
      // Mark element as sorted
      sorted.push(i)
      
      // Step: element in place
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        description: `Element ${arr[i]} is now in its correct position at index ${i}`,
        sorted: [...sorted]
      })
    }
    
    // Mark the last element as sorted too
    sorted.push(n - 1)
    
    // Final step
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Selection Sort: ${arr.join(', ')}`,
      sorted: [...sorted]
    })
  }
  
  const generateInsertionSortSteps = (steps: SortingStep[]) => {
    const arr = [...array]
    const n = arr.length
    const sorted: number[] = [0]  // First element is initially sorted
    
    // Step: start with first element sorted
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: `Start with the first element as sorted: ${arr[0]}`,
      sorted: [...sorted]
    })
    
    for (let i = 1; i < n; i++) {
      const key = arr[i]
      let j = i - 1
      
      // Step: consider new element
      steps.push({
        array: [...arr],
        comparing: [i],
        swapping: [],
        description: `Inserting element ${key} at index ${i} into the sorted subarray`,
        sorted: [...sorted]
      })
      
      while (j >= 0 && arr[j] > key) {
        // Step: comparing with sorted elements
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [],
          description: `Comparing ${arr[j]} at index ${j} with ${key}`,
          sorted: [...sorted]
        })
        
        // Step: moving element right
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          description: `Moving ${arr[j]} to the right to position ${j + 1}`,
          sorted: [...sorted]
        })
        
        // Shift element right
        arr[j + 1] = arr[j]
        j--
      }
      
      // Place key at correct position
      arr[j + 1] = key
      
      // If key moved at least once
      if (j + 1 !== i) {
        // Step: inserting key
        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j + 1],
          description: `Inserting ${key} at position ${j + 1}`,
          sorted: [...sorted]
        })
      }
      
      // Mark up to i as sorted
      sorted.push(i)
      
      // Step: subarray now sorted
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        description: `Sorted subarray is now [${arr.slice(0, i + 1).join(', ')}]`,
        sorted: [...sorted]
      })
    }
    
    // Final step
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Insertion Sort: ${arr.join(', ')}`,
      sorted: [...Array(n).keys()]
    })
  }
  
  const generateMergeSortSteps = (steps: SortingStep[]) => {
    // Simplification - we'll just show some key steps of merge sort
    // In a real implementation, we'd recursively track each division and merge
    const arr = [...array]
    const n = arr.length
    
    // Step: explain merge sort
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: "Merge sort uses divide-and-conquer approach. In practice, it would recursively divide the array until single elements.",
      sorted: []
    })
    
    // Show a few divisions (simplified)
    const midpoint = Math.floor(n / 2)
    
    // Step: divide into two halves
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: `Dividing array into two halves: [${arr.slice(0, midpoint).join(', ')}] and [${arr.slice(midpoint).join(', ')}]`,
      sorted: []
    })
    
    // Show a simple merge result
    const sortedArray = [...arr].sort((a, b) => a - b)
    
    // Step: show sorted result
    steps.push({
      array: sortedArray,
      comparing: [],
      swapping: [],
      description: "After all divisions and merges, the array is sorted",
      sorted: [...Array(n).keys()]
    })
    
    // Final step
    steps.push({
      array: [...sortedArray],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Merge Sort: ${sortedArray.join(', ')}`,
      sorted: [...Array(n).keys()]
    })
  }
  
  const generateQuickSortSteps = (steps: SortingStep[]) => {
    // Simplified quick sort visualization - showing key concepts
    const arr = [...array]
    const n = arr.length
    
    // Step: explain quick sort
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: "Quick sort uses divide-and-conquer with a pivot. In practice, it would recursively partition the array.",
      sorted: []
    })
    
    // Show a simple partition example
    const pivotIndex = Math.floor(n / 2)
    const pivot = arr[pivotIndex]
    
    // Step: select pivot
    steps.push({
      array: [...arr],
      comparing: [pivotIndex],
      swapping: [],
      description: `Selected pivot element: ${pivot} at index ${pivotIndex}`,
      sorted: []
    })
    
    // Show a simple sorted result
    const sortedArray = [...arr].sort((a, b) => a - b)
    
    // Step: show result after partitioning and recursion
    steps.push({
      array: sortedArray,
      comparing: [],
      swapping: [],
      description: "After all partitioning and recursive calls, the array is sorted",
      sorted: []
    })
    
    // Final step
    steps.push({
      array: [...sortedArray],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Quick Sort: ${sortedArray.join(', ')}`,
      sorted: [...Array(n).keys()]
    })
  }
  
  const generateHeapSortSteps = (steps: SortingStep[]) => {
    // Simplified heap sort visualization
    const arr = [...array]
    const n = arr.length
    
    // Step: explain heap sort
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: "Heap sort builds a max heap and extracts elements one by one.",
      sorted: []
    })
    
    // Skip actual heap building steps for simplicity
    
    // Step: max heap built
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      description: "Max heap has been built (not shown in detail)",
      sorted: []
    })
    
    // Show a simple sorted result
    const sortedArray = [...arr].sort((a, b) => a - b)
    
    // Step: show sorted result
    steps.push({
      array: sortedArray,
      comparing: [],
      swapping: [],
      description: "After extracting all elements from the heap, the array is sorted",
      sorted: []
    })
    
    // Final step
    steps.push({
      array: [...sortedArray],
      comparing: [],
      swapping: [],
      description: `Array is now sorted using Heap Sort: ${sortedArray.join(', ')}`,
      sorted: [...Array(n).keys()]
    })
  }
  
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
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100))
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
  
  const getAlgorithmName = (algo: SortingAlgorithm): string => {
    switch (algo) {
      case "bubble": return "Bubble"
      case "selection": return "Selection"
      case "insertion": return "Insertion"
      case "merge": return "Merge"
      case "quick": return "Quick"
      case "heap": return "Heap"
    }
  }
  
  const currentStepData = steps[currentStep] || {
    array: [],
    comparing: [],
    swapping: [],
    description: "Loading...",
    sorted: []
  }
  
  // Generate comparison data for the chart
  const comparisonData = [
    { name: "Bubble", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { name: "Selection", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { name: "Insertion", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)" },
    { name: "Merge", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)" },
    { name: "Quick", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)" },
    { name: "Heap", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)" }
  ]
  
  const computeComplexityValue = (size: number, complexity: string): number => {
    switch (complexity) {
      case "O(n)": return size
      case "O(n²)": return Math.pow(size, 2)
      case "O(n log n)": return size * Math.log2(size)
      case "O(log n)": return Math.log2(size)
      default: return 0
    }
  }
  
  // Generate data points for the chart
  const chartData = Array.from({ length: 10 }, (_, i) => {
    const size = (i + 1) * 10 // 10, 20, 30, ... 100
    return {
      size,
      bubble: computeComplexityValue(size, "O(n²)"),
      selection: computeComplexityValue(size, "O(n²)"),
      insertion: computeComplexityValue(size, "O(n²)"), // average case
      merge: computeComplexityValue(size, "O(n log n)"),
      quick: computeComplexityValue(size, "O(n log n)"), // average case
      heap: computeComplexityValue(size, "O(n log n)")
    }
  })

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-4 border-b border-slate-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
          <div>
            <div className="text-lg font-semibold">Sorting Algorithms</div>
            <div className="text-xs text-slate-400">Comparison of different sorting techniques</div>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2">
            <Select
              value={algorithm}
              onValueChange={(value) => setAlgorithm(value as SortingAlgorithm)}
            >
              <SelectTrigger className="w-[150px] text-black">
                <SelectValue placeholder="Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bubble">Bubble Sort</SelectItem>
                <SelectItem value="selection">Selection Sort</SelectItem>
                <SelectItem value="insertion">Insertion Sort</SelectItem>
                <SelectItem value="merge">Merge Sort</SelectItem>
                <SelectItem value="quick">Quick Sort</SelectItem>
                <SelectItem value="heap">Heap Sort</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={arraySize.toString()}
              onValueChange={(value) => setArraySize(parseInt(value))}
            >
              <SelectTrigger className="w-[120px] text-black">
                <SelectValue placeholder="Array Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Elements</SelectItem>
                <SelectItem value="10">10 Elements</SelectItem>
                <SelectItem value="15">15 Elements</SelectItem>
                <SelectItem value="20">20 Elements</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={generateNewArray} className="bg-red-600 text-white">
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
                <CardTitle>{getAlgorithmName(algorithm)} Sort Visualization</CardTitle>
                <CardDescription>
                  {algorithm === "bubble" 
                    ? "Repeatedly steps through the list, compares adjacent elements and swaps them if needed."
                    : algorithm === "selection"
                      ? "Repeatedly selects the smallest element from the unsorted portion and places it at the beginning."
                      : algorithm === "insertion"
                        ? "Builds the sorted array one item at a time by inserting each new item at the proper position."
                        : algorithm === "merge"
                          ? "Divide and conquer algorithm that divides the array in half, sorts each half, then merges them back together."
                          : algorithm === "quick"
                            ? "Selects a pivot element and partitions the array around the pivot, then recursively sorts the sub-arrays."
                            : "Converts the array into a heap data structure, then repeatedly extracts the maximum element."
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  {/* Array visualization */}
                  <div className="py-8">
                    <div className="flex justify-center">
                      <div className="flex items-end gap-1 h-64">
                        {currentStepData.array.map((value, index) => {
                          const isComparing = currentStepData.comparing.includes(index)
                          const isSwapping = currentStepData.swapping.includes(index)
                          const isSorted = currentStepData.sorted.includes(index)
                          
                          // Calculate height as percentage of max value
                          const maxValue = Math.max(...currentStepData.array)
                          const heightPercentage = (value / maxValue) * 100
                          
                          return (
                            <div
                              key={index}
                              className={`w-8 flex items-center justify-center rounded-t font-mono text-xs
                                ${isSwapping
                                  ? "bg-yellow-600 border-yellow-400"
                                  : isComparing
                                    ? "bg-purple-600 border-purple-400"
                                    : isSorted
                                      ? "bg-green-600/60 border-green-500"
                                      : "bg-red-200 border-slate-500"}`}
                              style={{ height: `${heightPercentage}%` }}
                            >
                              {value}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    
                    {/* Index labels */}
                    <div className="flex justify-center mt-2">
                      <div className="flex gap-1">
                        {currentStepData.array.map((_, index) => (
                          <div key={index} className="w-8 flex justify-center text-xs text-slate-400">
                            {index}
                          </div>
                        ))}
                      </div>
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

                  <div className="text-sm text-slate-300">
                    Step: {currentStep + 1}/{steps.length}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-4">
              <CardHeader className="pb-2">
                <CardTitle>Time Complexity Comparison</CardTitle>
              </CardHeader>
              <CardContent>
              <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { n: 10, bubble: 100, selection: 100, insertion: 100, merge: 33, quick: 33, heap: 33 },
                        { n: 20, bubble: 400, selection: 400, insertion: 400, merge: 86, quick: 86, heap: 86 },
                        { n: 50, bubble: 2500, selection: 2500, insertion: 2500, merge: 282, quick: 282, heap: 282 },
                        { n: 100, bubble: 10000, selection: 10000, insertion: 10000, merge: 664, quick: 664, heap: 664 },
                        { n: 200, bubble: 40000, selection: 40000, insertion: 40000, merge: 1464, quick: 1464, heap: 1464 },
                        { n: 500, bubble: 250000, selection: 250000, insertion: 250000, merge: 4150, quick: 4150, heap: 4150 },
                        { n: 1000, bubble: 1000000, selection: 1000000, insertion: 1000000, merge: 9965, quick: 9965, heap: 9965 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="n" label={{ value: "Problem Size (N)", position: "insideBottom", offset: -5 }} />
                      <YAxis scale="log" domain={[10, 'auto']} label={{ value: "Operations (log scale)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="bubble" stroke="#ef4444" strokeWidth={3} name="Bubble Sort (O(n²))" />
                      <Line type="monotone" dataKey="selection" stroke="#3b82f6" strokeWidth={3} name="Selection Sort (O(n²))" />
                      <Line type="monotone" dataKey="insertion" stroke="#22c55e" strokeWidth={3} name="Insertion Sort (O(n²))" />
                      <Line type="monotone" dataKey="merge" stroke="#a855f7" strokeWidth={3} name="Merge Sort (O(n log n))" />
                      <Line type="monotone" dataKey="quick" stroke="#f97316" strokeWidth={3} name="Quick Sort (O(n log n))" />
                      <Line type="monotone" dataKey="heap" stroke="#eab308" strokeWidth={3} name="Heap Sort (O(n log n))" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center justify-center mt-4 space-x-4 flex-wrap">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-rose-600 rounded-full mr-2"></div>
                    <span>Bubble</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                    <span>Selection</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
                    <span>Insertion</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-green-600 rounded-full mr-2"></div>
                    <span>Merge</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-sky-500 rounded-full mr-2"></div>
                    <span>Quick</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span>Heap</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Algorithm Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Algorithm</TableHead>
                      <TableHead>Best</TableHead>
                      <TableHead>Average</TableHead>
                      <TableHead>Worst</TableHead>
                      <TableHead>Space</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {comparisonData.map((algo) => (
                      <TableRow 
                        key={algo.name} 
                        className={algorithm === algo.name.toLowerCase() ? "bg-red-300" : ""}
                      >
                        <TableCell className="font-medium">{algo.name}</TableCell>
                        <TableCell className="font-mono text-xs">{algo.best}</TableCell>
                        <TableCell className="font-mono text-xs">{algo.average}</TableCell>
                        <TableCell className="font-mono text-xs">{algo.worst}</TableCell>
                        <TableCell className="font-mono text-xs">{algo.space}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="text-base font-medium mb-2">Key Properties</h3>
                    <ul className="space-y-2 text-sm text-white">
                      <li className="p-2 bg-slate-700 rounded-md">
                        <span className="font-semibold">Adaptive:</span> Insertion, Quick
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        <span className="font-semibold">Stable:</span> Bubble, Insertion, Merge
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        <span className="font-semibold">In-place:</span> Bubble, Selection, Insertion, Quick, Heap
                      </li>
                      <li className="p-2 bg-slate-700 rounded-md">
                        <span className="font-semibold">Divide & Conquer:</span> Merge, Quick
                      </li>
                    </ul>
                  </div>
                  
                  <div className="text-xs text-black">
                    <p>The choice of sorting algorithm depends on the specific requirements and constraints of your application:</p>
                    <ul className="mt-2 space-y-1 list-disc pl-4">
                      <li>Small arrays: Insertion Sort</li>
                      <li>Almost sorted data: Insertion Sort</li>
                      <li>General purpose: Quick Sort or Merge Sort</li>
                      <li>Worst-case guarantee: Heap Sort or Merge Sort</li>
                      <li>Memory constrained: Heap Sort or Quick Sort</li>
                    </ul>
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
