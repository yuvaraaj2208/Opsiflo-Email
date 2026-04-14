'use client'

import { motion } from 'framer-motion'
import { Users, Mail, TrendingUp, DollarSign, Shield, Ban } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Profile } from '@/types'
import { formatNumber, formatDate } from '@/lib/utils'

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }

interface AdminDashboardProps {
  users: Profile[]
  globalStats: { emails: number; opens: number; replies: number }
  totalUsers: number
  paidUsers: number
}

export function AdminDashboard({ users, globalStats, totalUsers, paidUsers }: AdminDashboardProps) {
  const planCounts = users.reduce((acc, u) => {
    acc[u.plan] = (acc[u.plan] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const statCards = [
    { label: 'Total Users', value: formatNumber(totalUsers), icon: Users, color: 'text-indigo-400' },
    { label: 'Paid Users', value: formatNumber(paidUsers), icon: Shield, color: 'text-emerald-400' },
    { label: 'Emails Sent', value: formatNumber(globalStats.emails), icon: Mail, color: 'text-purple-400' },
    { label: 'Global Reply Rate', value: globalStats.emails > 0 ? ((globalStats.replies / globalStats.emails) * 100).toFixed(1) + '%' : '0%', icon: TrendingUp, color: 'text-cyan-400' },
  ]

  const planColors = { free: 'secondary', starter: 'info', professional: 'purple', business: 'premium' } as const

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
      <motion.div variants={item}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl">
            <Shield className="h-6 w-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform-wide management</p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} glass>
              <CardContent className="p-4">
                <Icon className={`h-4 w-4 ${stat.color} mb-2`} />
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          )
        })}
      </motion.div>

      <motion.div variants={item} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(['free', 'starter', 'professional', 'business'] as const).map((plan) => (
          <Card key={plan} glass>
            <CardContent className="p-4 text-center">
              <Badge variant={planColors[plan]} className="mb-2 capitalize">{plan}</Badge>
              <div className="text-2xl font-bold text-white">{planCounts[plan] || 0}</div>
              <div className="text-xs text-muted-foreground">users</div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <motion.div variants={item}>
        <Card glass>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Users ({totalUsers})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    {['User', 'Plan', 'Status', 'Joined', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-2 px-3 text-xs font-medium text-muted-foreground">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 20).map((user) => (
                    <tr key={user.id} className="border-b border-white/3 hover:bg-white/3">
                      <td className="py-2.5 px-3">
                        <div className="font-medium text-white">{user.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={planColors[user.plan]} className="capitalize">{user.plan}</Badge>
                      </td>
                      <td className="py-2.5 px-3">
                        <Badge variant={user.plan_status === 'active' ? 'success' : 'secondary'}>
                          {user.plan_status}
                        </Badge>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-muted-foreground">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="py-2.5 px-3">
                        <Button variant="ghost" size="sm" className="h-7 text-xs text-red-400 hover:text-red-300">
                          <Ban className="h-3 w-3 mr-1" />
                          Suspend
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
