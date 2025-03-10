export interface Node {
  id: number
}

export interface Edge {
  source: number
  target: number
  weight: number
}

export interface Graph {
  nodes: Node[]
  edges: Edge[]
}

// Create a random graph with n nodes and edge density between 0 and 1
export function createRandomGraph(n: number, density: number): Graph {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Create nodes
  for (let i = 0; i < n; i++) {
    nodes.push({ id: i })
  }

  // Create edges
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i !== j && Math.random() < density) {
        // Generate a random weight between 1 and 10
        const weight = Math.floor(Math.random() * 10) + 1
        edges.push({ source: i, target: j, weight })
      }
    }
  }

  // Ensure the graph is connected
  for (let i = 1; i < n; i++) {
    // Check if node i is already connected to any previous node
    const isConnected = edges.some(
      (edge) => (edge.source === i && edge.target < i) || (edge.target === i && edge.source < i),
    )

    if (!isConnected) {
      // Connect to a random previous node
      const randomPrevNode = Math.floor(Math.random() * i)
      const weight = Math.floor(Math.random() * 10) + 1
      edges.push({ source: randomPrevNode, target: i, weight })
    }
  }

  return { nodes, edges }
}

