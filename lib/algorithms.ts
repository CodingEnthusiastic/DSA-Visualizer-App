import type { Graph, Edge } from "./graph"

// Dijkstra's Algorithm Implementation
export function runDijkstra(graph: Graph, startNode: number) {
  const steps: any[] = []
  const nodes = graph.nodes.map((n) => n.id)
  const edges = graph.edges

  // Initialize distances
  const distances: { [key: number]: number } = {}
  const visited: number[] = []
  const unvisited = [...nodes]

  // Set initial distances
  for (const node of nodes) {
    distances[node] = node === startNode ? 0 : Number.POSITIVE_INFINITY
  }

  // Add initial step
  steps.push({
    distances: { ...distances },
    visited: [...visited],
    current: startNode,
    relaxedEdges: [],
  })

  // Main algorithm loop
  while (unvisited.length > 0) {
    // Find the unvisited node with the smallest distance
    let current: number | null = null
    let smallestDistance = Number.POSITIVE_INFINITY

    for (const node of unvisited) {
      if (distances[node] < smallestDistance) {
        smallestDistance = distances[node]
        current = node
      }
    }

    // If we can't find a node or the smallest distance is infinity, we're done
    if (current === null || smallestDistance === Number.POSITIVE_INFINITY) {
      break
    }

    // Remove current node from unvisited and add to visited
    const currentIndex = unvisited.indexOf(current)
    unvisited.splice(currentIndex, 1)
    visited.push(current)

    // Find all edges from the current node
    const currentEdges = edges.filter((edge) => edge.source === current)
    const relaxedEdges: Edge[] = []

    // Update distances to neighbors
    for (const edge of currentEdges) {
      const neighbor = edge.target
      const tentativeDistance = distances[current!] + edge.weight

      if (tentativeDistance < distances[neighbor]) {
        distances[neighbor] = tentativeDistance
        relaxedEdges.push(edge)
      }
    }

    // Add step
    steps.push({
      distances: { ...distances },
      visited: [...visited],
      current,
      relaxedEdges: [...relaxedEdges],
    })
  }

  // Add final step
  steps.push({
    distances: { ...distances },
    visited: [...visited],
    current: null,
    relaxedEdges: [],
  })

  return steps
}

// Bellman-Ford Algorithm Implementation
export function runBellmanFord(graph: Graph, startNode: number) {
  const steps: any[] = []
  const nodes = graph.nodes.map((n) => n.id)
  const edges = graph.edges

  // Initialize distances
  const distances: { [key: number]: number } = {}

  // Set initial distances
  for (const node of nodes) {
    distances[node] = node === startNode ? 0 : Number.POSITIVE_INFINITY
  }

  // Add initial step
  steps.push({
    distances: { ...distances },
    source: startNode,
    iteration: -1,
    relaxedEdges: [],
  })

  // Main algorithm loop - relax edges |V|-1 times
  for (let i = 0; i < nodes.length - 1; i++) {
    const relaxedEdges: Edge[] = []

    // Relax all edges
    for (const edge of edges) {
      const source = edge.source
      const target = edge.target
      const weight = edge.weight

      if (distances[source] !== Number.POSITIVE_INFINITY && distances[source] + weight < distances[target]) {
        distances[target] = distances[source] + weight
        relaxedEdges.push(edge)
      }
    }

    // Add step
    steps.push({
      distances: { ...distances },
      iteration: i,
      relaxedEdges: [...relaxedEdges],
    })

    // If no edges were relaxed in this iteration, we can stop early
    if (relaxedEdges.length === 0 && i > 0) {
      break
    }
  }

  // Check for negative cycles (optional)
  let hasNegativeCycle = false
  const negativeCycleEdges: Edge[] = []

  for (const edge of edges) {
    const source = edge.source
    const target = edge.target
    const weight = edge.weight

    if (distances[source] !== Number.POSITIVE_INFINITY && distances[source] + weight < distances[target]) {
      hasNegativeCycle = true
      negativeCycleEdges.push(edge)
    }
  }

  // Add final step
  steps.push({
    distances: { ...distances },
    hasNegativeCycle,
    negativeCycleEdges,
    iteration: nodes.length - 1,
    relaxedEdges: [],
  })

  return steps
}

