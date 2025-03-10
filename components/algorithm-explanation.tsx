"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"

interface AlgorithmExplanationProps {
  algorithm: string
}

export default function AlgorithmExplanation({ algorithm }: AlgorithmExplanationProps) {
  return (
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
              {algorithm === "dijkstra" ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-400">Dijkstra's Algorithm</h3>
                  <p>
                    Dijkstra's algorithm is a greedy algorithm that solves the single-source shortest path problem for a
                    graph with non-negative edge weights, producing a shortest-path tree.
                  </p>
                  <p>
                    This algorithm was conceived by computer scientist Edsger W. Dijkstra in 1956 and published three
                    years later. It's widely used in routing protocols and as a subroutine in other graph algorithms.
                  </p>
                  <h4 className="text-lg font-semibold mt-4 text-purple-300">Key Characteristics:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Uses a greedy approach to find the shortest path</li>
                    <li>Maintains a set of visited vertices and a set of unvisited vertices</li>
                    <li>Cannot handle negative edge weights</li>
                    <li>Uses a priority queue for efficient implementation</li>
                    <li>Guarantees the optimal solution for graphs with non-negative weights</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-400">Bellman-Ford Algorithm</h3>
                  <p>
                    The Bellman-Ford algorithm is a dynamic programming algorithm that computes shortest paths from a
                    single source vertex to all other vertices in a weighted digraph.
                  </p>
                  <p>
                    It was developed by Richard Bellman and Lester Ford Jr. independently in the 1950s. Unlike
                    Dijkstra's algorithm, Bellman-Ford can handle graphs with negative edge weights and detect negative
                    cycles.
                  </p>
                  <h4 className="text-lg font-semibold mt-4 text-orange-300">Key Characteristics:</h4>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Uses dynamic programming to find the shortest path</li>
                    <li>Relaxes all edges V-1 times (where V is the number of vertices)</li>
                    <li>Can handle negative edge weights</li>
                    <li>Can detect negative cycles in the graph</li>
                    <li>Slower than Dijkstra's algorithm but more versatile</li>
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="steps" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {algorithm === "dijkstra" ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-400">Dijkstra's Algorithm Steps</h3>
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>Initialization:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Set distance to source vertex to 0</li>
                        <li>Set distance to all other vertices to infinity</li>
                        <li>Add all vertices to the unvisited set</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Selection:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Select the unvisited vertex with the smallest distance</li>
                        <li>Mark it as visited (remove from unvisited set)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Relaxation:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>For each neighbor of the current vertex:</li>
                        <li>Calculate tentative distance = current vertex distance + edge weight</li>
                        <li>If tentative distance is less than the neighbor's current distance, update it</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Repeat:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Repeat steps 2-3 until all vertices are visited</li>
                        <li>Or until the destination vertex is visited (if finding a specific path)</li>
                      </ul>
                    </li>
                  </ol>

                  <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                    <h4 className="text-lg font-semibold mb-2 text-white">Pseudocode:</h4>
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {`function Dijkstra(Graph, source):
    // Initialization
    for each vertex v in Graph:
        dist[v] = INFINITY
        prev[v] = UNDEFINED
        add v to unvisited
    dist[source] = 0
    
    // Main loop
    while unvisited is not empty:
        u = vertex in unvisited with min dist[u]
        remove u from unvisited
        
        // Relaxation
        for each neighbor v of u:
            alt = dist[u] + weight(u, v)
            if alt < dist[v]:
                dist[v] = alt
                prev[v] = u
                
    return dist[], prev[]`}
                    </pre>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-400">Bellman-Ford Algorithm Steps</h3>
                  <ol className="list-decimal pl-6 space-y-4">
                    <li>
                      <strong>Initialization:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Set distance to source vertex to 0</li>
                        <li>Set distance to all other vertices to infinity</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Edge Relaxation:</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>Repeat V-1 times (where V is the number of vertices):</li>
                        <li>For each edge (u,v) with weight w in the graph:</li>
                        <li>If dist[u] + w &lt; dist[v], then update dist[v] = dist[u] + w</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Negative Cycle Detection (Optional):</strong>
                      <ul className="list-disc pl-6 mt-2">
                        <li>For each edge (u,v) with weight w in the graph:</li>
                        <li>If dist[u] + w &lt; dist[v], then a negative cycle exists</li>
                      </ul>
                    </li>
                  </ol>

                  <div className="mt-6 p-4 bg-slate-800 rounded-md border border-slate-700">
                    <h4 className="text-lg font-semibold mb-2">Pseudocode:</h4>
                    <pre className="text-sm text-slate-300 font-mono whitespace-pre-wrap">
                      {`function BellmanFord(Graph, source):
    // Initialization
    for each vertex v in Graph:
        dist[v] = INFINITY
        prev[v] = UNDEFINED
    dist[source] = 0
    
    // Edge Relaxation
    for i from 1 to |V|-1:
        for each edge (u,v) with weight w in Graph:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                prev[v] = u
    
    // Negative Cycle Detection
    for each edge (u,v) with weight w in Graph:
        if dist[u] + w < dist[v]:
            return "Graph contains a negative cycle"
            
    return dist[], prev[]`}
                    </pre>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="complexity" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {algorithm === "dijkstra" ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-400">Dijkstra's Algorithm Time Complexity</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-purple-300">Implementation Variants:</h4>
                      <table className="w-full mt-2">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2">Data Structure</th>
                            <th className="text-left py-2">Time Complexity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Array</td>
                            <td className="py-2">O(V²)</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Binary Heap</td>
                            <td className="py-2">O(E log V)</td>
                          </tr>
                          <tr>
                            <td className="py-2">Fibonacci Heap</td>
                            <td className="py-2">O(E + V log V)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-purple-300">Case Analysis:</h4>
                      <table className="w-full mt-2">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2">Case</th>
                            <th className="text-left py-2">Time Complexity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Best Case</td>
                            <td className="py-2">O(E + V log V)</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Average Case</td>
                            <td className="py-2">O(E + V log V)</td>
                          </tr>
                          <tr>
                            <td className="py-2">Worst Case</td>
                            <td className="py-2">O(E + V log V)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-purple-300">Space Complexity:</h4>
                    <p className="mt-2">
                      The space complexity of Dijkstra's algorithm is O(V), where V is the number of vertices. This
                      accounts for storing the distance array, visited set, and the priority queue.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-purple-300">Complexity Analysis:</h4>
                    <p className="mt-2">
                      The time complexity of Dijkstra's algorithm depends on the data structure used for the priority
                      queue:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        <strong>Using an array:</strong> O(V²) - Each extraction of minimum takes O(V) time, and we do
                        this V times.
                      </li>
                      <li>
                        <strong>Using a binary heap:</strong> O(E log V) - Each extraction takes O(log V) time, and we
                        perform O(E) decrease-key operations.
                      </li>
                      <li>
                        <strong>Using a Fibonacci heap:</strong> O(E + V log V) - Extraction takes O(log V) amortized
                        time, and decrease-key takes O(1) amortized time.
                      </li>
                    </ul>
                    <p className="mt-4">
                      For sparse graphs (where E ≈ V), the binary heap implementation runs in O(V log V) time, which is
                      efficient. For dense graphs (where E ≈ V²), the array implementation might be more practical
                      despite its higher asymptotic complexity.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-400">Bellman-Ford Algorithm Time Complexity</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-orange-300">Standard Implementation:</h4>
                      <table className="w-full mt-2">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2">Operation</th>
                            <th className="text-left py-2">Time Complexity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Initialization</td>
                            <td className="py-2">O(V)</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Edge Relaxation</td>
                            <td className="py-2">O(V × E)</td>
                          </tr>
                          <tr>
                            <td className="py-2">Negative Cycle Check</td>
                            <td className="py-2">O(E)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-orange-300">Case Analysis:</h4>
                      <table className="w-full mt-2">
                        <thead>
                          <tr className="border-b border-slate-700">
                            <th className="text-left py-2">Case</th>
                            <th className="text-left py-2">Time Complexity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Best Case</td>
                            <td className="py-2">O(V × E)</td>
                          </tr>
                          <tr className="border-b border-slate-800">
                            <td className="py-2">Average Case</td>
                            <td className="py-2">O(V × E)</td>
                          </tr>
                          <tr>
                            <td className="py-2">Worst Case</td>
                            <td className="py-2">O(V × E)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-orange-300">Space Complexity:</h4>
                    <p className="mt-2">
                      The space complexity of Bellman-Ford algorithm is O(V), where V is the number of vertices. This
                      accounts for storing the distance array and the predecessor array.
                    </p>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-orange-300">Complexity Analysis:</h4>
                    <p className="mt-2">
                      The time complexity of the Bellman-Ford algorithm is O(V × E), where V is the number of vertices
                      and E is the number of edges:
                    </p>
                    <ul className="list-disc pl-6 mt-2 space-y-2">
                      <li>
                        <strong>Initialization:</strong> O(V) time to initialize distance values.
                      </li>
                      <li>
                        <strong>Main relaxation loop:</strong> We perform V-1 iterations, and in each iteration, we
                        examine all E edges, resulting in O(V × E) time.
                      </li>
                      <li>
                        <strong>Negative cycle detection:</strong> O(E) time to check all edges once more.
                      </li>
                    </ul>
                    <p className="mt-4">
                      For dense graphs (where E ≈ V²), the time complexity becomes O(V³), which is significantly slower
                      than Dijkstra's algorithm. However, Bellman-Ford can handle negative edge weights, which Dijkstra
                      cannot.
                    </p>
                    <p className="mt-2">
                      There are optimized versions of Bellman-Ford, such as SPFA (Shortest Path Faster Algorithm), that
                      can perform better in practice but still have the same worst-case complexity.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="applications" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              {algorithm === "dijkstra" ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-purple-400">Applications of Dijkstra's Algorithm</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Networking</h4>
                      <ul className="list-disc pl-6 space-y-2 text-gray-300">
                        <li>Routing protocols (OSPF, IS-IS)</li>
                        <li>Network path finding</li>
                        <li>Traffic engineering</li>
                        <li>Quality of Service (QoS) routing</li>
                        <li>Software-defined networking (SDN)</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Transportation</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>GPS navigation systems</li>
                        <li>Flight path optimization</li>
                        <li>Public transit routing</li>
                        <li>Traffic management systems</li>
                        <li>Ride-sharing applications</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Robotics & AI</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Robot path planning</li>
                        <li>Autonomous vehicle navigation</li>
                        <li>Game AI pathfinding</li>
                        <li>Maze solving algorithms</li>
                        <li>Spatial analysis in GIS</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-purple-300 mb-3">Other Applications</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Social network analysis</li>
                        <li>Telecommunications network design</li>
                        <li>Project scheduling</li>
                        <li>Currency exchange optimization</li>
                        <li>Computer chip design (VLSI)</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-purple-300">Advantages:</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li>Efficient for sparse graphs</li>
                      <li>Guarantees optimal solution for non-negative weights</li>
                      <li>Can be terminated early when finding a specific path</li>
                      <li>Adaptable to various priority queue implementations</li>
                      <li>Widely implemented in libraries and frameworks</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-purple-300">Limitations:</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-white-300">
                      <li>Cannot handle negative edge weights</li>
                      <li>Less efficient for dense graphs</li>
                      <li>Not suitable for graphs with negative cycles</li>
                      <li>Memory intensive for very large graphs</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-orange-400">Applications of Bellman-Ford Algorithm</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Networking</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Distance Vector Routing protocols (RIP)</li>
                        <li>Network routing with QoS constraints</li>
                        <li>BGP path vector protocol</li>
                        <li>Network flow optimization</li>
                        <li>Distributed systems coordination</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Finance</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Currency arbitrage detection</li>
                        <li>Forex trading optimization</li>
                        <li>Risk analysis in financial networks</li>
                        <li>Optimal trading strategies</li>
                        <li>Financial market modeling</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Systems & Operations</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Resource allocation problems</li>
                        <li>Supply chain optimization</li>
                        <li>Critical path analysis</li>
                        <li>Distributed systems synchronization</li>
                        <li>Constraint satisfaction problems</li>
                      </ul>
                    </div>

                    <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                      <h4 className="text-lg font-semibold text-orange-300 mb-3">Other Applications</h4>
                      <ul className="list-disc pl-6 space-y-2 text-white">
                        <li>Computational biology (sequence alignment)</li>
                        <li>Game theory (finding Nash equilibria)</li>
                        <li>Computer graphics (image warping)</li>
                        <li>Natural language processing</li>
                        <li>Circuit design and analysis</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-semibold text-orange-300">Advantages:</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-white-300">
                      <li>Can handle negative edge weights</li>
                      <li>Can detect negative cycles</li>
                      <li>Simple to implement</li>
                      <li>Works with any graph topology</li>
                      <li>Guaranteed to find the shortest path if no negative cycles exist</li>
                    </ul>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-lg font-semibold text-orange-300">Limitations:</h4>
                    <ul className="list-disc pl-6 mt-2 space-y-1 text-white-300">
                      <li>Slower than Dijkstra's algorithm</li>
                      <li>Poor performance on large, dense graphs</li>
                      <li>Higher computational complexity</li>
                      <li>Not suitable for real-time applications with large graphs</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

