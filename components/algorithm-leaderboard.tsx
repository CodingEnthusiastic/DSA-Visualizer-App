"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Medal, Clock, Zap, Award } from "lucide-react"

interface AlgorithmLeaderboardProps {
  data: any[]
  category: string
}

export default function AlgorithmLeaderboard({ data, category }: AlgorithmLeaderboardProps) {
  // Sort by average time
  const sortedData = [...data].sort((a, b) => a.avgTime - b.avgTime)

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          Algorithm Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedData.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Algorithm</TableHead>
                  <TableHead className="text-right">Avg. Time</TableHead>
                  <TableHead className="text-right">Wins</TableHead>
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead>Complexity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedData.map((entry, index) => (
                  <TableRow key={entry.algorithmId} className={index === 0 ? "bg-primary/10" : ""}>
                    <TableCell className="font-medium">
                      {index === 0 ? (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      ) : index === 1 ? (
                        <Medal className="h-5 w-5 text-slate-400" />
                      ) : index === 2 ? (
                        <Medal className="h-5 w-5 text-amber-700" />
                      ) : (
                        <span className="text-muted-foreground">{index + 1}</span>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      {entry.name}
                      {index === 0 && (
                        <Badge variant="outline" className="ml-2 bg-primary/20 text-primary-foreground">
                          Fastest
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">{entry.avgTime.toFixed(2)} ms</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Award className="h-4 w-4 text-yellow-500" />
                        {entry.wins}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{entry.runs}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {entry.complexity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Fastest Algorithm</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  {sortedData[0]?.name || "N/A"}
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Most Wins</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  {[...sortedData].sort((a, b) => b.wins - a.wins)[0]?.name || "N/A"}
                </div>
              </div>

              <div className="bg-muted/30 p-3 rounded-lg">
                <div className="text-sm text-muted-foreground">Best Performance</div>
                <div className="text-lg font-semibold flex items-center gap-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  {sortedData[0]?.avgTime.toFixed(2) || "0"} ms
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Run some algorithm races to populate the leaderboard
          </div>
        )}
      </CardContent>
    </Card>
  )
}

