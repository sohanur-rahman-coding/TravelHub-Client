"use client";

import { Check, Eye, EyeSlash } from "@gravity-ui/icons";
import {
  Button,
  FieldError,
  Form,
  Input,
  InputGroup,
  Label,
  Select,
  ListBox,
  TextField,
} from "@heroui/react";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const UserData = Object.fromEntries(formData.entries());

    const password = UserData.password;
    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      toast.error("Invalid password criteria");
      return;
    }

    const { data, error } = await authClient.signUp.email({
      ...UserData,
      plan: "free",
    });

    if (error) {
      toast.error("Registration failed: " + error.message);
    } else {
      toast.success("Successfully registered!");
      router.push("/");
    }
  };

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  return (
    <div className="min-h-screen w-full my-4 flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8 antialiased animate__animated animate__fadeIn">
      <div className="w-full max-w-[460px] bg-content1 border border-default-200 dark:border-default-100 rounded-[2.5rem] shadow-xl p-6 sm:p-10 transition-all duration-300">
        <div className="text-center mb-4 select-none">
          <span className="text-[10px] uppercase tracking-[0.2em] font-extrabold text-cyan-500 bg-cyan-500/10 px-3 py-1 rounded-full">
            Join Platform
          </span>
          <h2 className="text-3xl font-black tracking-tight text-foreground mt-4 mb-1.5">
            Create Account
          </h2>
          <p className="text-xs sm:text-sm text-foreground/50 font-medium">
            Sign up to get started with TravelHub and explore amazing travel experiences!
          </p>
        </div>

        <Form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <TextField
            className="w-full group"
            isRequired
            name="name"
            validate={(value) => {
              if (value.length < 3) return "Name must be at least 3 characters";
              return null;
            }}
          >
            <Label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block transition-colors group-focus-within:text-cyan-500">
              Full Name
            </Label>
            <Input
              placeholder="Your Name"
              className="font-medium"
              variant="flat"
              radius="xl"
              size="lg"
            />
            <FieldError className="text-xs font-semibold text-danger mt-1.5" />
          </TextField>

          <TextField
            className="w-full group"
            isRequired
            name="image"
            validate={(value) => {
              if (value.length < 3) return "Link must be a valid URL";
              return null;
            }}
          >
            <Label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block transition-colors group-focus-within:text-cyan-500">
              Profile Photo Link
            </Label>
            <Input
              placeholder="https://example.com/dp.jpg"
              className="font-medium"
              variant="flat"
              radius="xl"
              size="lg"
            />
            <FieldError className="text-xs font-semibold text-danger mt-1.5" />
          </TextField>

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

          <TextField
            name="password"
            isRequired
            className="w-full group"
            validate={(value) => {
              if (value.length < 6)
                return "Length must be at least 6 characters";
              if (!/[A-Z]/.test(value)) return "Must have an Uppercase letter";
              if (!/[a-z]/.test(value)) return "Must have a Lowercase letter";
              return null;
            }}
          >
            <Label className="text-xs font-bold uppercase tracking-widest text-foreground/60 mb-2 block transition-colors group-focus-within:text-cyan-500">
              Password
            </Label>
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
            <FieldError className="text-xs font-semibold text-danger mt-1.5" />
          </TextField>
          <Select isRequired name="role" placeholder="Select one">
            <Label>Signup As</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                <ListBox.Item id="buyer" textValue="buyer">
                  User
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="seller" textValue="seller">
                  Vendor 
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          <Button
            type="submit"
            className="w-full bg-foreground text-background font-bold h-12 rounded-xl shadow-md hover:opacity-95 active:scale-[0.99] transition-all mt-2 tracking-wide text-sm"
          >
            <Check className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Register
          </Button>

          <div className="flex items-center select-none">
            <div className="flex-grow border-t border-default-200/80 dark:border-default-100/30"></div>
            <span className="flex-shrink mx-4 text-foreground/30 font-extrabold text-[10px] tracking-[0.2em]">
              OR
            </span>
            <div className="flex-grow border-t border-default-200/80 dark:border-default-100/30"></div>
          </div>

          <div className="flex justify-center w-full">
            <Button
              type="button"
              variant="bordered"
              className="w-full sm:w-2/3 h-11 border-default-200 dark:border-default-100/80 rounded-xl font-bold text-foreground bg-transparent hover:bg-default-100 dark:hover:bg-default-50 transition-all text-xs sm:text-sm"
              onClick={signIn}
            >
              <FcGoogle className="text-lg" />
              Continue with Google
            </Button>
          </div>

          <p className="text-center text-sm text-foreground/40 font-medium ">
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-cyan-500 hover:text-cyan-600 dark:text-cyan-400 dark:hover:text-cyan-300 font-bold transition-colors underline-offset-4 hover:underline"
            >
              Login
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