// Sorting Algorithms
export const sortingAlgorithms = {
  bubbleSort: {
    name: "Bubble Sort",
    complexity: "O(n²)",
    spaceComplexity: "O(1)",
    execute: (arr: number[]) => {
      const start = performance.now()
      const n = arr.length
      const sortedArr = [...arr]
      for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
          if (sortedArr[j] > sortedArr[j + 1]) {
            ;[sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]]
          }
        }
      }
      const end = performance.now()
      return { result: sortedArr, time: end - start }
    },
  },
  selectionSort: {
    name: "Selection Sort",
    complexity: "O(n²)",
    spaceComplexity: "O(1)",
    execute: (arr: number[]) => {
      const start = performance.now()
      const sortedArr = [...arr]
      const n = sortedArr.length

      for (let i = 0; i < n; i++) {
        let minIdx = i
        for (let j = i + 1; j < n; j++) {
          if (sortedArr[j] < sortedArr[minIdx]) {
            minIdx = j
          }
        }
        if (minIdx !== i) {
          ;[sortedArr[i], sortedArr[minIdx]] = [sortedArr[minIdx], sortedArr[i]]
        }
      }

      const end = performance.now()
      return { result: sortedArr, time: end - start }
    },
  },
  insertionSort: {
    name: "Insertion Sort",
    complexity: "O(n²)",
    spaceComplexity: "O(1)",
    execute: (arr: number[]) => {
      const start = performance.now()
      const sortedArr = [...arr]
      const n = sortedArr.length

      for (let i = 1; i < n; i++) {
        const key = sortedArr[i]
        let j = i - 1

        while (j >= 0 && sortedArr[j] > key) {
          sortedArr[j + 1] = sortedArr[j]
          j = j - 1
        }
        sortedArr[j + 1] = key
      }

      const end = performance.now()
      return { result: sortedArr, time: end - start }
    },
  },
  quickSort: {
    name: "Quick Sort",
    complexity: "O(n log n)",
    spaceComplexity: "O(log n)",
    execute: (arr: number[]) => {
      const start = performance.now()

      function quickSortHelper(arr: number[]): number[] {
        if (arr.length <= 1) return arr

        const pivot = arr[Math.floor(arr.length / 2)]
        const left = arr.filter((x) => x < pivot)
        const middle = arr.filter((x) => x === pivot)
        const right = arr.filter((x) => x > pivot)

        return [...quickSortHelper(left), ...middle, ...quickSortHelper(right)]
      }

      const sortedArr = quickSortHelper([...arr])
      const end = performance.now()

      return { result: sortedArr, time: end - start }
    },
  },
  mergeSort: {
    name: "Merge Sort",
    complexity: "O(n log n)",
    spaceComplexity: "O(n)",
    execute: (arr: number[]) => {
      const start = performance.now()

      function merge(left: number[], right: number[]): number[] {
        const result = []
        let leftIndex = 0
        let rightIndex = 0

        while (leftIndex < left.length && rightIndex < right.length) {
          if (left[leftIndex] < right[rightIndex]) {
            result.push(left[leftIndex])
            leftIndex++
          } else {
            result.push(right[rightIndex])
            rightIndex++
          }
        }

        return [...result, ...left.slice(leftIndex), ...right.slice(rightIndex)]
      }

      function mergeSortHelper(arr: number[]): number[] {
        if (arr.length <= 1) return arr

        const mid = Math.floor(arr.length / 2)
        const left = mergeSortHelper(arr.slice(0, mid))
        const right = mergeSortHelper(arr.slice(mid))

        return merge(left, right)
      }

      const sortedArr = mergeSortHelper([...arr])
      const end = performance.now()

      return { result: sortedArr, time: end - start }
    },
  },
  heapSort: {
    name: "Heap Sort",
    complexity: "O(n log n)",
    spaceComplexity: "O(1)",
    execute: (arr: number[]) => {
      const start = performance.now()
      const sortedArr = [...arr]

      function heapify(arr: number[], n: number, i: number) {
        let largest = i
        const left = 2 * i + 1
        const right = 2 * i + 2

        if (left < n && arr[left] > arr[largest]) {
          largest = left
        }

        if (right < n && arr[right] > arr[largest]) {
          largest = right
        }

        if (largest !== i) {
          ;[arr[i], arr[largest]] = [arr[largest], arr[i]]
          heapify(arr, n, largest)
        }
      }

      const n = sortedArr.length

      // Build max heap
      for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(sortedArr, n, i)
      }

      // Extract elements from heap
      for (let i = n - 1; i > 0; i--) {
        ;[sortedArr[0], sortedArr[i]] = [sortedArr[i], sortedArr[0]]
        heapify(sortedArr, i, 0)
      }

      const end = performance.now()
      return { result: sortedArr, time: end - start }
    },
  },
}

