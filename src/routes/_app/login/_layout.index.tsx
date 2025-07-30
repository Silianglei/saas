import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Input } from "@/ui/input";
import { Button } from "@/ui/button";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useEffect, useState } from "react";
import { Route as OnboardingUsernameRoute } from "@/routes/_app/_auth/onboarding/_layout.username";
import { Route as DashboardRoute } from "@/routes/_app/_auth/dashboard/_layout.index";
import { useQuery } from "@tanstack/react-query";
import { convexQuery, useConvexAuth } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";

export const Route = createFileRoute("/_app/login/_layout/")({
  component: Login,
});

function Login() {
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { data: user } = useQuery(convexQuery(api.app.getCurrentUser, {}));
  const navigate = useNavigate();
  useEffect(() => {
    if ((isLoading && !isAuthenticated) || !user) {
      return;
    }
    if (!isLoading && isAuthenticated && !user.username) {
      navigate({ to: OnboardingUsernameRoute.fullPath });
      return;
    }
    if (!isLoading && isAuthenticated) {
      navigate({ to: DashboardRoute.fullPath });
      return;
    }
  }, [user]);

  if (step === "signIn") {
    return <LoginForm onSubmit={(email) => setStep({ email })} />;
  }
  return <VerifyForm email={step.email} />;
}

function LoginForm({ onSubmit }: { onSubmit: (email: string) => void }) {
  const { signIn } = useAuthActions();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      await signIn("resend-otp", value);
      onSubmit(value.email);
      setIsSubmitting(false);
    },
  });
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <h3 className="text-center text-2xl font-medium text-primary">
          Continue to Convex SaaS
        </h3>
        <p className="text-center text-base font-normal text-primary/60">
          Welcome back! Please log in to continue.
        </p>
      </div>
      <form
        className="flex w-full flex-col items-start gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="email" className="sr-only">
            Email
          </label>
          <form.Field
            name="email"
            validators={{
              onSubmit: z
                .string()
                .max(256)
                .email("Email address is not valid."),
            }}
            children={(field) => (
              <Input
                placeholder="Email"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                className={`bg-transparent ${
                  field.state.meta?.errors.length > 0 &&
                  "border-destructive focus-visible:ring-destructive"
                }`}
              />
            )}
          />
        </div>

        <div className="flex flex-col">
          {form.state.fieldMeta.email?.errors.length > 0 && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {form.state.fieldMeta.email?.errors.join(" ")}
            </span>
          )}
          {/*
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
          */}
        </div>

        <Button type="submit" className="w-full">
          {isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            "Continue with Email"
          )}
        </Button>
      </form>

      <p className="px-12 text-center text-sm font-normal leading-normal text-primary/60">
        By clicking continue, you agree to our{" "}
        <a className="underline hover:text-primary">Terms of Service</a> and{" "}
        <a className="underline hover:text-primary">Privacy Policy.</a>
      </p>
    </div>
  );
}

function VerifyForm({ email }: { email: string }) {
  const { signIn } = useAuthActions();
  const form = useForm({
    validatorAdapter: zodValidator(),
    defaultValues: {
      code: "",
    },
    onSubmit: async ({ value }) => {
      await signIn("resend-otp", { email, code: value.code });
    },
  });
  return (
    <div className="mx-auto flex h-full w-full max-w-96 flex-col items-center justify-center gap-6">
      <div className="mb-2 flex flex-col gap-2">
        <p className="text-center text-2xl text-primary">Check your inbox!</p>
        <p className="text-center text-base font-normal text-primary/60">
          We've just emailed you a temporary password.
          <br />
          Please enter it below.
        </p>
      </div>
      <form
        className="flex w-full flex-col items-start gap-1"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="flex w-full flex-col gap-1.5">
          <label htmlFor="code" className="sr-only">
            Code
          </label>
          <form.Field
            name="code"
            validators={{
              onSubmit: z
                .string()
                .min(8, "Code must be at least 8 characters."),
            }}
            children={(field) => {
              return (
                <Input
                  placeholder="Code"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  className={`bg-transparent ${
                    field.state.meta?.errors.length > 0 &&
                    "border-destructive focus-visible:ring-destructive"
                  }`}
                />
              );
            }}
          />
        </div>

        <div className="flex flex-col">
          {form.state.fieldMeta.code?.errors.length > 0 && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {form.state.fieldMeta.code?.errors.join(" ")}
            </span>
          )}
          {/*
          {!authEmail && authError && (
            <span className="mb-2 text-sm text-destructive dark:text-destructive-foreground">
              {authError.message}
            </span>
          )}
          */}
        </div>

        <Button type="submit" className="w-full">
          Continue
        </Button>
      </form>

      {/* Request New Code. */}
      <div className="flex w-full flex-col">
        <p className="text-center text-sm font-normal text-primary/60">
          Did not receive the code?
        </p>
        <Button
          onClick={() => signIn("resend-otp", { email })}
          variant="ghost"
          className="w-full hover:bg-transparent"
        >
          Request New Code
        </Button>
      </div>
    </div>
  );
}
