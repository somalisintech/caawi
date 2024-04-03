CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  u_id uuid;
  first_name text;
  last_name text;
  image_url text;
BEGIN
  IF NEW.raw_user_meta_data ? 'name' THEN
    first_name := split_part(NEW.raw_user_meta_data ->> 'name', ' ', 1);
    last_name := split_part(NEW.raw_user_meta_data ->> 'name', ' ', 2);
  ELSE
    first_name := NULL;
    last_name := NULL;
  END IF;

  IF NEW.raw_user_meta_data ? 'avatar_url' THEN
    image_url := NEW.raw_user_meta_data ->> 'avatar_url';
  ELSE
    IF NEW.raw_user_meta_data ? 'picture' THEN
      image_url := NEW.raw_user_meta_data ->> 'picture';
    ELSE
      image_url := NULL;
    END IF;
  END IF;

  INSERT INTO public."User" ("id", "email", "firstName", "lastName", "image")
  VALUES (NEW.id, NEW.email, first_name, last_name, image_url)
  RETURNING "id" into "u_id";

  INSERT INTO public."Profile" ("userId")
  VALUES (u_id);
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();