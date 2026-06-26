"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff, LogIn, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  TextField,
} from "@heroui/react";
import "animate.css";

const Login = () => {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const UserData = Object.fromEntries(formData.entries());

    const { data, error } = await authClient.signIn.email({
      ...UserData,
      callbackURL: "/",
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Login failed: " + error.message);
    } else {
      toast.success("Successfully signed in!");
      router.push("/");
    }
  };

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    // 🟢 Soft Dark Background
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50! dark:bg-gray-900! px-4 sm:px-6 lg:px-8 antialiased overflow-hidden transition-colors duration-500 py-12">
      
      {/* 🟢 Premium Glassmorphism Card */}
      <div className="w-full max-w-[440px] bg-white/90 dark:bg-gray-800/90 backdrop-blur-2xl border border-gray-100 dark:border-gray-700 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] p-8 sm:p-10 md:p-12 transition-all duration-300 animate__animated animate__zoomIn animate__faster">
        
        {/* Header Section */}
        <div className="text-center mb-8 select-none animate__animated animate__fadeInDown" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.2em] font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1.5 rounded-full mb-5 shadow-sm animate__animated animate__pulse animate__infinite">
            <ShieldCheck size={14} />
            Secure Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-900 dark:text-white mt-2 mb-2 leading-tight">
            Welcome Back
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <Form className="flex flex-col gap-6" onSubmit={onSubmit}>
          
          {/* Email Field */}
          <div className="w-full animate__animated animate__fadeInUp" style={{ animationDelay: '0.2s' }}>
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
              <Label className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 block transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                Email Address
              </Label>
              <Input
                placeholder="name@example.com"
                className="font-bold text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner"
                variant="flat"
                radius="xl"
                size="lg"
                classNames={{
                    inputWrapper: "bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:!bg-white dark:focus-within:!bg-gray-900 focus-within:!border-blue-500 dark:focus-within:!border-blue-400 transition-all",
                }}
              />
              <FieldError className="text-xs font-bold text-red-500 mt-1.5" />
            </TextField>
          </div>

          {/* Password Field */}
          <div className="w-full animate__animated animate__fadeInUp" style={{ animationDelay: '0.3s' }}>
            <TextField name="password" isRequired className="w-full group">
              <div className="flex justify-between items-center mb-2">
                <Label className="text-[11px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 transition-colors group-focus-within:text-blue-600 dark:group-focus-within:text-blue-400">
                  Password
                </Label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <InputGroup>
                <InputGroup.Input
                  type={isVisible ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="font-bold text-gray-900 dark:text-white tracking-widest placeholder:tracking-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 shadow-inner"
                  variant="flat"
                  radius="xl"
                  size="lg"
                  classNames={{
                    inputWrapper: "bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 focus-within:!bg-white dark:focus-within:!bg-gray-900 focus-within:!border-blue-500 dark:focus-within:!border-blue-400 transition-all",
                  }}
                />
                <InputGroup.Suffix>
                  {/* 🟢 Premium Toggle Button */}
                  <Button
                    isIconOnly
                    variant="light"
                    radius="full"
                    size="sm"
                    onPress={() => setIsVisible(!isVisible)}
                    className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all duration-300 mr-1 cursor-pointer"
                  >
                    {isVisible ? (
                      <Eye className="w-4 h-4 animate__animated animate__fadeIn" />
                    ) : (
                      <EyeOff className="w-4 h-4 animate__animated animate__fadeIn" />
                    )}
                  </Button>
                </InputGroup.Suffix>
              </InputGroup>
            </TextField>
          </div>

          {/* Submit Button */}
          <div className="animate__animated animate__fadeInUp w-full mt-2" style={{ animationDelay: '0.4s' }}>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-black h-14 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-70 disabled:shadow-none active:scale-[0.98] transition-all tracking-wide text-base group cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5 group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Sign In
                </>
              )}
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center my-1 select-none animate__animated animate__fadeIn" style={{ animationDelay: '0.5s' }}>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
            <span className="flex-shrink mx-4 text-gray-400 dark:text-gray-500 font-black text-[10px] tracking-[0.2em]">
              OR
            </span>
            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          {/* Google Button */}
          <div className="flex justify-center w-full animate__animated animate__fadeInUp" style={{ animationDelay: '0.6s' }}>
            <Button
              variant="bordered"
              className="w-full h-14 border border-gray-200 dark:border-gray-700 rounded-2xl font-black text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all text-sm group cursor-pointer shadow-sm flex items-center justify-center gap-3"
              onClick={signIn}
            >
              <FcGoogle className="text-xl group-hover:scale-110 transition-transform duration-300" />
              Continue with Google
              <ArrowRight className="w-4 h-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
            </Button>
          </div>

          {/* Footer Link */}
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 font-bold mt-2 animate__animated animate__fadeInUp" style={{ animationDelay: '0.7s' }}>
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-black transition-colors underline-offset-4 hover:underline"
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