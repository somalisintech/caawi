'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub, FaGoogle, FaSpinner, FaTwitter } from 'react-icons/fa6';
import { toast } from '@/components/ui/use-toast';
import { useEffect } from 'react';
import { CaawiLogo } from '@/components/CaawiLogo';
import { redirect } from 'next/navigation';

export default function Login() {
  const { status } = useSession();
  const formValidationSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, { message: 'Password is required' })
  });

  type FormValidation = z.infer<typeof formValidationSchema>;

  const form = useForm<FormValidation>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(formValidationSchema)
  });

  const onSubmit: SubmitHandler<FormValidation> = async (data) => {
    const signInResponse = await signIn('credentials', { ...data, redirect: false });
    if (signInResponse?.error) {
      toast({ title: 'Login', description: signInResponse.error });
      return;
    }
    if (signInResponse?.ok) {
      toast({ title: `Welcome back 👋🏾` });
    }
  };

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        email: '',
        password: ''
      });
    }
  }, [form, form.formState, form.reset]);

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    redirect('/');
  }

  return (
    <div className="flex min-h-full">
      <CaawiLogo />
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700">Email address</FormLabel>
                      <FormControl>
                        <Input {...field} type={'email'} autoFocus />
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
                      <FormLabel className="block text-sm font-medium text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input {...field} type={'password'} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <Button className="mt-3 w-full" type="submit">
                    {form.formState.isSubmitting ? <FaSpinner className="animate-spin" size={'1.5em'} /> : 'Sign in'}
                  </Button>
                </div>
              </form>
            </Form>
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <p className="my-2 text-sm font-medium text-gray-700">Sign in with</p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <Button
                className="text-gray-500 hover:text-gray-500"
                variant="outline"
                title="Sign in with Google"
                onClick={() =>
                  signIn('google', {
                    redirect: false
                  })
                }
              >
                <FaGoogle size={'1.5em'} />
              </Button>

              <Button
                className="text-gray-500 hover:text-gray-500"
                variant="outline"
                title="Sign in with Twitter"
                onClick={() =>
                  signIn('twitter', {
                    redirect: false
                  })
                }
              >
                <FaTwitter size={'1.5em'} />
              </Button>

              <Button
                className="text-gray-500 hover:text-gray-500"
                variant="outline"
                title="Sign in with GitHub"
                onClick={() =>
                  signIn('github', {
                    redirect: false
                  })
                }
              >
                <FaGithub size={'1.5em'} />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1556711905-b3f402e1ff80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2970&q=80"
          alt="sign in"
          fill={true}
          priority
        />
        <div className="bg-yellow-400/20"></div>
      </div>
    </div>
  );
}
