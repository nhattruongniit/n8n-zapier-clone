"use client";

import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: 'Variable name is required' })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { 
      message: 'Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores' 
    }),
  content: z
    .string()
    .min(1, "Message content is required")
    .max(2000, "Slack message cannot exceed 2000 characters"),
  webhookUrl: z.string().min(1, "Webhook URL is required"),
});

export type SlackFormValues = z.infer<typeof formSchema>; 

interface SlackDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<SlackFormValues>;
}

export const SlackDialog = React.memo(({
  isOpen,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: SlackDialogProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? '',
      content: defaultValues.content ?? '',
      webhookUrl: defaultValues.webhookUrl ?? '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        variableName: defaultValues.variableName ?? '',
        content: defaultValues.content ?? '',
        webhookUrl: defaultValues.webhookUrl ?? '',
      });
    }
  }, [isOpen, defaultValues, form]);

  const watchVariableName = form.watch("variableName") || 'mySlack';

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Slack Configuration</DialogTitle>
          <DialogDescription>
            Configure the Slack webhook settings for this node.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 mt-4">
          <Controller
            name="variableName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Variable Name</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="mySlack"
                />
                <FieldDescription>
                  Use this name to reference the result in other nodes: {" "} {`{{${watchVariableName}.text}}`}
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="webhookUrl"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Webhook URL</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  aria-invalid={fieldState.invalid}
                  placeholder="https://slack.com/api/webhooks/..."
                />
                <FieldDescription>
                  Get this from Slack: Workspace Settings {"->"} Workflow {"->"} Webhooks
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="content"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Message Content</FieldLabel>
                <Textarea
                  className="min-h-[120px] font-mono text-sm"
                  placeholder="Summary: {{myGemini.text}}"
                  {...field}
                />
                <FieldDescription>
                 The message to send. Use {"{{variables}}"} to simple values or {"{{json variable}}"} to stringify objects.
                </FieldDescription>
                <FieldDescription>
                  Make sure you have "content" variable.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <DialogFooter className="pt-4">
            <Button type="submit">
              Submit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});