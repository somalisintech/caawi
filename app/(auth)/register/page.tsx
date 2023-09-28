'use client';

import { signIn, useSession } from 'next-auth/react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { FaGithub, FaGoogle, FaLinkedin, FaSpinner, FaTwitter } from 'react-icons/fa6';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { $Enums } from '.prisma/client';
import UserType = $Enums.UserType;
import { CaawiLogo } from '@/components/CaawiLogo';

export default function Register() {
  const { status } = useSession();
  const [userType, setUserType] = useState<UserType>(UserType.MENTEE);

  const formValidationSchema = z
    .object({
      firstName: z.string().min(1, { message: 'First Name is required' }),
      lastName: z.string().min(1, { message: 'Last Name is required' }),
      email: z.string().min(1, { message: 'Email is required' }).email(),
      password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
      confirm: z.string()
    })
    .refine(({ password, confirm }) => password === confirm, {
      message: "Passwords don't match",
      path: ['confirm']
    });

  type FormValidation = z.infer<typeof formValidationSchema>;

  const form = useForm<FormValidation>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirm: ''
    },
    resolver: zodResolver(formValidationSchema)
  });

  const onSubmit: SubmitHandler<FormValidation> = async (fields) =>
    fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        ...fields,
        userType
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error registering');
        }
        return response.json();
      })
      .then(({ firstName }) => {
        toast({ title: `🎉 Thanks for registering ${firstName}!` });
        signIn('credentials', {
          email: fields.email,
          password: fields.password,
          redirect: false
        });
      })
      .catch(() => toast({ title: '😭 Something went wrong!' }));

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.hash === '#mentor-registration-form') {
      setUserType(UserType.MENTOR);
    }
  }, []);

  useEffect(() => {
    if (form.formState.isSubmitSuccessful) {
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirm: ''
      });
    }
  }, [form, form.formState, form.reset]);

  if (status === 'loading') {
    return null;
  }

  if (status === 'authenticated') {
    redirect('/profile');
  }

  return (
    <div className="flex min-h-full">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <CaawiLogo />
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Register for an account</h2>
          <div className="mt-8">
            <Tabs
              defaultValue={userType}
              className="w-full"
              onValueChange={(value) => {
                setUserType(value as UserType);
              }}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value={UserType.MENTEE}>Mentee</TabsTrigger>
                <TabsTrigger value={UserType.MENTOR} id="mentor-registration-form">
                  Mentor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="MENTEE">
                <p className="my-5 font-normal text-gray-600">
                  Dive into your growth journey! Sign up as a <span className="font-semibold">mentee</span> and discover
                  the ideal mentor for your path ahead.
                </p>
                <Form {...form}>
                  <form id="mentee-registration-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">First Name</FormLabel>
                            <FormControl>
                              <Input {...field} type={'text'} />
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
                            <FormLabel className="block text-sm font-medium text-gray-700">Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} type={'text'} />
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
                          <FormLabel className="block text-sm font-medium text-gray-700">Email address</FormLabel>
                          <FormControl>
                            <Input {...field} type={'email'} />
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
                    <FormField
                      control={form.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} type={'password'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Button className="mt-3 w-full" type="submit">
                        {form.formState.isSubmitting ? (
                          <FaSpinner className="animate-spin" size={'1.5em'} />
                        ) : (
                          'Register'
                        )}
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
                <div className="mt-6 grid grid-cols-4 gap-3">
                  <Button
                    className="text-gray-500 hover:text-gray-500"
                    variant="outline"
                    title="Sign in with Google"
                    onClick={() =>
                      signIn('google', {
                        redirect: false,
                        callbackUrl: '/profile'
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
                        redirect: false,
                        callbackUrl: '/profile'
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
                        redirect: false,
                        callbackUrl: '/profile'
                      })
                    }
                  >
                    <FaGithub size={'1.5em'} />
                  </Button>
                  <Button
                    className="text-gray-500 hover:text-gray-500"
                    variant="outline"
                    title="Sign in with LinkedIn"
                    onClick={() =>
                      signIn('linkedin', {
                        redirect: false,
                        callbackUrl: '/profile'
                      })
                    }
                  >
                    <FaLinkedin size={'1.5em'} />
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="MENTOR">
                <p className="my-5 font-normal text-gray-600">
                  Share your experience! Register as a <span className="font-semibold">mentor</span> and support
                  individuals keen on advancing their journey.
                </p>
                <Form {...form}>
                  <form id="mentor-registration-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                    <div className="flex w-full max-w-sm items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="block text-sm font-medium text-gray-700">First Name</FormLabel>
                            <FormControl>
                              <Input {...field} type={'text'} />
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
                            <FormLabel className="block text-sm font-medium text-gray-700">Last Name</FormLabel>
                            <FormControl>
                              <Input {...field} type={'text'} />
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
                          <FormLabel className="block text-sm font-medium text-gray-700">Email address</FormLabel>
                          <FormControl>
                            <Input {...field} type={'email'} />
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
                    <FormField
                      control={form.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="block text-sm font-medium text-gray-700">Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} type={'password'} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div>
                      <Button className="mt-3 w-full" type="submit">
                        {form.formState.isSubmitting ? (
                          <FaSpinner className="animate-spin" size={'1.5em'} />
                        ) : (
                          'Register'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </div>
          <p className="mt-6 text-center text-sm leading-6 text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-gray-600 hover:text-gray-500">
              Sign in here.
            </Link>
          </p>
        </div>
      </div>
      <div className="relative hidden w-0 flex-1 lg:block">
        <Image
          className="absolute inset-0 h-full w-full object-cover"
          title={`Photo by  ${userType === UserType.MENTEE ? 'Prateek Katyal' : 'Nathon Lemon'} via Unsplash`}
          src={`${userType === UserType.MENTEE ? '/mentee-bg-image.jpg' : '/mentor-bg-image.jpg'}`}
          alt=""
          fill={true}
          priority
        />
      </div>
    </div>
  );
}
