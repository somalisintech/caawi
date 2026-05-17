'use client';

import { CalendarPlus, Loader2, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type ProfileOption = {
  id: string;
  user: { firstName: string | null; lastName: string | null; email: string | null };
};

type SessionOption = {
  id: string;
  eventName: string | null;
  startTime: string;
  status: string;
  mentorProfile: { user: { firstName: string | null; lastName: string | null } };
  menteeProfile: { user: { firstName: string | null; lastName: string | null } };
};

export function MockBookingButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mentors, setMentors] = useState<ProfileOption[]>([]);
  const [mentees, setMentees] = useState<ProfileOption[]>([]);
  const [sessions, setSessions] = useState<SessionOption[]>([]);
  const [mentorId, setMentorId] = useState('');
  const [menteeId, setMenteeId] = useState('');
  const [offset, setOffset] = useState('1'); // hours from now

  useEffect(() => {
    if (!open) return;
    fetch('/api/dev/mock-webhook')
      .then((r) => r.json())
      .then((data) => {
        setMentors(data.mentors ?? []);
        setMentees(data.mentees ?? []);
        setSessions(data.sessions ?? []);
      });
  }, [open]);

  const name = (p: ProfileOption) =>
    [p.user.firstName, p.user.lastName].filter(Boolean).join(' ') || p.user.email || p.id.slice(0, 8);

  async function handleBook() {
    if (!mentorId || !menteeId) {
      toast.error('Select both a mentor and mentee');
      return;
    }
    setLoading(true);
    const hours = Number(offset) || 1;
    const startTime = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    const endTime = new Date(Date.now() + (hours + 0.5) * 60 * 60 * 1000).toISOString();

    const res = await fetch('/api/dev/mock-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'book',
        mentorProfileId: mentorId,
        menteeProfileId: menteeId,
        startTime,
        endTime
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      toast.success('Mock session created');
      router.refresh();
      // Re-fetch sessions list
      fetch('/api/dev/mock-webhook')
        .then((r) => r.json())
        .then((d) => setSessions(d.sessions ?? []));
    } else {
      toast.error(data.error || 'Failed');
    }
  }

  async function handleCancel(sessionId: string) {
    setLoading(true);
    const res = await fetch('/api/dev/mock-webhook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'cancel',
        sessionId,
        mentorProfileId: '_',
        menteeProfileId: '_'
      })
    });

    const data = await res.json();
    setLoading(false);

    if (data.ok) {
      toast.success('Session canceled');
      router.refresh();
      fetch('/api/dev/mock-webhook')
        .then((r) => r.json())
        .then((d) => setSessions(d.sessions ?? []));
    } else {
      toast.error(data.error || 'Failed');
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 border-dashed border-orange-500 text-orange-600">
          <CalendarPlus className="size-4" />
          Mock Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Mock Calendly Booking</DialogTitle>
          <DialogDescription>
            Simulate a Calendly webhook — creates a session directly in the database.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Mentor</Label>
            <Select value={mentorId} onValueChange={setMentorId}>
              <SelectTrigger>
                <SelectValue placeholder="Select mentor..." />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {name(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Mentee</Label>
            <Select value={menteeId} onValueChange={setMenteeId}>
              <SelectTrigger>
                <SelectValue placeholder="Select mentee..." />
              </SelectTrigger>
              <SelectContent>
                {mentees.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {name(m)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Start time (hours from now)</Label>
            <Select value={offset} onValueChange={setOffset}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0.5">30 minutes</SelectItem>
                <SelectItem value="1">1 hour</SelectItem>
                <SelectItem value="3">3 hours</SelectItem>
                <SelectItem value="24">Tomorrow</SelectItem>
                <SelectItem value="72">3 days</SelectItem>
                <SelectItem value="168">1 week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleBook} disabled={loading} className="w-full">
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Create Mock Session'}
          </Button>

          {sessions.length > 0 && (
            <div className="space-y-2 border-t pt-4">
              <Label className="text-muted-foreground">Active sessions (cancel to test)</Label>
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div>
                    <span className="font-medium">
                      {s.mentorProfile.user.firstName} &rarr; {s.menteeProfile.user.firstName}
                    </span>
                    <span className="ml-2 text-muted-foreground">{new Date(s.startTime).toLocaleDateString()}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 text-destructive"
                    onClick={() => handleCancel(s.id)}
                    disabled={loading}
                  >
                    <X className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <Badge variant="outline" className="mt-2 w-fit border-orange-300 text-orange-500">
          DEV ONLY — not shown in production
        </Badge>
      </DialogContent>
    </Dialog>
  );
}