// Pathfinding Algorithms
export const pathfindingAlgorithms = {
  dijkstra: {
    name: "Dijkstra's Algorithm",
    complexity: "O(E + V log V)",
    spaceComplexity: "O(V)",
    execute: (graph: any) => {
      const start = performance.now()

      // Implementation of Dijkstra's algorithm
      const nodes = graph.nodes.length
      const startNode = 0
      const distances = Array(nodes).fill(Number.POSITIVE_INFINITY)
      distances[startNode] = 0
      const visited = Array(nodes).fill(false)

      for (let i = 0; i < nodes - 1; i++) {
        const u = minDistance(distances, visited)
        if (u === -1) break // No reachable nodes left
        
        visited[u] = true

        for (const edge of graph.edges.filter((e) => e.source === u)) {
          if (
            !visited[edge.target] &&
            distances[u] !== Number.POSITIVE_INFINITY &&
            distances[u] + edge.weight < distances[edge.target]
          ) {
            distances[edge.target] = distances[u] + edge.weight
          }
        }
      }

      function minDistance(dist: number[], visited: boolean[]) {
        let min = Number.POSITIVE_INFINITY
        let minIndex = -1

        for (let v = 0; v < dist.length; v++) {
          if (!visited[v] && dist[v] <= min) {
            min = dist[v]
            minIndex = v
          }
        }

        return minIndex
      }

      const end = performance.now()
      return { result: distances, time: end - start }
    },
  },
  bellmanFord: {
    name: "Bellman-Ford Algorithm",
    complexity: "O(V × E)",
    spaceComplexity: "O(V)",
    execute: (graph: any) => {
      const start = performance.now()

      const nodes = graph.nodes.length
      const startNode = 0
      const distances = Array(nodes).fill(Number.POSITIVE_INFINITY)
      distances[startNode] = 0

      // Relax all edges |V| - 1 times
      for (let i = 0; i < nodes - 1; i++) {
        let relaxed = false;
        for (const edge of graph.edges) {
          if (
            distances[edge.source] !== Number.POSITIVE_INFINITY &&
            distances[edge.source] + edge.weight < distances[edge.target]
          ) {
            distances[edge.target] = distances[edge.source] + edge.weight
            relaxed = true;
          }
        }
        
        // Early termination if no relaxation occurred
        if (!relaxed) break;
      }

      const end = performance.now()
      return { result: distances, time: end - start }
    },
  },
  astar: {
    name: "A* Algorithm",
    complexity: "O(E)",
    spaceComplexity: "O(V)",
    execute: (graph: any) => {
      const start = performance.now()

      // Simplified A* implementation for benchmarking
      const nodes = graph.nodes.length
      const startNode = 0
      const endNode = nodes - 1

      // For simplicity, we'll use a heuristic that's just the node index difference
      function heuristic(node: number) {
        return Math.abs(node - endNode)
      }

      const openSet = [startNode]
      const cameFrom: Record<number, number | null> = {}

      const gScore: Record<number, number> = {}
      for (let i = 0; i < nodes; i++) {
        gScore[i] = Number.POSITIVE_INFINITY
      }
      gScore[startNode] = 0

      const fScore: Record<number, number> = {}
      for (let i = 0; i < nodes; i++) {
        fScore[i] = Number.POSITIVE_INFINITY
      }
      fScore[startNode] = heuristic(startNode)

      while (openSet.length > 0) {
        // Find node with lowest fScore
        let current = openSet[0]
        let lowestFScore = fScore[current]
        let lowestIndex = 0

        for (let i = 1; i < openSet.length; i++) {
          if (fScore[openSet[i]] < lowestFScore) {
            current = openSet[i]
            lowestFScore = fScore[current]
            lowestIndex = i
          }
        }

        if (current === endNode) {
          // Path found
          break
        }

        openSet.splice(lowestIndex, 1)

        // Process neighbors
        for (const edge of graph.edges.filter((e) => e.source === current)) {
          const neighbor = edge.target
          const tentativeGScore = gScore[current] + edge.weight

          if (tentativeGScore < gScore[neighbor]) {
            cameFrom[neighbor] = current
            gScore[neighbor] = tentativeGScore
            fScore[neighbor] = gScore[neighbor] + heuristic(neighbor)

            if (!openSet.includes(neighbor)) {
              openSet.push(neighbor)
            }
          }
        }
      }

      const end = performance.now()
      return { result: gScore, time: end - start }
    },
  },
}

