'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Plus, Upload, Search, Filter, MoreHorizontal, Mail, Trash2, Tag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Prospect, ProspectList } from '@/types'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const emailStatusColors = {
  valid: 'success',
  risky: 'warning',
  invalid: 'destructive',
  unknown: 'secondary',
} as const

const prospectStatusColors = {
  active: 'success',
  unsubscribed: 'secondary',
  bounced: 'destructive',
  invalid: 'destructive',
} as const

interface ProspectsViewProps {
  prospects: Prospect[]
  lists: ProspectList[]
}

export function ProspectsView({ prospects: initialProspects, lists }: ProspectsViewProps) {
  const [prospects, setProspects] = useState(initialProspects)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const filtered = prospects.filter((p) => {
    const name = `${p.first_name ?? ''} ${p.last_name ?? ''}`.toLowerCase()
    const company = (p.company ?? '').toLowerCase()
    const email = p.email.toLowerCase()
    const q = search.toLowerCase()
    return name.includes(q) || company.includes(q) || email.includes(q)
  })

  const toggleSelect = (id: string) => {
    const newSet = new Set(selected)
    if (newSet.has(id)) newSet.delete(id)
    else newSet.add(id)
    setSelected(newSet)
  }

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(filtered.map((p) => p.id)))
    }
  }

  const handleDelete = async (ids: string[]) => {
    const supabase = createClient()
    const { error } = await supabase.from('prospects').delete().in('id', ids)
    if (error) {
      toast.error('Failed to delete prospects')
      return
    }
    setProspects(prospects.filter((p) => !ids.includes(p.id)))
    setSelected(new Set())
    toast.success(`${ids.length} prospect${ids.length > 1 ? 's' : ''} deleted`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Prospects</h1>
          <p className="text-muted-foreground mt-1">{prospects.length} total contacts</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" asChild>
            <Link href="/prospects/import">
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Link>
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Prospect
          </Button>
        </div>
      </div>

      {/* Lists */}
      {lists.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground">Lists:</span>
          {lists.map((list) => (
            <button
              key={list.id}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-slate-300 hover:border-indigo-500/30 hover:text-indigo-300 transition-all"
            >
              <Users className="h-3 w-3" />
              {list.name}
              <span className="text-muted-foreground">({list.prospect_count})</span>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prospects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {selected.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{selected.size} selected</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(Array.from(selected))}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="h-8 w-8 text-indigo-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {search ? 'No prospects found' : 'No prospects yet'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {search ? 'Try a different search' : 'Import a CSV or add prospects manually'}
          </p>
          {!search && (
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" asChild>
                <Link href="/prospects/import">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Link>
              </Button>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Manually
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-white/3">
            <input
              type="checkbox"
              className="rounded border-white/20 bg-transparent"
              checked={selected.size === filtered.length && filtered.length > 0}
              onChange={selectAll}
            />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex-1">Prospect</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide w-32 hidden md:block">Company</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide w-24 hidden lg:block">Status</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide w-24 hidden xl:block">Email</span>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide w-24 hidden lg:block">Added</span>
            <div className="w-8" />
          </div>

          {/* Rows */}
          <div className="divide-y divide-white/5">
            {filtered.map((prospect, idx) => {
              const initials = `${(prospect.first_name ?? '')[0] ?? ''}${(prospect.last_name ?? '')[0] ?? ''}`.toUpperCase() || prospect.email[0].toUpperCase()
              const isSelected = selected.has(prospect.id)

              return (
                <motion.div
                  key={prospect.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`flex items-center gap-3 px-4 py-3 hover:bg-white/3 transition-colors ${isSelected ? 'bg-indigo-500/5' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="rounded border-white/20 bg-transparent"
                    checked={isSelected}
                    onChange={() => toggleSelect(prospect.id)}
                  />

                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {[prospect.first_name, prospect.last_name].filter(Boolean).join(' ') || '—'}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{prospect.email}</p>
                    </div>
                  </div>

                  <div className="w-32 hidden md:block">
                    <p className="text-sm text-slate-300 truncate">{prospect.company || '—'}</p>
                    <p className="text-xs text-muted-foreground truncate">{prospect.job_title || ''}</p>
                  </div>

                  <div className="w-24 hidden lg:block">
                    <Badge variant={prospectStatusColors[prospect.status]}>
                      {prospect.status}
                    </Badge>
                  </div>

                  <div className="w-24 hidden xl:block">
                    <Badge variant={emailStatusColors[prospect.email_status]}>
                      {prospect.email_status}
                    </Badge>
                  </div>

                  <div className="w-24 hidden lg:block">
                    <p className="text-xs text-muted-foreground">
                      {formatRelativeTime(prospect.created_at)}
                    </p>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <MoreHorizontal className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Email
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Tag className="h-4 w-4 mr-2" />
                        Add Tag
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-400 focus:text-red-400"
                        onClick={() => handleDelete([prospect.id])}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
