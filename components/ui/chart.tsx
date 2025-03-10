"use client"

import * as React from "react"

const Chart = React.forwardRef<React.ElementRef<"div">, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div className="relative" ref={ref} {...props} />,
)
Chart.displayName = "Chart"

const ChartContainer = React.forwardRef<
  React.ElementRef<"div">,
  React.ComponentPropsWithoutRef<"div"> & {
    config?: Record<string, any>
    xScale?: any
    yScale?: any
  }
>(({ className, children, config, xScale, yScale, ...props }, ref) => (
  <div className="absolute left-0 top-0 h-full w-full" ref={ref} {...props}>
    <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
      {children}
    </svg>
  </div>
))
ChartContainer.displayName = "ChartContainer"

const ChartGrid = ({ horizontal = false, vertical = false }) => {
  return (
    <>
      {horizontal && <line x1="0" x2="100" y1="50" y2="50" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />}
      {vertical && <line x1="50" x2="50" y1="0" y2="100" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />}
    </>
  )
}
ChartGrid.displayName = "ChartGrid"

const ChartLine = React.forwardRef<
  React.ElementRef<"line">,
  React.ComponentPropsWithoutRef<"line"> & {
    orientation?: "horizontal" | "vertical"
    value?: number
  }
>(({ orientation = "horizontal", value = 0, style, ...props }, ref) => {
  const lineProps =
    orientation === "horizontal" ? { x1: 0, x2: 100, y1: value, y2: value } : { x1: value, x2: value, y1: 0, y2: 100 }

  return <line {...lineProps} style={{ stroke: "#334155", strokeWidth: 1, ...style }} {...props} />
})
ChartLine.displayName = "ChartLine"

interface ChartLineSeriesProps {
  data: any[]
  xAccessor: (d: any) => number
  yAccessor: (d: any) => number
  curve?: "linear" | "monotoneX" | "monotoneY" | "natural"
  style?: React.CSSProperties
}

const ChartLineSeries = ({ data, xAccessor, yAccessor, curve = "linear", style }: ChartLineSeriesProps) => {
  const pathData = React.useMemo(() => {
    if (!data || data.length === 0) return ""

    // Scale the data to fit in the 0-100 range
    const xValues = data.map((d) => xAccessor(d))
    const yValues = data.map((d) => yAccessor(d))

    const xMin = Math.min(...xValues)
    const xMax = Math.max(...xValues)
    const yMin = Math.min(...yValues)
    const yMax = Math.max(...yValues)

    const xScale = (x: number) => ((x - xMin) / (xMax - xMin || 1)) * 100
    const yScale = (y: number) => 100 - ((y - yMin) / (yMax - yMin || 1)) * 100

    let path = `M ${xScale(xValues[0])} ${yScale(yValues[0])}`

    for (let i = 1; i < data.length; i++) {
      path += ` L ${xScale(xValues[i])} ${yScale(yValues[i])}`
    }

    return path
  }, [data, xAccessor, yAccessor])

  return <path d={pathData} stroke="currentColor" strokeWidth="2" fill="none" style={style} />
}
ChartLineSeries.displayName = "ChartLineSeries"

const ChartAxis = React.forwardRef<React.ElementRef<"text">, { position: "bottom" | "left"; label: string }>(
  ({ position, label, ...props }, ref) => {
    const x = position === "left" ? 10 : 50
    const y = position === "bottom" ? 95 : 10
    const transform = position === "left" ? "rotate(-90, 10, 50)" : ""

    return (
      <text
        ref={ref}
        x={x}
        y={y}
        transform={transform}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-sm fill-current text-muted-foreground"
        {...props}
      >
        {label}
      </text>
    )
  },
)
ChartAxis.displayName = "ChartAxis"

// Add a tooltip component
const ChartTooltip = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}
ChartTooltip.displayName = "ChartTooltip"

const ChartTooltipContent = ({
  indicator = "dot",
  nameKey = "",
  hideLabel = false,
}: {
  indicator?: "dot" | "line"
  nameKey?: string
  hideLabel?: boolean
}) => {
  return <div />
}
ChartTooltipContent.displayName = "ChartTooltipContent"

export { Chart, ChartContainer, ChartGrid, ChartLine, ChartLineSeries, ChartAxis, ChartTooltip, ChartTooltipContent }

