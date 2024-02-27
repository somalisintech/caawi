'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormFields, registerFormSchema } from './register-form-schema';

import { FaSpinner } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormFields>({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(registerFormSchema)
  });

  const onSubmit: SubmitHandler<RegisterFormFields> = async (data) => {
    const registrationResponse = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!registrationResponse?.ok) {
      form.setError('root', { message: 'Error regestering' });
      return;
    }

    const response = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect: false
    });

    if (response?.error) {
      form.setError('root', { message: response.error });
      return;
    }

    router.push('/dashboard');
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
            Register with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
