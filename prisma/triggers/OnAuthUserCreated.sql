CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  p_id uuid;
BEGIN
  INSERT INTO public."Profile"
  DEFAULT VALUES
  RETURNING "id" into p_id;

  INSERT INTO public."User" ("id", "email", "firstName", "lastName", "image", "profileId")
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'first_name', NEW.raw_user_meta_data ->> 'last_name', NEW.raw_user_meta_data ->> 'image', p_id);
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user();