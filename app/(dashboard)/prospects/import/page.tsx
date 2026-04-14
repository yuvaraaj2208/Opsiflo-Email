'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Upload, FileText, CheckCircle, AlertTriangle, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const CSV_FIELDS = [
  { value: 'email', label: 'Email *', required: true },
  { value: 'first_name', label: 'First Name' },
  { value: 'last_name', label: 'Last Name' },
  { value: 'company', label: 'Company' },
  { value: 'job_title', label: 'Job Title' },
  { value: 'industry', label: 'Industry' },
  { value: 'country', label: 'Country' },
  { value: 'phone', label: 'Phone' },
  { value: 'linkedin_url', label: 'LinkedIn URL' },
  { value: 'skip', label: '— Skip this column —' },
]

export default function ImportProspectsPage() {
  const router = useRouter()
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [headers, setHeaders] = useState<string[]>([])
  const [preview, setPreview] = useState<string[][]>([])
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [importing, setImporting] = useState(false)
  const [step, setStep] = useState<'upload' | 'map' | 'done'>('upload')
  const [importStats, setImportStats] = useState({ total: 0, imported: 0, skipped: 0 })

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(Boolean)
    return lines.map((line) => {
      const result: string[] = []
      let current = ''
      let inQuotes = false
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuotes = !inQuotes
        } else if (line[i] === ',' && !inQuotes) {
          result.push(current.trim())
          current = ''
        } else {
          current += line[i]
        }
      }
      result.push(current.trim())
      return result
    })
  }

  const handleFile = (f: File) => {
    if (!f.name.endsWith('.csv')) {
      toast.error('Please upload a CSV file')
      return
    }
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const rows = parseCSV(text)
      if (rows.length < 2) {
        toast.error('CSV must have at least a header row and one data row')
        return
      }

      const csvHeaders = rows[0]
      const previewData = rows.slice(1, 6)
      setHeaders(csvHeaders)
      setPreview(previewData)

      // Auto-map columns
      const autoMap: Record<string, string> = {}
      csvHeaders.forEach((h) => {
        const lower = h.toLowerCase().trim()
        if (lower.includes('email')) autoMap[h] = 'email'
        else if (lower.includes('first') && lower.includes('name')) autoMap[h] = 'first_name'
        else if (lower.includes('last') && lower.includes('name')) autoMap[h] = 'last_name'
        else if (lower.includes('company') || lower.includes('organization')) autoMap[h] = 'company'
        else if (lower.includes('title') || lower.includes('role') || lower.includes('position')) autoMap[h] = 'job_title'
        else if (lower.includes('industry')) autoMap[h] = 'industry'
        else if (lower.includes('country')) autoMap[h] = 'country'
        else if (lower.includes('phone')) autoMap[h] = 'phone'
        else if (lower.includes('linkedin')) autoMap[h] = 'linkedin_url'
        else autoMap[h] = 'skip'
      })
      setMapping(autoMap)
      setStep('map')
    }
    reader.readAsText(f)
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) handleFile(f)
  }, [])

  const handleImport = async () => {
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (e) => {
      const text = e.target?.result as string
      const rows = parseCSV(text)
      const dataRows = rows.slice(1)

      const supabase = createClient()

      const prospects = dataRows.map((row) => {
        const prospect: Record<string, string> = {}
        headers.forEach((header, idx) => {
          const field = mapping[header]
          if (field && field !== 'skip' && row[idx]) {
            prospect[field] = row[idx]
          }
        })
        return prospect
      }).filter((p) => p.email)

      setImporting(true)
      try {
        const { data, error } = await supabase.from('prospects').insert(
          prospects.map((p) => ({
            email: p.email ?? '',
            first_name: p.first_name ?? null,
            last_name: p.last_name ?? null,
            company: p.company ?? null,
            job_title: p.job_title ?? null,
            industry: p.industry ?? null,
            country: p.country ?? null,
            phone: p.phone ?? null,
            linkedin_url: p.linkedin_url ?? null,
            status: 'active',
            email_status: 'unknown',
            unsubscribed: false,
            tags: [],
            custom_fields: {},
          }))
        )

        setImportStats({
          total: dataRows.length,
          imported: prospects.length,
          skipped: dataRows.length - prospects.length,
        })
        setStep('done')
        toast.success(`Successfully imported ${prospects.length} prospects!`)
      } catch (error) {
        toast.error('Import failed. Please check your CSV format.')
      } finally {
        setImporting(false)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Import Prospects</h1>
        <p className="text-muted-foreground mt-1">Upload a CSV file to bulk import your contacts</p>
      </div>

      {step === 'upload' && (
        <Card glass>
          <CardContent className="p-8">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer ${
                dragging ? 'border-indigo-500 bg-indigo-500/10' : 'border-white/10 hover:border-white/20'
              }`}
              onClick={() => document.getElementById('csv-input')?.click()}
            >
              <input
                id="csv-input"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
              />
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Drop your CSV file here</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse</p>
              <Badge variant="secondary">Supports CSV up to 50MB</Badge>
            </div>

            <div className="mt-6 p-4 rounded-lg bg-indigo-500/5 border border-indigo-500/20">
              <p className="text-sm font-medium text-indigo-300 mb-2">Required columns:</p>
              <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400">
                <code className="bg-white/10 px-1.5 py-0.5 rounded">email</code>
                <span>+ any of:</span>
                <code className="bg-white/10 px-1.5 py-0.5 rounded">first_name</code>
                <code className="bg-white/10 px-1.5 py-0.5 rounded">last_name</code>
                <code className="bg-white/10 px-1.5 py-0.5 rounded">company</code>
                <code className="bg-white/10 px-1.5 py-0.5 rounded">job_title</code>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'map' && (
        <div className="space-y-5">
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Map Your Columns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {headers.map((header) => (
                <div key={header} className="flex items-center gap-3">
                  <div className="flex-1 text-sm font-medium text-white bg-white/5 rounded-lg px-3 py-2 truncate">
                    {header}
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1">
                    <Select
                      value={mapping[header] || 'skip'}
                      onValueChange={(v) => setMapping({ ...mapping, [header]: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CSV_FIELDS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Preview */}
          <Card glass>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preview (first 5 rows)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-white/5">
                      {headers.map((h) => (
                        <th key={h} className="text-left py-2 px-2 text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/3">
                        {row.map((cell, cidx) => (
                          <td key={cidx} className="py-2 px-2 text-slate-300 truncate max-w-32">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setStep('upload')}>Back</Button>
            <Button
              loading={importing}
              onClick={handleImport}
              disabled={!Object.values(mapping).includes('email')}
            >
              Import {file ? '' : 'Prospects'}
            </Button>
          </div>
        </div>
      )}

      {step === 'done' && (
        <Card glass>
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Import Complete!</h3>
            <div className="flex items-center justify-center gap-8 my-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">{importStats.total}</div>
                <div className="text-sm text-muted-foreground">Total rows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-400">{importStats.imported}</div>
                <div className="text-sm text-muted-foreground">Imported</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{importStats.skipped}</div>
                <div className="text-sm text-muted-foreground">Skipped</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button variant="outline" onClick={() => { setStep('upload'); setFile(null) }}>
                Import More
              </Button>
              <Button onClick={() => router.push('/prospects')}>
                View Prospects
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
