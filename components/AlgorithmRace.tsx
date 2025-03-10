"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Trophy, Clock, Zap, BarChart2, GitCompare, Route, Network, Layers, Award, Info } from "lucide-react"
import AlgorithmLeaderboard from "./algorithm-leaderboard"
import {
  sortingAlgorithms,
  pathfindingAlgorithms,
  mstAlgorithms,
  dpAlgorithms,
  executeAlgorithm,
} from "@/lib/algorithms"

// Algorithm categories
const algorithmCategories = {
  sorting: {
    name: "Sorting Algorithms",
    icon: BarChart2,
    algorithms: sortingAlgorithms,
    description: "Compare different sorting techniques and their performance characteristics.",
  },
  pathfinding: {
    name: "Shortest Path Algorithms",
    icon: Route,
    algorithms: pathfindingAlgorithms,
    description: "Analyze algorithms that find the shortest path between nodes in a graph.",
  },
  mst: {
    name: "Minimum Spanning Tree",
    icon: Network,
    algorithms: mstAlgorithms,
    description: "Compare algorithms that find the minimum spanning tree in a connected graph.",
  },
  dp: {
    name: "Dynamic Programming",
    icon: Layers,
    algorithms: dpAlgorithms,
    description: "Evaluate different approaches to solving problems using dynamic programming.",
  },
}

