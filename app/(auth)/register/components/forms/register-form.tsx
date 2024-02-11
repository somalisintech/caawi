'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterFormValidation, registerFormSchema } from './register-form-schema';

import { FaSpinner } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { UserType } from '@prisma/client';

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValidation>({
    defaultValues: {
      userType: UserType.MENTEE,
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: ''
    },
    resolver: zodResolver(registerFormSchema)
  });

  const onSubmit: SubmitHandler<RegisterFormValidation> = async (data) => {
    // TODO: Is there anyway to expose a signUp method from next auth?
    const signInResponse = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!signInResponse?.ok) {
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
          name="userType"
          render={({ field }) => (
            <FormItem className="mb-4 space-y-2">
              <FormControl>
                <div className="flex gap-2 rounded-md bg-zinc-100 p-1.5 dark:bg-zinc-900">
                  <Button
                    onClick={() => field.onChange(UserType.MENTEE)}
                    type="button"
                    size="sm"
                    className="flex-1 rounded-sm"
                    variant={field.value === UserType.MENTEE ? 'default' : 'ghost'}
                  >
                    Mentee
                  </Button>
                  <Button
                    onClick={() => field.onChange(UserType.MENTOR)}
                    type="button"
                    size="sm"
                    className="flex-1 rounded-sm"
                    variant={field.value === UserType.MENTOR ? 'default' : 'ghost'}
                  >
                    Mentor
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
              <FormDescription>
                {field.value === 'MENTEE'
                  ? `Dive into your growth journey! Sign up as a mentee and discover the ideal mentor for your path
                    ahead.`
                  : `Share your experience! Register as a mentor and support individuals keen on advancing their journey.`}
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="flex w-full max-w-sm items-center space-x-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">First Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Last Name</FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Email address</FormLabel>
              <FormControl>
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" autoComplete="new-password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button className="mt-3 w-full gap-2" type="submit">
            {form.formState.isSubmitting && <FaSpinner className="animate-spin" size={16} />}
            Register
          </Button>
        </div>
      </form>
    </Form>
  );
}
