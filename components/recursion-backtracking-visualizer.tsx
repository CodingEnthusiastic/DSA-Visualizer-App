"use client"

import { useState, useRef, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Play, Pause, SkipForward, RotateCcw, Zap } from "lucide-react"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

import { ChartContainer, ChartGrid, ChartLine, ChartLineSeries, ChartAxis, Chart } from "@/components/ui/chart";
import { motion } from "framer-motion"
//import { Chart, ChartAxis, ChartContainer, ChartGrid, ChartLineSeries } from "@tremor/react"

export default function RecursionBacktrackingVisualizer() {
  const [problem, setProblem] = useState<"nqueens" | "sudoku" | "maze">("nqueens")
  const [isRunning, setIsRunning] = useState(false)
  const [speed, setSpeed] = useState(50)
  const [currentStep, setCurrentStep] = useState(0)
  const [steps, setSteps] = useState<any[]>([])
  const [selectedTab, setSelectedTab] = useState("visualization")
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)

  // N-Queens specific state
  const [boardSize, setBoardSize] = useState(8)
  const [board, setBoard] = useState<number[][]>(
    Array(boardSize)
      .fill(0)
      .map(() => Array(boardSize).fill(0)),
  )

  // Generate steps when problem changes
  useEffect(() => {
    resetVisualization()
    generateSteps()
  }, [problem, boardSize])

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

  // Update board based on current step
  
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      if (problem === "nqueens" && steps[currentStep]?.board) {
        setBoard(steps[currentStep].board);
      }
    } else {
      setBoard(
        Array(boardSize)
          .fill(0)
          .map(() => Array(boardSize).fill(0))
      );
    }
  }, [currentStep, steps, problem, boardSize]);
  

  const generateSteps = () => {
    if (problem === "nqueens") {
      const nQueensSteps = generateNQueensSteps(boardSize)
      setSteps(nQueensSteps)
    } else if (problem === "sudoku") {
      // Generate sudoku steps
      const sudokuSteps = generateSudokuSteps()
      setSteps(sudokuSteps)
    } else if (problem === "maze") {
      // Generate maze steps
      const mazeSteps = generateMazeSteps()
      setSteps(mazeSteps)
    }
  }

  const generateNQueensSteps = (n: number) => {
    const steps: any[] = []
    const initialBoard = Array(n)
      .fill(0)
      .map(() => Array(n).fill(0))

    steps.push({
      board: JSON.parse(JSON.stringify(initialBoard)),
      description: "Starting with an empty board",
      row: 0,
      col: 0,
      action: "start",
    })

    const solveNQueens = (board: number[][], row: number) => {
      if (row === n) {
        steps.push({
          board: JSON.parse(JSON.stringify(board)),
          description: "Found a solution!",
          row: -1,
          col: -1,
          action: "solution",
        })
        return true
      }

      for (let col = 0; col < n; col++) {
        if (isSafe(board, row, col)) {
          // Place queen
          board[row][col] = 1
          steps.push({
            board: JSON.parse(JSON.stringify(board)),
            description: `Placing queen at position (${row}, ${col})`,
            row: row,
            col: col,
            action: "place",
          })

          // Recursively place rest of queens
          if (solveNQueens(board, row + 1)) {
            return true
          }

          // If placing queen doesn't lead to a solution, backtrack
          board[row][col] = 0
          steps.push({
            board: JSON.parse(JSON.stringify(board)),
            description: `Backtracking: removing queen from (${row}, ${col})`,
            row: row,
            col: col,
            action: "remove",
          })
        }
      }

      return false
    }

    const isSafe = (board: number[][], row: number, col: number) => {
      // Check column
      for (let i = 0; i < row; i++) {
        if (board[i][col] === 1) return false
      }

      // Check upper left diagonal
      for (let i = row, j = col; i >= 0 && j >= 0; i--, j--) {
        if (board[i][j] === 1) return false
      }

      // Check upper right diagonal
      for (let i = row, j = col; i >= 0 && j < n; i--, j++) {
        if (board[i][j] === 1) return false
      }

      return true
    }

    solveNQueens(initialBoard, 0)
    return steps
  }

  const generateSudokuSteps = () => {
    // Placeholder for sudoku steps
    return [{ description: "Sudoku solver steps would be shown here" }]
  }

  const generateMazeSteps = () => {
    // Placeholder for maze steps
    return [{ description: "Maze solver steps would be shown here" }]
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

  // Data for the complexity chart
  const factorialData = [
    { n: 4, ops: 24 },
    { n: 5, ops: 120 },
    { n: 6, ops: 720 },
    { n: 7, ops: 5040 },
    { n: 8, ops: 40320 },
    { n: 9, ops: 362880 },
    { n: 10, ops: 3628800 },
  ]

  const exponentialData = [
    { n: 4, ops: 256 },
    { n: 5, ops: 3125 },
    { n: 6, ops: 46656 },
    { n: 7, ops: 823543 },
    { n: 8, ops: 16777216 },
    { n: 9, ops: 387420489 },
    { n: 10, ops: 10000000000 },
  ]

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
                onClick={() => setProblem("nqueens")}
                className={`${problem === "nqueens" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                N-Queens
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProblem("sudoku")}
                className={`${problem === "sudoku" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                Sudoku
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProblem("maze")}
                className={`${problem === "maze" ? "bg-purple-600 text-white" : "bg-slate-700"}`}
              >
                Maze
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="visualization" className="p-0 m-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
            <div className="lg:col-span-2 bg-slate-900 rounded-lg p-4 border border-slate-700">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                  {problem === "nqueens" ? "N-Queens Problem" : problem === "sudoku" ? "Sudoku Solver" : "Maze Solver"}
                </h3>
                {problem === "nqueens" && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-slate-400">Board Size:</span>
                    <select
                      className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm"
                      value={boardSize}
                      onChange={(e) => setBoardSize(Number(e.target.value))}
                    >
                      {[4, 5, 6, 7, 8].map((size) => (
                        <option key={size} value={size}>
                          {size}x{size}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative flex items-center justify-center">
                {problem === "nqueens" && (
                  <div
                    className="grid gap-0.5"
                    style={{
                      gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
                      width: "min(80%, 500px)",
                      height: "min(80%, 500px)",
                    }}
                  >
                    {board.map((row, rowIndex) =>
                      row.map((cell, colIndex) => {
                        const isHighlighted =
                          steps[currentStep]?.row === rowIndex && steps[currentStep]?.col === colIndex
                        const isDark = (rowIndex + colIndex) % 2 === 1

                        return (
                          <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`relative ${isDark ? "bg-slate-700" : "bg-slate-600"} ${
                              isHighlighted ? "ring-2 ring-yellow-400" : ""
                            }`}
                          >
                            {cell === 1 && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-3/4 h-3/4 rounded-full bg-purple-500 shadow-lg flex items-center justify-center">
                                  <span className="text-white font-bold">♕</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      }),
                    )}
                  </div>
                )}

                {problem === "sudoku" && (
                  <div className="text-center text-slate-400">Sudoku visualization would be shown here</div>
                )}

                {problem === "maze" && (
                  <div className="text-center text-slate-400">Maze visualization would be shown here</div>
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

                      {step.action && (
                        <div className="mt-2 text-xs">
                          <span
                            className={`inline-block px-2 py-0.5 rounded ${
                              step.action === "place"
                                ? "bg-green-900/50 text-green-300"
                                : step.action === "remove"
                                  ? "bg-red-900/50 text-red-300"
                                  : step.action === "solution"
                                    ? "bg-yellow-900/50 text-yellow-300"
                                    : "bg-slate-800 text-slate-300"
                            }`}
                          >
                            {step.action === "place"
                              ? "Place Queen"
                              : step.action === "remove"
                                ? "Remove Queen"
                                : step.action === "solution"
                                  ? "Solution Found"
                                  : "Start"}
                          </span>
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
                        <TableHead>Time Complexity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">N-Queens</TableCell>
                        <TableCell>O(N!)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Sudoku</TableCell>
                        <TableCell>O(9^(N*N))</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Maze</TableCell>
                        <TableCell>O(N*M)</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader className="pb-2">
                  <CardTitle>Backtracking Characteristics</CardTitle>
                  <CardDescription>Algorithm comparison</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Feature</TableHead>
                        <TableHead>Description</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Decision Space</TableCell>
                        <TableCell>Explores all possible combinations</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Pruning</TableCell>
                        <TableCell>Eliminates invalid paths early</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Recursion</TableCell>
                        <TableCell>Uses recursive function calls to track state</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Optimization</TableCell>
                        <TableCell>Can be enhanced with heuristics</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Performance Comparison</CardTitle>
                <CardDescription>Growth rate vs. Problem size</CardDescription>
              </CardHeader>
              <CardContent>
              <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { n: 1, factorial: 1, exponential: 1 },
                  { n: 4, factorial: 24, exponential: 256 },
                  { n: 5, factorial: 120, exponential: 3125 },
                  { n: 6, factorial: 720, exponential: 46656 },
                  { n: 7, factorial: 5040, exponential: 823543 },
                  { n: 8, factorial: 40320, exponential: 16777216 },
                  { n: 9, factorial: 362880, exponential: 387420489 },
                  { n: 10, factorial: 3628800, exponential: 10000000000 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="n" label={{ value: "Problem Size (N)", position: "insideBottom", offset: -5 }} />
                  <YAxis scale="log" domain={['auto', 'auto']} label={{ value: "Operations (log scale)", angle: -90, position: "insideLeft" }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="factorial" stroke="#a855f7" strokeWidth={3} name="Factorial Growth" />
                  <Line type="monotone" dataKey="exponential" stroke="#f97316" strokeWidth={3} name="Exponential Growth" />
                </LineChart>
              </ResponsiveContainer>
            </div>


                <div className="flex items-center justify-center mt-4 space-x-6">
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
                    <span>Factorial Growth O(N!)</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 bg-orange-500 rounded-full mr-2"></div>
                    <span>Exponential Growth O(K^N)</span>
                  </div>
                </div>

                <div className="mt-6 text-sm text-slate-400">
                  <h4 className="font-medium text-slate-300 mb-2">Backtracking Efficiency:</h4>
                  <p>
                    Backtracking algorithms typically have exponential or factorial time complexity in the worst case.
                    However, effective pruning strategies can significantly reduce the actual runtime by avoiding
                    exploration of invalid paths. The chart shows how quickly these algorithms grow with problem size,
                    highlighting the importance of optimization techniques.
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
                      <h3 className="text-xl font-bold text-purple-400">Recursion & Backtracking</h3>
                      <p>
                        Backtracking is an algorithmic technique that builds a solution incrementally, abandoning a path
                        as soon as it determines that it cannot lead to a valid solution, and returning to explore other
                        paths.
                      </p>
                      <p>
                        This approach is particularly useful for constraint satisfaction problems, where we need to find
                        a solution that satisfies a set of constraints. Backtracking uses recursion to explore all
                        possible combinations until a solution is found or all possibilities are exhausted.
                      </p>
                      <h4 className="text-lg font-semibold mt-4 text-purple-300">Key Characteristics:</h4>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Uses depth-first search approach to explore solution space</li>
                        <li>Abandons partial solutions that cannot be completed (pruning)</li>
                        <li>Typically implemented using recursion</li>
                        <li>Suitable for problems with constraints</li>
                        <li>Often used when brute force would be too inefficient</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="steps" className="mt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-purple-400">Backtracking Algorithm Steps</h3>
                      <ol className="list-decimal pl-6 space-y-4">
                        <li>
                          <strong>Define the problem state:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Identify what constitutes a complete solution</li>
                            <li>Determine how to represent partial solutions</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Define constraints:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Identify constraints that solutions must satisfy</li>
                            <li>Create functions to check if constraints are violated</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Recursive exploration:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>If current state is a complete solution, return it</li>
                            <li>For each possible choice from current state:</li>
                            <li>Make the choice and update the state</li>
                            <li>Recursively explore from the new state</li>
                            <li>If recursive call finds a solution, return it</li>
                            <li>Otherwise, undo the choice (backtrack) and try next choice</li>
                          </ul>
                        </li>
                        <li>
                          <strong>Base cases:</strong>
                          <ul className="list-disc pl-6 mt-2">
                            <li>Define when to stop recursion (solution found or dead end)</li>
                            <li>Return appropriate values for each base case</li>
                          </ul>
                        </li>
                      </ol>

                      <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                        <h4 className="text-lg font-semibold mb-2">Pseudocode:</h4>
                        <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                          {`function backtrack(state):
    if isComplete(state):
        return state  // Solution found
    
    for choice in possibleChoices(state):
        if isValid(state, choice):
            applyChoice(state, choice)
            result = backtrack(state)
            if result is not FAILURE:
                return result
            undoChoice(state, choice)  // Backtrack
    
    return FAILURE  // No solution found`}
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
                      <h3 className="text-xl font-bold text-purple-400">Backtracking Time Complexity</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-purple-300">Problem-Specific Analysis:</h4>
                          <table className="w-full mt-2">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2">Problem</th>
                                <th className="text-left py-2">Time Complexity</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">N-Queens</td>
                                <td className="py-2">O(N!)</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Sudoku</td>
                                <td className="py-2">O(9^(N*N))</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Subset Sum</td>
                                <td className="py-2">O(2^N)</td>
                              </tr>
                              <tr>
                                <td className="py-2">Graph Coloring</td>
                                <td className="py-2">O(M^N)</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-purple-300">General Analysis:</h4>
                          <table className="w-full mt-2">
                            <thead>
                              <tr className="border-b border-slate-700">
                                <th className="text-left py-2">Factor</th>
                                <th className="text-left py-2">Impact</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Branching Factor (b)</td>
                                <td className="py-2">Number of choices at each step</td>
                              </tr>
                              <tr className="border-b border-slate-800">
                                <td className="py-2">Depth (d)</td>
                                <td className="py-2">Maximum recursion depth</td>
                              </tr>
                              <tr>
                                <td className="py-2">Pruning Efficiency</td>
                                <td className="py-2">Reduces actual runtime</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Space Complexity:</h4>
                        <p className="mt-2">
                          The space complexity of backtracking algorithms is typically O(d), where d is the maximum
                          recursion depth. This accounts for the recursion stack and any state information stored at
                          each level.
                        </p>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Complexity Analysis:</h4>
                        <p className="mt-2">
                          The time complexity of backtracking algorithms is generally O(b^d), where:
                        </p>
                        <ul className="list-disc pl-6 mt-2 space-y-2">
                          <li>
                            <strong>b</strong> is the branching factor (number of choices at each step)
                          </li>
                          <li>
                            <strong>d</strong> is the maximum depth of recursion
                          </li>
                        </ul>
                        <p className="mt-4">
                          However, effective pruning can significantly reduce the actual runtime by avoiding exploration
                          of invalid paths. The worst-case time complexity remains exponential or factorial for most
                          backtracking problems, making them suitable only for problems of limited size unless
                          additional optimizations are applied.
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
                      <h3 className="text-xl font-bold text-purple-400">Applications of Recursion & Backtracking</h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Puzzles & Games</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>N-Queens problem</li>
                            <li>Sudoku solver</li>
                            <li>Crossword puzzle generator</li>
                            <li>Chess endgame analysis</li>
                            <li>Maze generation and solving</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Combinatorial Problems</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Subset Sum problem</li>
                            <li>Hamiltonian Path</li>
                            <li>Graph Coloring</li>
                            <li>Traveling Salesman Problem</li>
                            <li>Knapsack Problem</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Computer Science</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Parsing expressions</li>
                            <li>Constraint satisfaction problems</li>
                            <li>Automated theorem proving</li>
                            <li>Symbolic computation</li>
                            <li>Compiler optimization</li>
                          </ul>
                        </div>

                        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                          <h4 className="text-lg font-semibold text-purple-300 mb-3">Real-world Applications</h4>
                          <ul className="list-disc pl-6 space-y-2">
                            <li>Resource allocation</li>
                            <li>Scheduling problems</li>
                            <li>Circuit design verification</li>
                            <li>Protein folding prediction</li>
                            <li>Network routing optimization</li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-purple-300">Advantages:</h4>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Systematically explores all possible solutions</li>
                          <li>Avoids unnecessary work through pruning</li>
                          <li>Naturally handles constraint satisfaction problems</li>
                          <li>Simple to implement for many problems</li>
                          <li>Can find all solutions or just the first valid one</li>
                        </ul>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-lg font-semibold text-purple-300">Limitations:</h4>
                        <ul className="list-disc pl-6 mt-2 space-y-1">
                          <li>Exponential time complexity for most problems</li>
                          <li>Not suitable for large problem instances</li>
                          <li>May require careful optimization to be practical</li>
                          <li>Stack overflow for very deep recursion</li>
                          <li>Difficult to parallelize effectively</li>
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

