import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserWithProfile } from '@/types/user';
import { createClient } from '@/utils/supabase/client';
import { ChangeEvent, useRef, useState } from 'react';

type Props = {
  user: UserWithProfile;
};

export function ProfileFormImage({ user }: Props) {
  const [localImage, setLocalImage] = useState(user.image);

  const supabase = createClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarImage = localImage;
  const avatarFallback = user.firstName?.[0] ?? '-';

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      try {
        const image = event.target.files[0];

        const { data, error } = await supabase.storage.from('avatar').upload(`${user.id}/avatar.png`, image, {
          upsert: true
        });

        if (error) {
          throw Error(error.message);
        }

        if (data) {
          const { data: imageData } = supabase.storage.from('avatar').getPublicUrl(data.path);

          const imageUrl = `${imageData.publicUrl}?updated=${new Date().getTime()}`;

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
        console.log(err);
      }
    }
  };

  return (
    <div className="relative">
      <input ref={fileInputRef} type="file" className="sr-only" onChange={handleChange} accept="image/*" />
      <div role="button" onClick={handleClick} className="flex items-center gap-2">
        <Avatar className="size-5">
          <AvatarImage src={`${avatarImage}?date=${new Date().getTime()}`} />
          <AvatarFallback>{avatarFallback}</AvatarFallback>
        </Avatar>
        <div>Edit</div>
      </div>
    </div>
  );
}
