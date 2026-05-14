"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Bookmark,
} from "lucide-react"

const stats = [
  {
    title: "Total Applications",
    value: "48",
    change: "+12%",
    trend: "up",
    icon: Send,
    description: "vs last month",
  },
  {
    title: "Interview Rate",
    value: "32%",
    change: "+5%",
    trend: "up",
    icon: Target,
    description: "of applications",
  },
  {
    title: "Avg. Response Time",
    value: "8 days",
    change: "-2 days",
    trend: "up",
    icon: Clock,
    description: "from application",
  },
  {
    title: "Offer Rate",
    value: "12%",
    change: "+3%",
    trend: "up",
    icon: CheckCircle2,
    description: "of interviews",
  },
]

const statusBreakdown = [
  { label: "Saved", count: 12, color: "bg-slate-400", icon: Bookmark },
  { label: "Applied", count: 18, color: "bg-blue-500", icon: Send },
  { label: "Interview", count: 8, color: "bg-amber-500", icon: Target },
  { label: "Offer", count: 4, color: "bg-emerald-500", icon: CheckCircle2 },
  { label: "Rejected", count: 6, color: "bg-rose-500", icon: XCircle },
]

const recentActivity = [
  { action: "Applied to", company: "Google", role: "Senior Engineer", time: "2 hours ago" },
  { action: "Interview scheduled with", company: "Meta", role: "Staff Engineer", time: "5 hours ago" },
  { action: "Received offer from", company: "Vercel", role: "Frontend Engineer", time: "1 day ago" },
  { action: "Applied to", company: "Stripe", role: "Full Stack Dev", time: "2 days ago" },
  { action: "Rejected by", company: "Netflix", role: "UI Engineer", time: "3 days ago" },
]

export default function AnalyticsPage() {
  const totalApplications = 48

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar totalJobs={totalApplications} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="border-b border-border bg-background px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold text-foreground sm:text-xl">Analytics</h1>
          <p className="mt-0.5 text-xs text-muted-foreground sm:text-sm">
            Track your job search progress and performance
          </p>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-rose-500" />
                    )}
                    <span className={stat.trend === "up" ? "text-emerald-500" : "text-rose-500"}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status Breakdown</CardTitle>
                <CardDescription>Distribution of your applications by status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {statusBreakdown.map((status) => (
                    <div key={status.label} className="flex items-center gap-4">
                      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${status.color}`}>
                        <status.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{status.label}</span>
                          <span className="text-sm text-muted-foreground">{status.count}</span>
                        </div>
                        <div className="mt-1.5 h-2 w-full rounded-full bg-secondary">
                          <div
                            className={`h-full rounded-full ${status.color}`}
                            style={{ width: `${(status.count / totalApplications) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest job search activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="text-muted-foreground">{activity.action}</span>{" "}
                          <span className="font-medium">{activity.company}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.role} &middot; {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Application Timeline</CardTitle>
              <CardDescription>Applications submitted over the past 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex h-48 items-end justify-between gap-2">
                {Array.from({ length: 14 }).map((_, i) => {
                  const height = Math.random() * 80 + 20
                  return (
                    <div key={i} className="flex flex-1 flex-col items-center gap-2">
                      <div
                        className="w-full rounded-t-sm bg-primary/80 transition-all hover:bg-primary"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{i + 1}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
