"use client";
import { useParams } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "lucide-react";

interface StripeTriggerDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const StripeTriggerDialog = ({
  isOpen,
  onOpenChange,
}: StripeTriggerDialogProps) => {
  const params = useParams();
  const workflowId = params?.workflowId as string;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"; // webhook URL
  const webhookUrl = `${baseUrl}/api/webhooks/stripe?workflowId=${workflowId}`;
  
  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast.success("Webhook URL copied to clipboard!");
    } catch {
      toast.error("Failed to copy webhook URL to clipboard.");
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Stripe Trigger Configuration</DialogTitle>
          <DialogDescription>
            Configure this webhook URL in your Stripe Dashboard to trigger this workflow on payment events.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">
              Webhook URL
            </Label>
            <div className="flex gap-2">
              <Input 
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={copyToClipboard}
              >
                <CopyIcon className="size-4" />
              </Button>
            </div>
          </div>
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Setup instructions:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Open your Stripe Dashboard.</li>
              <li>Navigate to Developers {"->"} Webhooks.</li>
              <li>Click "Add endpoint" and paste the webhook URL above.</li>
              <li>Select the events you want to trigger this workflow. (e.g., payment_intent.succeeded).</li>
              <li>Save and copy the signing secret.</li>
            </ol>
          </div>

          <div className="rounded-lg bg-muted p-4 space-y-2">
            <h4 className="font-medium text-sm">Available Variables</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.amount}}"}
                </code>
                - Payment amount
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.currency}}"}
                </code>
                - Currency code
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.customerId}}"}
                </code>
                - Customer ID
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{json stripe}}"}
                </code>
                - Full Stripe event payload
              </li>
              <li>
                <code className="bg-background px-1 py-0.5 rounded">
                  {"{{stripe.eventType}}"}
                </code>
                - Stripe event type (e.g., payment_intent.succeeded)
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
