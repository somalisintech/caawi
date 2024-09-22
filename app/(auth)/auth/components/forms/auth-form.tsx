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
import { toast } from '@/components/ui/use-toast';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<AuthFormFields>({
    defaultValues: {
      email: ''
    },
    resolver: zodResolver(authFormSchema)
  });

  const handleSubmit = async (data: AuthFormFields) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('email', data.email);
      await signInWithOtp(formData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
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
          <Button className="mt-2 w-full gap-2" type="submit" disabled={isLoading}>
            {isLoading && <FaSpinner className="animate-spin" size={16} />}
            Continue with email
          </Button>
        </div>
      </form>
    </Form>
  );
}
