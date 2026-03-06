'use client';

import { Flag, ShieldBan, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { blockUserAction, reportUserAction, unblockUserAction } from '@/app/actions/trust-safety';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  targetUserId: string;
  isBlockedByViewer: boolean;
};

const REPORT_REASONS = [
  { value: 'HARASSMENT', label: 'Harassment' },
  { value: 'SPAM', label: 'Spam' },
  { value: 'INAPPROPRIATE_CONTENT', label: 'Inappropriate content' },
  { value: 'IMPERSONATION', label: 'Impersonation' },
  { value: 'OTHER', label: 'Other' }
] as const;

export function ReportBlockButtons({ targetUserId, isBlockedByViewer }: Props) {
  const [reportOpen, setReportOpen] = useState(false);
  const [reason, setReason] = useState<string>('HARASSMENT');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [blocked, setBlocked] = useState(isBlockedByViewer);

  async function handleReport() {
    setLoading(true);
    const result = await reportUserAction({ reportedId: targetUserId, reason, description: description || undefined });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setReportOpen(false);
      setDescription('');
    } else {
      toast.error(result.message);
    }
  }

  async function handleToggleBlock() {
    setLoading(true);
    const result = blocked
      ? await unblockUserAction({ blockedId: targetUserId })
      : await blockUserAction({ blockedId: targetUserId });
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      setBlocked(!blocked);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <div className="flex gap-2">
      <Dialog open={reportOpen} onOpenChange={setReportOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="gap-1 text-muted-foreground">
            <Flag className="size-3.5" />
            Report
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report user</DialogTitle>
            <DialogDescription>Help us keep the community safe. Select a reason for your report.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <RadioGroup value={reason} onValueChange={setReason}>
              {REPORT_REASONS.map((r) => (
                <div key={r.value} className="flex items-center gap-2">
                  <RadioGroupItem value={r.value} id={r.value} />
                  <Label htmlFor={r.value}>{r.label}</Label>
                </div>
              ))}
            </RadioGroup>
            <Textarea
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport} disabled={loading}>
              Submit report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        size="sm"
        variant="ghost"
        className="gap-1 text-muted-foreground"
        onClick={handleToggleBlock}
        disabled={loading}
      >
        {blocked ? (
          <>
            <ShieldCheck className="size-3.5" />
            Unblock
          </>
        ) : (
          <>
            <ShieldBan className="size-3.5" />
            Block
          </>
        )}
      </Button>
    </div>
  );
}
