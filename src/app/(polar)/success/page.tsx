import Link from "next/link";
import { CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { requireAuth } from "@/lib/auth-utils";
import { buttonVariants } from "@/components/ui/button";

const Page = async () => {
  await requireAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-950">
          <CheckCircle2 className="size-10 text-green-600 dark:text-green-400" />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Payment successful!</h1>
          <p className="text-muted-foreground">
            Your subscription is now active. You have full access to all features.
          </p>
        </div>

        <div className="w-full rounded-xl border bg-card p-6 text-left shadow-sm">
          <h2 className="mb-4 font-semibold">What&apos;s included in your plan</h2>
          <ul className="flex flex-col gap-3">
            {[
              "Unlimited workflow automations",
              "All integrations & triggers",
              "Priority support",
              "Advanced execution history",
            ].map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <Zap className="size-4 shrink-0 text-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Link href="/workflows" className={buttonVariants({ className: "flex-1 gap-1.5" })}>
            Go to Workflows
            <ArrowRight className="size-4" />
          </Link>
          <Link href="/" className={buttonVariants({ variant: "outline", className: "flex-1" })}>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Page;