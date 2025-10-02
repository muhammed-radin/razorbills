"use client";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { GoogleLogo } from "@/components/auth/google-logo";
import { signupSchema } from "@/schemas/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

const SignUp02Page = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center sm:bg-muted p-4 sm:p-0">
      <div className="max-w-sm w-full flex flex-col items-center sm:border rounded-lg px-6 py-8 sm:shadow-sm/5 sm:bg-card">
        <Logo className="h-9 w-9" />
        <p className="mt-4 text-xl font-semibold tracking-tight text-center">
          Sign up for Shadcn UI Blocks
        </p>

        <Button className="mt-8 w-full gap-3" variant="outline">
          <GoogleLogo />
          <span className="truncate">Continue with Google</span>
        </Button>

        <div className="my-7 w-full flex items-center justify-center overflow-hidden">
          <Separator className="flex-1" />
          <span className="text-sm px-3 whitespace-nowrap">OR</span>
          <Separator className="flex-1" />
        </div>

        <Form {...form}>
          <form className="w-full space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Password" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <Button type="submit" className="mt-4 w-full">
              Continue with Email
            </Button>
          </form>
        </Form>

        <p className="mt-5 text-sm text-center">
          Already have an account?
          <Link href="#" className="ml-1 underline text-muted-foreground">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp02Page;
