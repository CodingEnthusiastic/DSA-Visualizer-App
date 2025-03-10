"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, SkipForward, RotateCcw, Zap } from "lucide-react"
import { motion } from "framer-motion"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { ChartContainer, ChartGrid, ChartLine, ChartLineSeries, ChartAxis, Chart } from "@/components/ui/chart";
//import { Chart, ChartAxis, ChartContainer, ChartGrid, ChartLineSeries } from "@tremor/react"

export default function DynamicProgrammingVisualizer() {
  const [problem, setProblem] = useState<"fibonacci" | "knapsack" | "lcs">("fibonacci")
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState("visualization")
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)

  // Problem-specific state
  const [fibN, setFibN] = useState(10)
  const [dpTable, setDpTable] = useState<number[]>([])

  // Generate steps when problem changes
  useEffect(() => {
    resetVisualization()
    generateSteps()
  }, [problem, fibN])

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) lastStepTimeRef.current = timestamp

        const elapsed = timestamp - lastStepTimeRef.current
        const stepDuration = 1000 - speed * 9 // Map 1-100 to 1000-100ms

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

  // Update DP table based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      if (problem === "fibonacci") {
        setDpTable(steps[currentStep].dpTable)
      }
    }
  }, [currentStep, steps, problem])

  const generateSteps = () => {
    if (problem === "fibonacci") {
      const fibSteps = generateFibonacciSteps(fibN)
      setSteps(fibSteps)
    } else if (problem === "knapsack") {
      // Generate knapsack steps
      const knapsackSteps = generateKnapsackSteps()
      setSteps(knapsackSteps)
    } else if (problem === "lcs") {
      // Generate LCS steps
      const lcsSteps = generateLCSSteps()
      setSteps(lcsSteps)
    }
  }

  const generateFibonacciSteps = (n: number) => {
    const steps: any[] = []
    const dp = new Array(n + 1).fill(-1)

    // Base cases
    dp[0] = 0
    dp[1] = 1

    steps.push({
      dpTable: [...dp],
      description: "Initialize DP table with base cases: dp[0] = 0, dp[1] = 1",
      current: -1,
      subproblems: [],
    })

    // Fill the DP table
    for (let i = 2; i <= n; i++) {
      steps.push({
        dpTable: [...dp],
        description: `Computing dp[${i}] = dp[${i - 1}] + dp[${i - 2}]`,
        current: i,
        subproblems: [i - 1, i - 2],
      })

      dp[i] = dp[i - 1] + dp[i - 2]

      steps.push({
        dpTable: [...dp],
        description: `Set dp[${i}] = ${dp[i - 1]} + ${dp[i - 2]} = ${dp[i]}`,
        current: i,
        subproblems: [],
      })
    }

    steps.push({
      dpTable: [...dp],
      description: `Fibonacci(${n}) = ${dp[n]}`,
      current: n,
      subproblems: [],
    })

    return steps
  }

  const generateKnapsackSteps = () => {
    // Placeholder for knapsack steps
    return [{ description: "Knapsack solver steps would be shown here" }]
  }

  const generateLCSSteps = () => {
    // Placeholder for LCS steps
    return [{ description: "Longest Common Subsequence steps would be shown here" }]
  }

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

  return (
    <div className="bg-slate-800 rounded-lg shadow-xl overflow-hidden border border-slate-700">
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="bg-slate-900 p-4 border-b border-slate-700">
          <div className="flex justify-between items-center">
            <TabsList className="bg-slate-800">
              <TabsTrigger value="visualization" className="data-[state=active]:bg-purple-600">
                Visualization
              </TabsTrigger>
              <TabsTrigger value="comparison" className="data-[state=active]:bg-purple-600">
                Time Complexity
              </TabsTrigger>
              <TabsTrigger value="explanation" className="data-[state=active]:bg-purple-600">
                Explanation
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProblem("fibonacci")}
                className={`${problem === "fibonacci" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                Fibonacci
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProblem("knapsack")}
                className={`${problem === "knapsack" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                Knapsack
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProblem("lcs")}
                className={`${problem === "lcs" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                LCS
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="visualization" className="p-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {problem === "fibonacci"
                    ? "Fibonacci Sequence"
                    : problem === "knapsack"
                      ? "0/1 Knapsack Problem"
                      : "Longest Common Subsequence"}
                </h3>
                {problem === "fibonacci" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">n:</span>
                    <select
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                      value={fibN}
                      onChange={(e) => setFibN(Number(e.target.value))}
                    >
                      {[5, 6, 7, 8, 9, 10, 11, 12, 15].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
                {problem === "fibonacci" && (
                  <div className="w-full h-full p-8 flex flex-col">
                    <div className="flex items-center justify-center mb-8">
                      <div className="grid grid-cols-1 gap-2">
                        <div className="text-center text-sm text-slate-400 mb-2">DP Table</div>
                        <div className="flex">
                          {dpTable.map((value, index) => {
                            const isCurrentIndex = steps[currentStep]?.current === index
                            const isSubproblem = steps[currentStep]?.subproblems?.includes(index)

                            return (
                              <div key={index} className="flex flex-col items-center mx-1">
                                <div className="text-xs text-slate-400 mb-1">dp[{index}]</div>
                                <div
                                  className={`w-3 h-3 md:h-5 md:w-5 sm:h-7 sm:w-7 flex items-center justify-center rounded-md border ${
                                    isCurrentIndex
                                      ? "bg-purple-900/50 border-purple-500 text-white"
                                      : isSubproblem
                                        ? "bg-blue-900/30 border-blue-500 text-white"
                                        : value !== -1
                                          ? "bg-slate-800 border-slate-600 text-white"
                                          : "bg-slate-800/30 border-slate-700 text-slate-400"
                                  }`}
                                >
                                  {value !== -1 ? value : "?"}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                      <div className="max-w-md">
                        <div className="text-center text-sm text-slate-400 mb-4">Recursive Call Tree</div>
                        <div className="w-full h-24 bg-slate-800/50 rounded-md border border-slate-700 flex items-center justify-center">
                          {steps[currentStep]?.current > 1 ? (
                            <div className="text-center">
                              <div className="text-sm">Calculating Fibonacci({steps[currentStep]?.current})</div>
                              {steps[currentStep]?.subproblems?.length > 0 && (
                                <div className="mt-4 flex justify-center space-x-8">
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center mb-2">
                                      {steps[currentStep]?.subproblems[0]}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      Fib({steps[currentStep]?.subproblems[0]})
                                    </div>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-900/50 border border-blue-500 flex items-center justify-center mb-2">
                                      {steps[currentStep]?.subproblems[1]}
                                    </div>
                                    <div className="text-xs text-slate-400">
                                      Fib({steps[currentStep]?.subproblems[1]})
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-sm text-slate-400">
                              {steps[currentStep]?.current === -1
                                ? "Initializing base cases"
                                : `Base case: Fibonacci(${steps[currentStep]?.current})`}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {problem === "knapsack" && (
                  <div className="text-center text-slate-400">Knapsack visualization would be shown here</div>
                )}

                {problem === "lcs" && (
                  <div className="text-center text-slate-400">LCS visualization would be shown here</div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-black">
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
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
              <h3 className="text-lg font-medium mb-4">Algorithm Steps</h3>
              <div className="overflow-y-auto h-[calc(100vh-24rem)] pr-2 space-y-2 custom-scrollbar">
                {steps.map((step, index) => {
                  const isCurrent = index === currentStep
                  const isPast = index < currentStep

                  return (
                    <motion.div
                      key={index}
                      data-step={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`p-3 rounded-md border ${
                        isCurrent
                          ? "bg-purple-900/30 border-purple-600"
                          : isPast
                            ? "bg-slate-800/50 border-slate-700"
                            : "bg-slate-800/20 border-slate-700/50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            isCurrent ? "bg-purple-600 text-white" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          Step {index + 1}
                        </span>

                        {isCurrent && (
                          <span className="flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full opacity-75 bg-purple-400"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-slate-300">{step.description}</p>

                      {problem === "fibonacci" && step.current !== -1 && (
                        <div className="mt-2 text-xs bg-slate-800 p-2 rounded">
                          {step.subproblems?.length > 0 ? (
                            <span>
                              Looking up subproblems: dp[{step.subproblems[0]}] = {dpTable[step.subproblems[0]]}, dp[
                              {step.subproblems[1]}] = {dpTable[step.subproblems[1]]}
                            </span>
                          ) : (
                            <span>
                              Result stored in dp[{step.current}] = {dpTable[step.current]}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="p-4 m-0">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Time Complexity</CardTitle>
                  <CardDescription>Theoretical analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Problem</TableHead>
                        <TableHead>DP Approach</TableHead>
                        <TableHead>Recursive</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Fibonacci</TableCell>
                        <TableCell className="text-green-500">O(n)</TableCell>
                        <TableCell className="text-red-500">O(2^n)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Knapsack</TableCell>
                        <TableCell className="text-green-500">O(n×W)</TableCell>
                        <TableCell className="text-red-500">O(2^n)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">LCS</TableCell>
                        <TableCell className="text-green-500">O(m×n)</TableCell>
                        <TableCell className="text-red-500">O(2^(m+n))</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Dynamic Programming Characteristics</CardTitle>
                  <CardDescription>Key properties</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Optimal Substructure</TableCell>
                        <TableCell>Optimal solution contains optimal solutions to subproblems</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Overlapping Subproblems</TableCell>
                        <TableCell>Same subproblems are solved multiple times</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Memoization</TableCell>
                        <TableCell>Store results of subproblems to avoid recomputation</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bottom-up vs Top-down</TableCell>
                        <TableCell>Iterative vs recursive approach with memoization</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Fibonacci: DP vs Recursive</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { n: 1, dp: 1, topDown: 2 },
                        { n: 5, dp: 5, topDown: 32 },
                        { n: 10, dp: 10, topDown: 1024 },
                        { n: 15, dp: 15, topDown: 32768 },
                        { n: 20, dp: 20, topDown: 1048576 },
                        { n: 25, dp: 25, topDown: 33554432 },
                        { n: 30, dp: 30, topDown: 1073741824 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="n" label={{ value: "Problem Size (N)", position: "insideBottom", offset: -5 }} />
                      <YAxis scale="log" domain={['auto', 'auto']} label={{ value: "Operations (log scale)", angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="dp" stroke="#22c55e" strokeWidth={3} name="DP O(n)" />
                      <Line type="monotone" dataKey="topDown" stroke="#ef4444" strokeWidth={3} name="Top-Down O(2^N)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span>Dynamic Programming O(n)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                    <span>Recursive O(2^n)</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-400">
                  <h4 className="font-medium text-slate-300 mb-2">Dynamic Programming Efficiency:</h4>
                  <p>
                    The chart shows the dramatic difference between dynamic programming and naive recursive approaches.
                    While the DP solution grows linearly with input size, the recursive solution grows exponentially,
                    making it impractical for even moderate input sizes. This demonstrates why DP is essential for
                    solving problems with overlapping subproblems efficiently.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="explanation" className="p-4 m-0">
          <div className="space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="steps">Algorithm Steps</TabsTrigger>
                <TabsTrigger value="complexity">Time Complexity</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-400">Dynamic Programming</h3>
                      <p>
                        Dynamic Programming (DP) is a method for solving complex problems by breaking them down into
                        simpler subproblems. It is applicable to problems that exhibit the properties of overlapping
                        subproblems and optimal substructure.
                      </p>
                      <p>
                        The key idea behind DP is to store the results of subproblems so that we don't have to recompute
                        them when needed later. This technique significantly improves the efficiency of algorithms that
                        would otherwise involve redundant calculations.
                      </p>
                      <h4 className="text-lg font-semibold mt-4 text-purple-300">Key Characteristics:</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>
                          Optimal Substructure: Optimal solution to the problem contains optimal solutions to
                          subproblems
                        </li>
                        <li>Overlapping Subproblems: Same subproblems are solved multiple times</li>
                        <li>Memoization: Store results of subproblems to avoid recomputation</li>
                        <li>Bottom-up (Tabulation) or Top-down (Memoization) approaches</li>
                        <li>Transforms exponential time algorithms to polynomial time</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-400">Dynamic Programming Approach</h3>
                      <ol className="list-decimal pl-6 space-y-4">
                        <li>
                          <strong>Identify if the problem can be solved using DP:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Check if it has optimal substructure</li>
                            <li>Check if it has overlapping subproblems</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Define the state:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Identify what information we need to represent a subproblem</li>
                            <li>Define state variables clearly</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Establish the recurrence relation:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Define how to compute the solution to a problem from its subproblems</li>
                            <li>Express the value of a state in terms of values of other states</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Identify the base cases:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Define the simplest subproblems that can be solved directly</li>
                            <li>Initialize the DP table with these values</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Decide the implementation approach:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Top-down (memoization): Recursive approach with caching</li>
                            <li>Bottom-up (tabulation): Iterative approach building from base cases</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Implement the solution:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Create appropriate data structures (arrays, tables)</li>
                            <li>Fill the DP table according to the recurrence relation</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Retrieve the final answer:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>The answer is typically stored in a specific cell of the DP table</li>
                            <li>Sometimes reconstruction of the solution path is needed</li>
                          </ul>
                        </li>
                      </ol>

                      <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                        <h4 className="text-lg font-semibold mb-2">Fibonacci Example (Bottom-up):</h4>
                        <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                          {`function fibonacci(n):
    // Create DP table
    dp = array of size (n+1)
    
    // Base cases
    dp[0] = 0
    dp[1] = 1
    
    // Fill the table bottom-up
    for i from 2 to n:
        dp[i] = dp[i-1] + dp[i-2]
    
    return dp[n]`}
                        </pre>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="complexity" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-400">Dynamic Programming Time Complexity</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-300">Problem-Specific Analysis:</h4>
                          <table className="w-full mt-2">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2">Problem</th>
                                <th className="text-left py-2">Time Complexity</th>
                                <th className="text-left py-2">Space Complexity</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Fibonacci</td>
                                <td className="py-2">O(n)</td>
                                <td className="py-2">O(n)</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">0/1 Knapsack</td>
                                <td className="py-2">O(n×W)</td>
                                <td className="py-2">O(n×W)</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">LCS</td>
                                <td className="py-2">O(m×n)</td>
                                <td className="py-2">O(m×n)</td>
                              </tr>
                              <tr>
                                <td className="py-2">Edit Distance</td>
                                <td className="py-2">O(m×n)</td>
                                <td className="py-2">O(m×n)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-purple-300">Implementation Comparison:</h4>
                          <table className="w-full mt-2">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2">Approach</th>
                                <th className="text-left py-2">Advantages</th>
                                <th className="text-left py-2">Disadvantages</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Top-down (Memoization)</td>
                                <td className="py-2">Computes only needed states</td>
                                <td className="py-2">Recursion overhead</td>
                              </tr>
                              <tr>
                                <td className="py-2">Bottom-up (Tabulation)</td>
                                <td className="py-2">No recursion overhead</td>
                                <td className="py-2">Computes all states</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Space Optimization:</h4>
                        <p className="mt-2">
                          Many DP problems allow for space optimization. For example, in the Fibonacci sequence, we only
                          need the last two values to compute the next one, reducing space complexity from O(n) to O(1).
                        </p>
                        <p className="mt-2">
                          Similarly, in 2D DP problems like the Knapsack problem, we can often reduce the space
                          complexity from O(n×W) to O(W) by using a 1D array and updating it in a specific order.
                        </p>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Complexity Analysis:</h4>
                        <p className="mt-2">The time complexity of a DP algorithm is generally determined by:</p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                          <li>
                            <strong>Number of states:</strong> How many unique subproblems exist
                          </li>
                          <li>
                            <strong>Computation per state:</strong> How much work is done to compute{" "}
                            <strong>Computation per state:</strong> How much work is done to compute each state
                          </li>
                        </ul>
                        <p className="mt-4">
                          For example, in the 0/1 Knapsack problem with n items and capacity W, there are n×W possible
                          states, and each state takes O(1) time to compute, resulting in O(n×W) time complexity.
                        </p>
                        <p className="mt-2">
                          The space complexity is typically proportional to the number of states we need to store,
                          though as mentioned, this can often be optimized.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="applications" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-400">Applications of Dynamic Programming</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">String & Sequence Problems</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Longest Common Subsequence</li>
                            <li>Edit Distance (Levenshtein Distance)</li>
                            <li>Longest Increasing Subsequence</li>
                            <li>String Alignment</li>
                            <li>Regular Expression Matching</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Optimization Problems</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>0/1 Knapsack Problem</li>
                            <li>Coin Change Problem</li>
                            <li>Rod Cutting</li>
                            <li>Matrix Chain Multiplication</li>
                            <li>Shortest Path Algorithms</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Graph Problems</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Shortest Path (Floyd-Warshall)</li>
                            <li>Traveling Salesman Problem</li>
                            <li>Minimum Spanning Tree</li>
                            <li>Maximum Flow</li>
                            <li>Longest Path in DAG</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Real-world Applications</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Resource Allocation</li>
                            <li>Portfolio Optimization</li>
                            <li>Bioinformatics (Sequence Alignment)</li>
                            <li>Natural Language Processing</li>
                            <li>Computer Graphics (Image Processing)</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Advantages:</h4>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Dramatically improves efficiency for problems with overlapping subproblems</li>
                          <li>Transforms exponential algorithms to polynomial time</li>
                          <li>Systematic approach to optimization problems</li>
                          <li>Can be combined with other techniques for further optimization</li>
                          <li>Provides optimal solutions for problems with optimal substructure</li>
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-purple-300">Limitations:</h4>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Requires identifying optimal substructure and recurrence relation</li>
                          <li>May require significant memory for large problems</li>
                          <li>Not all problems have optimal substructure</li>
                          <li>Implementation can be error-prone</li>
                          <li>May still be too slow for very large inputs</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