// Minimum Spanning Tree Algorithms
export const mstAlgorithms = {
  kruskal: {
    name: "Kruskal's Algorithm",
    complexity: "O(E log E)",
    spaceComplexity: "O(E + V)",
    execute: (graph: any) => {
      const start = performance.now()

      // Implementation of Kruskal's algorithm
      const nodes = graph.nodes.length
      const edges = [...graph.edges].sort((a, b) => a.weight - b.weight)
      const parent = Array(nodes)
        .fill(0)
        .map((_, i) => i)
      const result = []

      function find(i: number): number {
        if (parent[i] !== i) {
          parent[i] = find(parent[i])
        }
        return parent[i]
      }

      function union(x: number, y: number) {
        parent[find(x)] = find(y)
      }

      let e = 0
      let i = 0

      while (e < nodes - 1 && i < edges.length) {
        const edge = edges[i++]
        const x = find(edge.source)
        const y = find(edge.target)

        if (x !== y) {
          result.push(edge)
          union(x, y)
          e++
        }
      }

      const end = performance.now()
      return { result, time: end - start }
    },
  },
  prim: {
    name: "Prim's Algorithm",
    complexity: "O(E log V)",
    spaceComplexity: "O(V)",
    execute: (graph: any) => {
      const start = performance.now()

      // Implementation of Prim's algorithm
      const nodes = graph.nodes.length
      const selected = Array(nodes).fill(false)
      const result = []

      // Handle empty graph case
      if (nodes === 0) {
        const end = performance.now()
        return { result, time: end - start }
      }

      selected[0] = true

      // Number of edges in MST will be V-1
      for (let e = 0; e < nodes - 1; e++) {
        let min = Number.POSITIVE_INFINITY
        let x = 0
        let y = 0
        let foundEdge = false;

        for (let i = 0; i < nodes; i++) {
          if (selected[i]) {
            for (const edge of graph.edges.filter((e) => e.source === i)) {
              if (!selected[edge.target] && edge.weight < min) {
                min = edge.weight
                x = i
                y = edge.target
                foundEdge = true;
              }
            }
          }
        }

        // If no edge was found, the graph might be disconnected
        if (!foundEdge) break;

        result.push({ source: x, target: y, weight: min })
        selected[y] = true
      }

      const end = performance.now()
      return { result, time: end - start }
    },
  },
}

