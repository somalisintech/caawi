'use client';

import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { deleteSessionNoteAction, updateSessionNoteAction } from '@/app/actions/session-notes';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  note: { id: string; content: string; createdAt: string; isOwn: boolean };
  onUpdate: () => void;
};

export function NoteEditor({ note, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(note.content);
  const [isPending, setIsPending] = useState(false);

  async function handleSave() {
    if (!content.trim()) return;
    setIsPending(true);
    try {
      const result = await updateSessionNoteAction({ noteId: note.id, content: content.trim() });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Note updated');
      setEditing(false);
      onUpdate();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  async function handleDelete() {
    setIsPending(true);
    try {
      const result = await deleteSessionNoteAction({ noteId: note.id });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success('Note deleted');
      onUpdate();
    } catch {
      toast.error('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  if (editing) {
    return (
      <div className="space-y-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={5000}
          rows={3}
          className="resize-none text-[13px]"
        />
        <div className="flex gap-2">
          <Button size="sm" className="h-7 text-[12px]" onClick={handleSave} disabled={isPending || !content.trim()}>
            {isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[12px]"
            onClick={() => {
              setContent(note.content);
              setEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group">
      <p className="whitespace-pre-wrap text-[13px] text-foreground">{note.content}</p>
      <div className="mt-1 flex items-center gap-3">
        <span className="text-[11px] text-muted-foreground">
          {new Date(note.createdAt).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </span>
        {note.isOwn && (
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-muted-foreground hover:text-foreground"
            >
              <Pencil className="size-3" />
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button type="button" disabled={isPending} className="text-muted-foreground hover:text-destructive">
                  <Trash2 className="size-3" />
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent size="sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete note?</AlertDialogTitle>
                  <AlertDialogDescription>This can&apos;t be undone.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel size="sm">Cancel</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" size="sm" onClick={handleDelete}>
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
}
