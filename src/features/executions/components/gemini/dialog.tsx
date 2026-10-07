"use client";

import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import Image from 'next/image';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AVAILABLE_MODELS_GEMINI } from "@/config/constants";
import { CredentialType } from "@/generated/prisma";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, { message: 'Variable name is required' })
    .regex(/^[a-zA-Z_][a-zA-Z0-9_]*$/, { 
      message: 'Variable name must start with a letter or underscore and can only contain letters, numbers, and underscores' 
    }),
  model: z.enum(AVAILABLE_MODELS_GEMINI),
  credentialId: z.string().min(1, 'Credential is required'),
  systemPrompt: z.string().optional(),
  userPrompt: z.string().min(1, { message: 'User prompt is required' })
});

export type GeminiFormValues = z.infer<typeof formSchema>; 

interface GeminiDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (value: z.infer<typeof formSchema>) => void;
  defaultValues?: Partial<GeminiFormValues>;
}

export const GeminiDialog = React.memo(({
  isOpen,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: GeminiDialogProps) => {
  const { 
    data: credentials, 
    isLoading: isLoadingCredentials,
  } = useCredentialByType(CredentialType.GEMINI);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName ?? '',
      model: defaultValues.model ?? AVAILABLE_MODELS_GEMINI[0],
      credentialId: defaultValues.credentialId ?? '',
      systemPrompt: defaultValues.systemPrompt ?? '',
      userPrompt: defaultValues.userPrompt ?? '',
    },
  });

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        variableName: defaultValues.variableName ?? '',
        model: defaultValues.model ?? AVAILABLE_MODELS_GEMINI[0],
        credentialId: defaultValues.credentialId ?? '',
        systemPrompt: defaultValues.systemPrompt ?? '',
        userPrompt: defaultValues.userPrompt ?? '',
      })
    }
  }, [isOpen])

  const watchVariableName = form.watch("variableName") || 'myApiCall';

  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gemini Configuration</DialogTitle>
          <DialogDescription>
            Configure the AI model and prompts for this node.
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
                  placeholder="myApiCall"
                />
                <FieldDescription>
                  Use this name to reference the result in other nodes: {" "} {`{{${watchVariableName}.text}}`}
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="credentialId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Gemini Credential</FieldLabel>
                <Select 
                  {...field} 
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  disabled={isLoadingCredentials || !credentials?.length}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue>
                      {(value: string | null) => value ? (
                        <>
                          <Image src="/logo/gemini.svg" alt="Gemini" width={16} height={16} />
                          {credentials.find(option => option.id === value)?.name}
                        </>
                      ) : 'Select a credential' }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {(credentials || []).map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          <Image src="/logo/gemini.svg" alt="Gemini" width={16} height={16} />
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="model"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Model</FieldLabel>
                <Select 
                  {...field} 
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Model</SelectLabel>
                      {AVAILABLE_MODELS_GEMINI.map((model) => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldDescription>
                  The Google Gemini model to use for completion.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="systemPrompt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>System Prompt (Optional)</FieldLabel>
                <Textarea
                  className="min-h-[120px] font-mono text-sm"
                  placeholder="You are a helpful assistant."
                  {...field}
                />
                <FieldDescription>
                  Sets the behavior of the assistant. Use {"{{variables}}"} to simple values or {"{{json variable}}"} to stringify objects.
                </FieldDescription>
              </Field>
            )}
          />

          <Controller
            name="userPrompt"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>User Prompt</FieldLabel>  
                <Textarea
                  className="min-h-[120px] font-mono text-sm"
                  placeholder="Summarize this text: {{json httpResponse.data}}"
                  {...field}
                />
                <FieldDescription>
                  Sets the behavior of the assistant. Use {"{{variables}}"} to simple values or {"{{json variable}}"} to stringify objects.
                </FieldDescription>
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