// Dynamic Programming Algorithms
export const dpAlgorithms = {
  fibonacci: {
    name: "Fibonacci (Recursive)",
    complexity: "O(2^n)",
    spaceComplexity: "O(n)",
    execute: (data: any) => {
      const start = performance.now()

      function fib(n: number): number {
        if (n <= 1) return n
        return fib(n - 1) + fib(n - 2)
      }

      // Calculate for a smaller n to avoid browser hanging
      const n = Math.min(data.size, 30)
      const result = fib(n)

      const end = performance.now()
      return { result, time: end - start }
    },
  },
  fibonacciDP: {
    name: "Fibonacci (DP)",
    complexity: "O(n)",
    spaceComplexity: "O(n)",
    execute: (data: any) => {
      const start = performance.now()

      function fibDP(n: number): number {
        if (n <= 1) return n;
        
        const dp = Array(n + 1).fill(0)
        dp[0] = 0
        dp[1] = 1

        for (let i = 2; i <= n; i++) {
          dp[i] = dp[i - 1] + dp[i - 2]
        }

        return dp[n]
      }

      const n = Math.min(data.size, 1000)
      const result = fibDP(n)

      const end = performance.now()
      return { result, time: end - start }
    },
  },
  knapsackRecursive: {
    name: "Knapsack (Recursive)",
    complexity: "O(2^n)",
    spaceComplexity: "O(n)",
    execute: (data: any) => {
      const start = performance.now()

      function knapsack(capacity: number, weights: number[], values: number[], n: number): number {
        // Base case
        if (n === 0 || capacity === 0) return 0

        // If weight of the nth item is more than capacity,
        // then this item cannot be included
        if (weights[n - 1] > capacity) {
          return knapsack(capacity, weights, values, n - 1)
        }

        // Return the maximum of two cases:
        // (1) nth item included
        // (2) not included
        return Math.max(
          values[n - 1] + knapsack(capacity - weights[n - 1], weights, values, n - 1),
          knapsack(capacity, weights, values, n - 1),
        )
      }

      // Use a smaller subset to avoid browser hanging
      const n = Math.min(data.size, 20)
      const weights = data.weights.slice(0, n)
      const values = data.values.slice(0, n)
      const capacity = data.capacity

      const result = knapsack(capacity, weights, values, n)

      const end = performance.now()
      return { result, time: end - start }
    },
  },
  knapsackDP: {
    name: "Knapsack (DP)",
    complexity: "O(n × W)",
    spaceComplexity: "O(n × W)",
    execute: (data: any) => {
      const start = performance.now()

      function knapsackDP(capacity: number, weights: number[], values: number[], n: number): number {
        // Handle edge cases
        if (n === 0 || capacity === 0) return 0;
        
        const dp = Array(n + 1)
          .fill(0)
          .map(() => Array(capacity + 1).fill(0))

        for (let i = 0; i <= n; i++) {
          for (let w = 0; w <= capacity; w++) {
            if (i === 0 || w === 0) {
              dp[i][w] = 0
            } else if (weights[i - 1] <= w) {
              dp[i][w] = Math.max(values[i - 1] + dp[i - 1][w - weights[i - 1]], dp[i - 1][w])
            } else {
              dp[i][w] = dp[i - 1][w]
            }
          }
        }

        return dp[n][capacity]
      }

      const n = Math.min(data.size, 500)
      const weights = data.weights.slice(0, n)
      const values = data.values.slice(0, n)
      const capacity = data.capacity

      const result = knapsackDP(capacity, weights, values, n)

      const end = performance.now()
      return { result, time: end - start }
    },
  },
}

// Helper function to execute algorithms
export async function executeAlgorithm(algorithm: any, data: any, category: string) {
  // Add a small delay to allow UI updates
  await new Promise((resolve) => setTimeout(resolve, 100))

  try {
    return algorithm.execute(data)
  } catch (error) {
    console.error("Error executing algorithm:", error)
    return { result: null, time: 0 }
  }
}
