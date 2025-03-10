"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartGrid, ChartLine, ChartLineSeries, ChartAxis, Chart } from "@/components/ui/chart";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

export default function TimeComplexityComparison() {
  const [caseType, setCaseType] = useState("average");

  const generateDataPoints = (type: string) => {
    const points = [];
    for (let i = 5; i <= 100; i += 5) {
      const v = i;
      let e = type === "best" ? v : type === "average" ? v * Math.log(v) : v * v;
      const dijkstra = e + v * Math.log(v);
      const bellmanFord = v * e;

      points.push({
        nodes: v,
        dijkstra: Math.round(dijkstra),
        bellmanFord: Math.round(bellmanFord),
      });
    }
    return points;
  };

  const bestCaseData = generateDataPoints("best");
  const averageCaseData = generateDataPoints("average");
  const worstCaseData = generateDataPoints("worst");

  const currentData = caseType === "best" ? bestCaseData : caseType === "average" ? averageCaseData : worstCaseData;

  return (
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
                  <TableHead>Algorithm</TableHead>
                  <TableHead>Time Complexity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Dijkstra</TableCell>
                  <TableCell>O(E + V log V)</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Bellman-Ford</TableCell>
                  <TableCell>O(V × E)</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle>Key Differences</CardTitle>
            <CardDescription>Algorithm comparison</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Dijkstra</TableHead>
                  <TableHead>Bellman-Ford</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Negative Edges</TableCell>
                  <TableCell className="text-red-500">Cannot handle</TableCell>
                  <TableCell className="text-green-500">Can handle</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Negative Cycles</TableCell>
                  <TableCell className="text-red-500">Cannot detect</TableCell>
                  <TableCell className="text-green-500">Can detect</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Performance</TableCell>
                  <TableCell className="text-green-500">Faster</TableCell>
                  <TableCell className="text-yellow-500">Slower</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Approach</TableCell>
                  <TableCell>Greedy</TableCell>
                  <TableCell>Dynamic Programming</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>Operations count vs. Graph size</CardDescription>
            </div>
            <Tabs value={caseType} onValueChange={setCaseType} className="w-[400px]">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="best">Best Case</TabsTrigger>
                <TabsTrigger value="average">Average Case</TabsTrigger>
                <TabsTrigger value="worst">Worst Case</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={currentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nodes" label={{ value: "Number of Nodes (V)", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Operations Count", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dijkstra" stroke="#a855f7" strokeWidth={3} />
                <Line type="monotone" dataKey="bellmanFord" stroke="#f97316" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center mt-4 space-x-6">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-500 rounded-full mr-2"></div>
              <span className="font-medium">Dijkstra</span>
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-orange-500 rounded-full mr-2"></div>
              <span className="font-medium">Bellman-Ford</span>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-400">
            <h4 className="font-medium text-slate-300 mb-2">Case Description:</h4>
            {caseType === "best" && <p>Best case: Sparse graphs (E ≈ V). Dijkstra is significantly faster.</p>}
            {caseType === "average" && <p>Average case: Medium density (E ≈ V log V). Dijkstra still wins.</p>}
            {caseType === "worst" && <p>Worst case: Dense graphs (E ≈ V²). Bellman-Ford's cubic complexity is clear.</p>}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