export default function AlgorithmRace() {
  const [category, setCategory] = useState("sorting")
  const [algo1, setAlgo1] = useState("")
  const [algo2, setAlgo2] = useState("")
  const [dataSize, setDataSize] = useState(5000)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState({ algo1: 0, algo2: 0 })
  const [results, setResults] = useState<any[]>([])
  const [currentRun, setCurrentRun] = useState<any>(null)
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [progressInterval, setProgressInterval] = useState<NodeJS.Timeout | null>(null)

  // Set default algorithms when category changes
  useEffect(() => {
    const algos = Object.keys(algorithmCategories[category].algorithms)
    if (algos.length >= 2) {
      setAlgo1(algos[0])
      setAlgo2(algos[1])
    }
  }, [category])

  // Clean up interval on unmount or when race completes
  useEffect(() => {
    return () => {
      if (progressInterval) {
        clearInterval(progressInterval)
      }
    }
  }, [progressInterval])

  // Generate appropriate test data based on category
  const generateTestData = (size: number, category: string) => {
    switch (category) {
      case "sorting":
        return Array.from({ length: size }, () => Math.floor(Math.random() * 10000))
      case "pathfinding":
      case "mst":
        // Generate a random graph with nodes and edges
        const nodes = Math.min(size, 500) // Limit nodes for visualization
        const graph = {
          nodes: Array.from({ length: nodes }, (_, i) => ({ id: i })),
          edges: [],
        }

        // Generate random edges
        const edgeCount = Math.min(nodes * 3, 2000) // Reasonable number of edges
        for (let i = 0; i < edgeCount; i++) {
          const source = Math.floor(Math.random() * nodes)
          let target = Math.floor(Math.random() * nodes)
          while (target === source) {
            target = Math.floor(Math.random() * nodes)
          }
          const weight = Math.floor(Math.random() * 100) + 1
          graph.edges.push({ source, target, weight })
        }
        return graph
      case "dp":
        // For DP problems, generate appropriate test cases
        return {
          size,
          values: Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1),
          weights: Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1),
          capacity: Math.floor(size * 25),
        }
      default:
        return Array.from({ length: size }, () => Math.floor(Math.random() * 1000))
    }
  }

  const startRace = async () => {
    if (
      !algo1 ||
      !algo2 ||
      !algorithmCategories[category].algorithms[algo1] ||
      !algorithmCategories[category].algorithms[algo2]
    )
      return

    // Clear any existing interval
    if (progressInterval) {
      clearInterval(progressInterval)
    }

    setIsRunning(true)
    setProgress({ algo1: 0, algo2: 0 })

    const testData = generateTestData(dataSize, category)
    const algorithm1 = algorithmCategories[category].algorithms[algo1]
    const algorithm2 = algorithmCategories[category].algorithms[algo2]

    // Start progress animation
    const interval = setInterval(() => {
      setProgress((prev) => ({
        algo1: Math.min(prev.algo1 + Math.random() * 5, 95),
        algo2: Math.min(prev.algo2 + Math.random() * 5, 95),
      }))
    }, 100)

    setProgressInterval(interval)

    try {
      // Execute algorithms
      const [result1, result2] = await Promise.all([
        executeAlgorithm(algorithm1, testData, category),
        executeAlgorithm(algorithm2, testData, category),
      ])

      clearInterval(interval)
      setProgressInterval(null)
      setProgress({ algo1: 100, algo2: 100 })

      const newResult = {
        id: Date.now(),
        category,
        dataSize,
        algorithms: [
          {
            id: algo1,
            name: algorithm1.name,
            time: result1.time,
            complexity: algorithm1.complexity,
            spaceComplexity: algorithm1.spaceComplexity,
          },
          {
            id: algo2,
            name: algorithm2.name,
            time: result2.time,
            complexity: algorithm2.complexity,
            spaceComplexity: algorithm2.spaceComplexity,
          },
        ],
        winner: result1.time < result2.time ? algo1 : algo2,
        timeDifference: Math.abs(result1.time - result2.time).toFixed(2),
        percentageDifference: (
          (Math.abs(result1.time - result2.time) / Math.max(result1.time, result2.time)) *
          100
        ).toFixed(1),
      }

      setCurrentRun(newResult)
      setResults((prev) => [newResult, ...prev].slice(0, 10))

      // Update leaderboard
      updateLeaderboard(newResult)
    } catch (error) {
      console.error("Error during algorithm race:", error)
    } finally {
      // Ensure interval is cleared and state is reset
      if (interval) {
        clearInterval(interval)
      }
      setProgressInterval(null)

      setTimeout(() => {
        setIsRunning(false)
      }, 500)
    }
  }

  const updateLeaderboard = (result) => {
    // Get existing leaderboard entries for this category
    const categoryEntries = leaderboard.filter((entry) => entry.category === category)

    // Create a new leaderboard array to avoid direct state mutation
    const newLeaderboard = [...leaderboard]

    // Check if algorithms are already in the leaderboard
    result.algorithms.forEach((algo) => {
      const existingEntryIndex = newLeaderboard.findIndex(
        (entry) => entry.category === category && entry.algorithmId === algo.id,
      )

      if (existingEntryIndex !== -1) {
        // Update existing entry
        const updatedEntry = { ...newLeaderboard[existingEntryIndex] }
        updatedEntry.runs += 1
        updatedEntry.totalTime += algo.time
        updatedEntry.avgTime = updatedEntry.totalTime / updatedEntry.runs
        updatedEntry.wins += result.winner === algo.id ? 1 : 0
        newLeaderboard[existingEntryIndex] = updatedEntry
      } else {
        // Add new entry
        newLeaderboard.push({
          category: result.category,
          algorithmId: algo.id,
          name: algo.name,
          runs: 1,
          totalTime: algo.time,
          avgTime: algo.time,
          wins: result.winner === algo.id ? 1 : 0,
          complexity: algo.complexity,
          spaceComplexity: algo.spaceComplexity,
        })
      }
    })

    // Sort leaderboard by average time
    setLeaderboard(newLeaderboard.sort((a, b) => a.avgTime - b.avgTime))
  }

  return (
    <div className="space-y-8" id="algorace">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mt-20 mb-5">
      Algorithm's Race To Ace Mode
    </h2>
      {/* Algorithm Category Selection */}
      <Tabs defaultValue="sorting" value={category} onValueChange={setCategory} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          {Object.entries(algorithmCategories).map(([key, value]) => (
            <TabsTrigger key={key} value={key} className="flex items-center gap-2">
              <value.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{value.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(algorithmCategories).map(([key, value]) => (
          <TabsContent key={key} value={key} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <value.icon className="h-5 w-5 text-primary" />
                  {value.name}
                </CardTitle>
                <CardDescription>{value.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Algorithm Selection */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Algorithm 1</label>
                      <Select value={algo1} onValueChange={setAlgo1}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(value.algorithms).map(([id, algo]) => (
                            <SelectItem key={id} value={id}>
                              {algo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {algo1 && value.algorithms[algo1] && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <span>Time Complexity:</span>
                            <Badge variant="outline" className="font-mono">
                              {value.algorithms[algo1].complexity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span>Space Complexity:</span>
                            <Badge variant="outline" className="font-mono">
                              {value.algorithms[algo1].spaceComplexity}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Algorithm 2</label>
                      <Select value={algo2} onValueChange={setAlgo2}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(value.algorithms).map(([id, algo]) => (
                            <SelectItem key={id} value={id}>
                              {algo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {algo2 && value.algorithms[algo2] && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <span>Time Complexity:</span>
                            <Badge variant="outline" className="font-mono">
                              {value.algorithms[algo2].complexity}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <span>Space Complexity:</span>
                            <Badge variant="outline" className="font-mono">
                              {value.algorithms[algo2].spaceComplexity}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Data Size Configuration */}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">Data Size</label>
                        <span className="text-sm font-mono bg-secondary px-2 py-0.5 rounded">
                          {dataSize.toLocaleString()}
                        </span>
                      </div>
                      <Slider
                        value={[dataSize]}
                        min={100}
                        max={category === "pathfinding" || category === "mst" ? 500 : 50000}
                        step={100}
                        onValueChange={(value) => setDataSize(value[0])}
                        disabled={isRunning}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Small</span>
                        <span>Medium</span>
                        <span>Large</span>
                      </div>
                    </div>

                    <Button
                      onClick={startRace}
                      disabled={isRunning || !algo1 || !algo2 || algo1 === algo2}
                      className="w-full"
                      size="lg"
                    >
                      {isRunning ? (
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4 animate-pulse" />
                          Race in progress...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <GitCompare className="h-4 w-4" />
                          Start Algorithm Race
                        </span>
                      )}
                    </Button>
                  </div>
                </div>

                {/* Progress Bars */}
                {isRunning && algo1 && algo2 && value.algorithms[algo1] && value.algorithms[algo2] && (
                  <div className="mt-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{value.algorithms[algo1].name}</span>
                        <span>{progress.algo1}%</span>
                      </div>
                      <Progress value={progress.algo1} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{value.algorithms[algo2].name}</span>
                        <span>{progress.algo2}%</span>
                      </div>
                      <Progress value={progress.algo2} className="h-2" />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Results Section */}
            {currentRun && currentRun.algorithms && currentRun.algorithms.length >= 2 && (
              <Card
                className="overflow-hidden border-t-4"
                style={{
                  borderTopColor:
                    currentRun.algorithms[0].id === currentRun.winner ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                }}
              >
                <CardHeader className="pb-0">
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    Race Results
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chart Visualization */}
                    <div>
                      <ChartContainer
                        config={{
                          [algo1]: {
                            label: value.algorithms[algo1]?.name || "Algorithm 1",
                            color: "hsl(var(--primary))",
                          },
                          [algo2]: {
                            label: value.algorithms[algo2]?.name || "Algorithm 2",
                            color: "hsl(var(--secondary))",
                          },
                        }}
                        className="h-[250px]"
                      >
                        <BarChart
                          data={[
                            {
                              algorithm: value.algorithms[algo1]?.name || "Algorithm 1",
                              time: currentRun.algorithms[0].time,
                              fill: "hsl(var(--primary))",
                            },
                            {
                              algorithm: value.algorithms[algo2]?.name || "Algorithm 2",
                              time: currentRun.algorithms[1].time,
                              fill: "hsl(var(--secondary))",
                            },
                          ]}
                          layout="vertical"
                          margin={{ left: 120 }}
                        >
                          <YAxis dataKey="algorithm" type="category" width={120} tickLine={false} axisLine={false} />
                          <XAxis
                            dataKey="time"
                            type="number"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value.toFixed(2)} ms`}
                          />
                          <Bar dataKey="time" radius={4} />
                          <ChartTooltip
                            content={<ChartTooltipContent formatValue={(value) => `${value.toFixed(2)} ms`} />}
                          />
                        </BarChart>
                      </ChartContainer>
                    </div>

                    {/* Analysis */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-xl font-semibold">
                        <Award className="h-5 w-5 text-yellow-500" />
                        <span>Winner: {value.algorithms[currentRun.winner]?.name || "Unknown"}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Time Difference</div>
                          <div className="text-lg font-semibold flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {currentRun.timeDifference} ms
                          </div>
                        </div>

                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm text-muted-foreground">Performance Gain</div>
                          <div className="text-lg font-semibold flex items-center gap-1">
                            <Zap className="h-4 w-4" />
                            {currentRun.percentageDifference}% faster
                          </div>
                        </div>
                      </div>

                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Info className="h-4 w-4" />
                          Analysis
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {value.algorithms[currentRun.winner]?.name || "The winner"} outperformed{" "}
                          {value.algorithms[currentRun.winner === algo1 ? algo2 : algo1]?.name || "the other algorithm"}{" "}
                          by {currentRun.percentageDifference}% ({currentRun.timeDifference} ms) with a data size of{" "}
                          {dataSize.toLocaleString()}.
                        </p>
                        <p className="text-sm text-muted-foreground">
                          This aligns with the theoretical time complexity of{" "}
                          {value.algorithms[currentRun.winner]?.complexity || "O(?)"} vs{" "}
                          {value.algorithms[currentRun.winner === algo1 ? algo2 : algo1]?.complexity || "O(?)"}
                        </p>
                        {category === "sorting" && dataSize > 10000 && currentRun.winner === "quickSort" && (
                          <p className="text-sm text-muted-foreground">
                            For large datasets, QuickSort's O(n log n) average case performance typically outperforms
                            O(n²) algorithms like Bubble Sort.
                          </p>
                        )}
                        {category === "pathfinding" && currentRun.winner === "dijkstra" && (
                          <p className="text-sm text-muted-foreground">
                            Dijkstra's algorithm is optimal for finding the shortest path in weighted graphs without
                            negative edges.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Leaderboard */}
            {leaderboard.filter((entry) => entry.category === category).length > 0 && (
              <AlgorithmLeaderboard
                data={leaderboard.filter((entry) => entry.category === category)}
                category={category}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

