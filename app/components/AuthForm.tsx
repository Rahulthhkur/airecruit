"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
} from "@/components/ui/form";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import FormField from "./FormField";
import { useRouter } from "next/navigation";


type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (type: FormType)=>{
    return z.object({
        name: type === 'sign-up' ? z.string().min(3, { message: "Name must be at least 3 characters." }) : z.string().optional(),
        email: z.string().email({ message: "Please enter a valid email address." }),
        password: z.string().min(3, { message: "Password must be at least 3 characters." }),
    })
}

const AuthForm = ({type}: {type: FormType}) => {

  const router = useRouter();
  const isSignIn = type === 'sign-in';
  const title = isSignIn ? 'Sign In' : 'Create Account';
  const promptMessage = isSignIn ? 'No Account Yet?' : 'Have an account Already?';
  const linkText = isSignIn ? 'Sign up' : 'Sign In';
  const linkHref = isSignIn ? '/sign-up' : '/sign-in';
  const submitButtonText = isSignIn ? 'Sign In' : 'Create an Account';

  // 1. Define your form.
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        // Simulate API call for demonstration purposes
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if(type === 'sign-up'){
            toast.success('Account Created Successfully, Please Sign In.');
            router.push('/sign-in');
        }
        else{
          toast.success('Sign In Successfully!');
          router.push('/');

        }
    } catch (error: any) {
        console.error(error);
        toast.error(`Authentication failed: ${error?.message || 'Something went wrong.'}`)

    }
  }


  return (
    <div className="card-border lg:min-w-[450px] w-full max-w-md mx-auto">
      <div className="flex flex-col gap-8 card py-12 px-8 sm:px-10">
        <div className="flex flex-row gap-3 justify-center items-center">
          <Image src="/logo.svg" alt="NeuroRecurit logo" height={32} width={38} />
          <h2 className="text-xl font-semibold text-primary-100 tracking-tight">NeuroRecruit</h2>
        </div>

        <div className="text-center">
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="text-muted-foreground text-sm mt-1">Practice Job interviews with AI</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">

            {!isSignIn && (
              <FormField
              control={form.control}
              name="name"
              label="Name"
              placeholder="Your Name"
              />
            )}
             <FormField
              control={form.control}
              name="email"
              label="Email"
              placeholder="Your email address"
              type="email"
              />
             <FormField
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              type="password"
              />


            <Button className="w-full" type="submit">{submitButtonText}</Button>
          </form>
        </Form>
        <div className="text-center text-sm text-muted-foreground">
            {promptMessage}
            <Link href={linkHref} className="font-semibold text-user-primary ml-1 hover:underline" > {linkText} </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;