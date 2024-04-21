'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormFields, authFormSchema } from './auth-form-schema';

import { FaSpinner } from 'react-icons/fa6';
import { createClient } from '@/utils/supabase/client';
import { getUrl } from '@/utils/url';

type Props = {
  redirectUrl?: string;
};

export function AuthForm({ redirectUrl = `${getUrl()}/dashboard` }: Props) {
  const supabase = createClient();

  const form = useForm<AuthFormFields>({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(authFormSchema)
  });

  const onSubmit: SubmitHandler<AuthFormFields> = async (data) => {
    supabase.auth.signInWithOtp({
      email: data.email,
      options: {
        emailRedirectTo: `${getUrl()}/api/auth/callback?redirectUrl=${redirectUrl}`
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button className="mt-2 w-full gap-2" type="submit">
            {form.formState.isSubmitting && <FaSpinner className="animate-spin" size={16} />}
            Continue with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
