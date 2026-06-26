"use client";

import { authClient } from "@/lib/auth-client";
import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const UserData = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      ...UserData,
      callbackURL: "/",
    });

    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      toast.success("Successfully signed in !");
      router.push("/");
    }
  };

  const signIn = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 antialiased">
      <div className="w-full max-w-[440px] bg-content1 border border-default-200 dark:border-default-100 rounded-[2.5rem] shadow-xl p-6 sm:p-10 md:p-12 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8 select-none">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">
            Secure Portal
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground mt-4 mb-1.5">
            Welcome Back
          </h2>
          <p className="text-xs sm:text-sm text-foreground/50 font-medium">
            Enter your credentials to access your dashboard
          </p>
        </div>

        {/* Form */}
        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          {/* Email Field */}
          <TextField
            className="w-full group"
            isRequired
            name="email"
            type="email"
            validate={(value) => {
              if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                return "Enter a valid email address";
              }
              return null;
            }}
          >
            <Label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block transition-colors group-focus-within:text-cyan-500">
              Email Address
            </Label>
            <Input
              placeholder="name@example.com"
              className="font-medium"
              variant="flat"
              radius="xl"
              size="lg"
            />
            <FieldError className="text-xs font-semibold text-danger mt-1.5" />
          </TextField>

          {/* Password Field */}
          <TextField name="password" isRequired className="w-full group">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-xs font-bold uppercase tracking-widest text-foreground/60 transition-colors group-focus-within:text-cyan-500">
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-foreground/40 hover:text-foreground transition-colors"
              >
                Forgot?
              </Link>
            </div>
            <InputGroup>
              <InputGroup.Input
                type={isVisible ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                className="font-medium"
                variant="flat"
                radius="xl"
                size="lg"
              />
              <InputGroup.Suffix>
                <Button
                  isIconOnly
                  variant="light"
                  radius="full"
                  size="sm"
                  onPress={() => setIsVisible(!isVisible)}
                  className="text-foreground/40 hover:text-foreground transition-colors mr-1"
                >
                  {isVisible ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeSlash className="size-4" />
                  )}
                </Button>
              </InputGroup.Suffix>
            </InputGroup>
          </TextField>

          {/* Login Button */}
          <Button
            type="submit"
            className="w-full bg-foreground text-background font-bold h-12 rounded-xl shadow-md hover:opacity-95 active:scale-[0.99] transition-all mt-2 tracking-wide text-sm"
          >
            <Check className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Sign In
          </Button>

          {/* Divider */}
          <div className="flex items-center my-1 select-none">
            <div className="flex-grow border-t border-default-200/80 dark:border-default-100/30"></div>
            <span className="flex-shrink mx-4 text-foreground/30 font-extrabold text-[10px] tracking-[0.2em]">
              OR
            </span>
            <div className="flex-grow border-t border-default-200/80 dark:border-default-100/30"></div>
          </div>

          {/* Responsive Google Button */}
          <div className="flex justify-center w-full">
            <Button
              variant="bordered"
              className="w-full sm:w-2/3 h-11 border-default-200 dark:border-default-100/80 rounded-xl font-bold text-foreground bg-transparent hover:bg-default-100 dark:hover:bg-default-50 transition-all text-xs sm:text-sm"
              onClick={signIn}
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </Button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-foreground/40 font-medium mt-4">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-bold transition-colors underline-offset-4 hover:underline"
            >
              Create one
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default Login;
