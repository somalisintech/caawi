CREATE OR REPLACE FUNCTION public.handle_delete_public_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM auth.users WHERE id = OLD.id;
  RETURN OLD;
END;
$$;

CREATE OR REPLACE TRIGGER on_public_user_deleted
AFTER DELETE ON public."User"
FOR EACH ROW
EXECUTE PROCEDURE public.handle_delete_public_user();