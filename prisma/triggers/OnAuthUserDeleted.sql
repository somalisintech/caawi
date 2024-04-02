CREATE OR REPLACE FUNCTION public.handle_delete_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  DELETE FROM public."User" WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_deleted
AFTER DELETE ON auth.users
FOR EACH ROW
EXECUTE PROCEDURE public.handle_delete_user();