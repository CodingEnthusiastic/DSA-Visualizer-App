"use client"

import { useRef, useEffect, useState } from "react"
import type { Graph } from "@/lib/graph"

interface GraphCanvasProps {
  graph: Graph
  currentStep: any
  startNode: number
  setStartNode: (node: number) => void
  algorithm: string
}

export default function GraphCanvas({ graph, currentStep, startNode, setStartNode, algorithm }: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [nodePositions, setNodePositions] = useState<{ [key: number]: { x: number; y: number } }>({})
  const [hoveredNode, setHoveredNode] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedNode, setDraggedNode] = useState<number | null>(null)

  // Fix the initial graph size issue by ensuring the canvas is properly sized on first render
  // Add this at the beginning of the component, before any useEffect hooks
  useEffect(() => {
    // Set initial canvas size
    const resizeCanvas = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    
    // Call immediately and also after a short delay to ensure container is fully rendered
    resizeCanvas();
    const timer = setTimeout(resizeCanvas, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Calculate node positions in a circular layout
  useEffect(() => {
    const positions: { [key: number]: { x: number; y: number } } = {}
    const nodeCount = graph.nodes.length
    const radius = Math.min(canvasRef.current?.width || 400, canvasRef.current?.height || 300) * 0.4
    const centerX = (canvasRef.current?.width || 400) / 2
    const centerY = (canvasRef.current?.height || 300) / 2

    graph.nodes.forEach((node, index) => {
      const angle = (index / nodeCount) * Math.PI * 2
      positions[node.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    setNodePositions(positions)
  }, [graph])

  // Draw the graph
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions to match container
    if (containerRef.current) {
      canvas.width = containerRef.current.clientWidth
      canvas.height = containerRef.current.clientHeight
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "rgba(30, 41, 59, 0.5)"
    ctx.lineWidth = 1
    const gridSize = 20

    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }

    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw edges
    graph.edges.forEach((edge) => {
      const source = nodePositions[edge.source]
      const target = nodePositions[edge.target]

      if (!source || !target) return

      // Determine if this edge is being relaxed in the current step
      const isRelaxed = currentStep.relaxedEdges?.some((e: any) => e.source === edge.source && e.target === edge.target)

      // Determine edge color based on algorithm and state
      let edgeColor = "rgba(148, 163, 184, 0.5)" // Default edge color

      if (isRelaxed) {
        edgeColor = algorithm === "dijkstra" ? "rgba(126, 34, 206, 0.8)" : "rgba(234, 88, 12, 0.8)"
      }

      // Draw edge
      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)
      ctx.strokeStyle = edgeColor
      ctx.lineWidth = isRelaxed ? 3 : 2
      ctx.stroke()

      // Draw weight
      const midX = (source.x + target.x) / 2
      const midY = (source.y + target.y) / 2

      ctx.fillStyle = "white"
      ctx.font = "12px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      // Draw weight background
      const weightText = edge.weight.toString()
      const textMetrics = ctx.measureText(weightText)
      const padding = 4

      ctx.fillStyle = "rgba(15, 23, 42, 0.8)"
      ctx.fillRect(
        midX - textMetrics.width / 2 - padding,
        midY - 8 - padding,
        textMetrics.width + padding * 2,
        16 + padding * 2,
      )

      ctx.fillStyle = isRelaxed ? "#fbbf24" : "white"
      ctx.fillText(weightText, midX, midY)
    })

    // Draw nodes
    graph.nodes.forEach((node) => {
      const pos = nodePositions[node.id]
      if (!pos) return

      const isStart = node.id === startNode
      const isCurrent = node.id === currentStep.current
      const isVisited = currentStep.visited?.includes(node.id)
      const isHovered = node.id === hoveredNode

      // Determine node color based on state
      let fillColor = "rgba(30, 41, 59, 1)"
      let strokeColor = "rgba(148, 163, 184, 1)"
      const textColor = "white"

      if (isStart) {
        fillColor = "rgba(16, 185, 129, 1)"
        strokeColor = "rgba(5, 150, 105, 1)"
      } else if (isCurrent) {
        fillColor = algorithm === "dijkstra" ? "rgba(126, 34, 206, 1)" : "rgba(234, 88, 12, 1)"
        strokeColor = algorithm === "dijkstra" ? "rgba(107, 33, 168, 1)" : "rgba(194, 65, 12, 1)"
      } else if (isVisited) {
        fillColor = algorithm === "dijkstra" ? "rgba(126, 34, 206, 0.6)" : "rgba(234, 88, 12, 0.6)"
        strokeColor = algorithm === "dijkstra" ? "rgba(107, 33, 168, 0.6)" : "rgba(194, 65, 12, 0.6)"
      }

      // Enhance the node hover effect by making it more prominent
      // In the useEffect that draws the graph, update the node drawing code:
      // When drawing nodes, increase the hover effect
      if (isHovered) {
        strokeColor = "rgba(255, 255, 255, 1)";
        ctx.lineWidth = 4; // Increase from 3 to 4 for more prominent hover
        // Add a subtle glow effect
        ctx.shadowColor = "rgba(255, 255, 255, 0.7)";
        ctx.shadowBlur = 10;
      } else {
        ctx.lineWidth = 2;
        ctx.shadowBlur = 0;
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, 20, 0, Math.PI * 2)
      ctx.fillStyle = fillColor
      ctx.fill()
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = isHovered ? 3 : 2
      ctx.stroke()

      // Draw node ID
      ctx.fillStyle = textColor
      ctx.font = "bold 14px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.id.toString(), pos.x, pos.y)

      // Draw distance if available
      if (currentStep.distances && currentStep.distances[node.id] !== undefined) {
        const distance = currentStep.distances[node.id]
        const distanceText = distance === Number.POSITIVE_INFINITY ? "∞" : distance.toString()

        ctx.font = "12px sans-serif"
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.fillText(distanceText, pos.x, pos.y + 30)
      }
    })
  }, [graph, nodePositions, currentStep, hoveredNode, startNode, algorithm])

  // Handle mouse interactions
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Check if mouse is over any node
      let hovered = null
      for (const [nodeId, pos] of Object.entries(nodePositions)) {
        const distance = Math.sqrt(Math.pow(x - pos.x, 2) + Math.pow(y - pos.y, 2))
        if (distance <= 20) {
          hovered = Number.parseInt(nodeId)
          break
        }
      }

      setHoveredNode(hovered)

      // Handle dragging
      if (isDragging && draggedNode !== null && nodePositions[draggedNode]) {
        const newPositions = { ...nodePositions }
        newPositions[draggedNode] = { x, y }
        setNodePositions(newPositions)
      }
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (hoveredNode !== null) {
        setIsDragging(true)
        setDraggedNode(hoveredNode)
      }
    }

    const handleMouseUp = () => {
      if (isDragging && draggedNode !== null && hoveredNode === draggedNode) {
        // If clicked on a node without dragging, set it as start node
        setStartNode(draggedNode)
      }

      setIsDragging(false)
      setDraggedNode(null)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    canvas.addEventListener("mousedown", handleMouseDown)
    canvas.addEventListener("mouseup", handleMouseUp)
    canvas.addEventListener("mouseleave", handleMouseUp)

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove)
      canvas.removeEventListener("mousedown", handleMouseDown)
      canvas.removeEventListener("mouseup", handleMouseUp)
      canvas.removeEventListener("mouseleave", handleMouseUp)
    }
  }, [nodePositions, hoveredNode, isDragging, draggedNode, setStartNode])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth
        canvasRef.current.height = containerRef.current.clientHeight
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div ref={containerRef} className="w-full h-full">
      <canvas ref={canvasRef} className="w-full h-full cursor-pointer" />
    </div>
  )
}
