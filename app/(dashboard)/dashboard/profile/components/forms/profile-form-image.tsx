import { Loader2 } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { UserWithProfile } from '@/types/user';
import { createClient } from '@/utils/supabase/client';

type Props = {
  user: UserWithProfile;
};

export function ProfileFormImage({ user }: Props) {
  const [loading, setLoading] = useState(false);
  const [localImage, setLocalImage] = useState(user.image || '');

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarFallback = user.firstName?.[0] ?? '-';

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      try {
        setLoading(true);
        const image = event.target.files[0];

        const { data, error } = await supabase.storage.from('avatar').upload(`${user.id}/avatar.png`, image, {
          upsert: true
        });

        if (error) {
          throw Error(error.message);
        }

        if (data) {
          const { data: imageData } = supabase.storage.from('avatar').getPublicUrl(data.path);

          const imageUrl = `${imageData.publicUrl}?updated=${Date.now()}`;

          const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ image: imageUrl })
          });
          if (!response.ok) {
            throw Error('Failed to upload image');
          }
          setLocalImage(imageUrl);
        }
      } catch (err) {
        console.error({ error: err });
        toast.error('Failed to upload image');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return <Loader2 className="animate-spin" size={18} />;
  }

  return (
    <div className="relative">
      <input ref={fileInputRef} type="file" className="sr-only" onChange={handleChange} accept="image/*" />
      <button type="button" onClick={handleClick} className="flex items-center gap-2">
        <Avatar className="size-5">
          <AvatarImage src={localImage} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>Edit</div>
      </button>
    </div>
  );
}
