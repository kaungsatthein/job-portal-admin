"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useLogin } from "@/api-config/queries/auth";
import type { LoginPayload } from "@/api-config/services/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { mutateAsync: login, isPending, error } = useLogin();
  const methods = useForm<LoginPayload>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<LoginPayload> = async (data) => {
    try {
      const res = await login(data);
      console.log("res :>> ", res);
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const loginErrorMessage = (() => {
    if (!error) return null;
    return error.response?.data?.message ?? error.message ?? "Unable to login.";
  })();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                  />
                  <FieldError
                    errors={errors.email ? [errors.email] : undefined}
                  />
                </Field>
                <Field>
                  <div className="flex items-center">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="password"
                    aria-invalid={!!errors.password}
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters",
                      },
                    })}
                  />
                  <FieldError
                    errors={errors.password ? [errors.password] : undefined}
                  />
                </Field>
                <Field>
                  <Button type="submit" disabled={isPending} className="w-full">
                    {isPending ? "Logging in..." : "Login"}
                  </Button>
                  {loginErrorMessage && (
                    <p
                      role="alert"
                      className="text-destructive mt-2 text-sm font-normal"
                    >
                      {loginErrorMessage}
                    </p>
                  )}
                </Field>
              </FieldGroup>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
