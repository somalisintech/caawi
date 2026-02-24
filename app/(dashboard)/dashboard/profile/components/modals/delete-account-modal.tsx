import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';

export function DeleteAccountModal() {
  const router = useRouter();

  const handleClick = async () => {
    try {
      const response = await fetch('/api/users', {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw Error('Failed to delete user');
      }
      router.refresh();
    } catch (err) {
      console.log(err);
      toast.error('Failed to delete user');
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete your account</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </p>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="button" variant="destructive" onClick={handleClick}>
            Delete account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
