'use client';

import { ClipboardList, FileText } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { createSessionNoteAction, getSessionNotesAction } from '@/app/actions/session-notes';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { NoteEditor } from './note-editor';

type Note = {
  id: string;
  authorId: string;
  type: 'PRE_SESSION' | 'POST_SESSION';
  content: string;
  createdAt: string;
  isOwn: boolean;
};

type Props = {
  sessionId: string;
  sessionEndTime: string;
  isCanceled: boolean;
};

export function SessionNotes({ sessionId, sessionEndTime, isCanceled }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMentee, setIsMentee] = useState(false);
  const [sessionEnded, setSessionEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newContent, setNewContent] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const loadNotes = useCallback(async () => {
    try {
      const result = await getSessionNotesAction(sessionId);
      if (result.success && result.data) {
        setNotes(result.data.notes as Note[]);
        setIsMentee(result.data.isMentee);
        setSessionEnded(result.data.sessionEnded);
      }
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  if (isCanceled || loading) return null;

  const preNotes = notes.filter((n) => n.type === 'PRE_SESSION');
  const postNotes = notes.filter((n) => n.type === 'POST_SESSION');
  const ended = sessionEnded || new Date(sessionEndTime) < new Date();

  // Determine which note type to create
  const canCreatePre = isMentee && !ended;
  const canCreatePost = ended;
  const noteType = canCreatePre ? 'PRE_SESSION' : canCreatePost ? 'POST_SESSION' : null;

  async function handleCreate() {
    if (!newContent.trim() || !noteType) return;
    setIsPending(true);
    try {
      const result = await createSessionNoteAction({
        sessionId,
        type: noteType,
        content: newContent.trim()
      });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Note saved');
      setNewContent('');
      setShowForm(false);
      loadNotes();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  const hasNotes = notes.length > 0;

  return (
    <div className="space-y-3">
      {/* Pre-session agenda */}
      {(preNotes.length > 0 || canCreatePre) && (
        <div className="rounded-md border border-border/60 bg-muted/20 p-3 dark:bg-zinc-900/30">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            <ClipboardList className="size-3.5" />
            Agenda
          </div>
          <div className="space-y-3">
            {preNotes.map((note) => (
              <NoteEditor key={note.id} note={note} onUpdate={loadNotes} />
            ))}
          </div>
          {canCreatePre && preNotes.length === 0 && !showForm && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[12px] text-muted-foreground"
              onClick={() => setShowForm(true)}
            >
              + Add agenda for this session
            </Button>
          )}
        </div>
      )}

      {/* Post-session notes */}
      {(postNotes.length > 0 || canCreatePost) && (
        <div className="rounded-md border border-border/60 bg-muted/20 p-3 dark:bg-zinc-900/30">
          <div className="mb-2 flex items-center gap-1.5 text-[12px] font-medium uppercase tracking-wider text-muted-foreground">
            <FileText className="size-3.5" />
            Notes
          </div>
          <div className="space-y-3">
            {postNotes.map((note) => (
              <NoteEditor key={note.id} note={note} onUpdate={loadNotes} />
            ))}
          </div>
          {canCreatePost && !showForm && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[12px] text-muted-foreground"
              onClick={() => setShowForm(true)}
            >
              + Add a note
            </Button>
          )}
        </div>
      )}

      {/* Empty state for upcoming sessions (non-mentee) */}
      {!hasNotes && !canCreatePre && !canCreatePost && (
        <p className="text-center text-[12px] text-muted-foreground">Notes will be available after the session.</p>
      )}

      {/* Inline creation form */}
      {showForm && noteType && (
        <div className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-3 dark:bg-zinc-900/30">
          <Textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={noteType === 'PRE_SESSION' ? 'What do you want to discuss?' : 'Key takeaways, reflections...'}
            maxLength={5000}
            rows={3}
            className="resize-none text-[13px]"
            autoFocus
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              className="h-7 text-[12px]"
              onClick={handleCreate}
              disabled={isPending || !newContent.trim()}
            >
              {isPending ? 'Saving...' : 'Save'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[12px]"
              onClick={() => {
                setShowForm(false);
                setNewContent('');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
