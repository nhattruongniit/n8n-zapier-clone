"use client"
import React from 'react'
import { CredentialType } from "@/generated/prisma";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCreateCredential, useUpdateCredential } from '../hooks/use-credentials';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { Input } from '@/components/ui/input';
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.enum(CredentialType),
  value: z.string().min(1, 'API key is required'),
})

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: 'OpenAI',
    logo: '/logo/openai.svg'
  },
  {
    value: CredentialType.ANTHROPIC,
    label: 'Anthropic',
    logo: '/logo/anthropic.svg'
  },
  {
    value: CredentialType.GEMINI,
    label: 'Gemini',
    logo: '/logo/gemini.svg'   
  }
]

interface CredentialFormProps {
  initialData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  }
}

function CredentialForm({ initialData }: CredentialFormProps) {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initialData?.id;
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues:  initialData || {
      name: '',
      type: CredentialType.OPENAI,
      value: ''
    }
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    if (isEdit && initialData?.id) {
      await updateCredential.mutateAsync({
        id: initialData.id,
        ...values
      }, {
        onSuccess: () => {
          router.push(`/credentials`)
        }
      })
      return
    };

    // create
    await createCredential.mutateAsync(values, {
      onSuccess: (data) => {
        router.push(`/credentials/${data.id}`)
      },
      onError: (error) => {
        handleError(error)
      }
    })
  }

  return (
    <>
      {modal}

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? 'Edit Credential' : 'Create Credential'}
          </CardTitle>
          <CardDescription>
            {isEdit ? 'Update your API key or credential details' : 'Add a new API key or credential to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    placeholder="My API key"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="type"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select 
                    {...field} 
                    name={field.name}
                    value={field.value}
                    onValueChange={field.onChange}
                    aria-invalid={fieldState.invalid}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue>
                        {(value: string | null) => value ? (
                          <>
                            {credentialTypeOptions.find(option => option.value === value) && (
                              <Image src={credentialTypeOptions.find(option => option.value === value)?.logo || "/logo/gemini.svg"} alt="Logo" width={16} height={16} />
                            )}
                            {credentialTypeOptions.find(option => option.value === value)?.label}
                          </>
                        ) : 'Select a credential' }
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {credentialTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            <Image src={option.logo} alt={option.label} width={16} height={16} />
                            {option.label}
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
              name="value"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor={field.name}>API Key</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    type="password"
                    placeholder="sk-..."
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
            
            <div className='flex gap-4'>
              <Button
                type='submit'
                disabled={createCredential.isPending || updateCredential.isPending}
              >
                {isEdit ? 'Update' : 'Create'}
              </Button>

              <Button
                type='button'
                variant='outline'
                onClick={() => router.push('/credentials')}
              >
                Cancel
              </Button>
            </div>

          </form>
        </CardContent>
      </Card>
    </>
  )
}

export default CredentialForm