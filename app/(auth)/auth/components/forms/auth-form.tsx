'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormFields, authFormSchema } from './auth-form-schema';

import { FaSpinner } from 'react-icons/fa6';
import { signInWithOtp } from '@/app/(auth)/auth/actions';
import { useState } from 'react';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AuthFormFields>({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(authFormSchema)
  });

  return (
    <Form {...form}>
      <form className="space-y-2" onSubmit={() => setIsLoading(true)}>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input {...field} autoComplete="email" type="email" required />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Button className="mt-2 w-full gap-2" type="submit" formAction={signInWithOtp}>
            {isLoading && <FaSpinner className="animate-spin" size={16} />}
            Continue with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
