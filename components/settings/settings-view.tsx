'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { User, Shield, Bell, Plug, Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import type { Profile } from '@/types'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

const profileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
})

interface SettingsViewProps {
  profile: Profile | null
}

export function SettingsView({ profile }: SettingsViewProps) {
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
    },
  })

  const onSaveProfile = async (data: { full_name: string }) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.full_name })
        .eq('id', profile?.id!)

      if (error) throw error
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : profile?.email?.slice(0, 2).toUpperCase() ?? 'U'

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">
            <User className="h-3.5 w-3.5 mr-1.5" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-3.5 w-3.5 mr-1.5" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Plug className="h-3.5 w-3.5 mr-1.5" />
            Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card glass>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={profile?.avatar_url ?? undefined} />
                  <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max 2MB.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input {...register('full_name')} />
                  {errors.full_name && (
                    <p className="text-xs text-red-400">{errors.full_name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input value={profile?.email || ''} disabled className="opacity-60" />
                  <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support.</p>
                </div>

                <div className="space-y-1.5">
                  <Label>Referral Code</Label>
                  <div className="flex gap-2">
                    <Input value={profile?.referral_code || ''} readOnly />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${window.location.origin}/ref/${profile?.referral_code}`
                        )
                        toast.success('Referral link copied!')
                      }}
                    >
                      Copy Link
                    </Button>
                  </div>
                </div>

                <Button type="submit" loading={loading}>Save Changes</Button>
              </form>
            </CardContent>
          </Card>

          {/* Danger zone */}
          <Card glass className="border-red-500/20 mt-4">
            <CardHeader>
              <CardTitle className="text-red-400">Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                <div>
                  <p className="text-sm font-medium text-white">Delete Account</p>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card glass>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm New Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <Button>Update Password</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card glass>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: 'New reply received', desc: 'Get notified when a prospect replies', default: true },
                { label: 'Campaign sent', desc: 'Confirmation when campaign is fully sent', default: true },
                { label: 'Trial ending', desc: '3 days before trial expires', default: true },
                { label: 'Weekly digest', desc: 'Weekly summary of campaign performance', default: false },
                { label: 'New features', desc: 'Product updates and new features', default: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-white/3">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch defaultChecked={item.default} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="space-y-4">
            {[
              {
                name: 'Gmail',
                desc: 'Connect Gmail for two-way reply sync',
                logo: '📧',
                connected: false,
              },
              {
                name: 'Outlook',
                desc: 'Connect Outlook for two-way reply sync',
                logo: '📨',
                connected: false,
              },
              {
                name: 'LinkedIn',
                desc: 'Connect LinkedIn for multi-channel sequences',
                logo: '💼',
                connected: false,
              },
              {
                name: 'Zapier',
                desc: 'Connect Opsiflo with 5,000+ apps via Zapier',
                logo: '⚡',
                connected: false,
              },
            ].map((integration) => (
              <Card key={integration.name} glass>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{integration.logo}</span>
                    <div>
                      <p className="font-medium text-white">{integration.name}</p>
                      <p className="text-sm text-muted-foreground">{integration.desc}</p>
                    </div>
                  </div>
                  <Button variant={integration.connected ? 'destructive' : 'outline'} size="sm">
                    {integration.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
