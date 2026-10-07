"use client"
import React from 'react'
import { useSuspenseCredential } from '../hooks/use-credentials';
import CredentialForm from './credential-form';

interface CredentialViewProps {
  credentialId: string
}

function CredentialView({ credentialId }: CredentialViewProps) {
  const { data: credential } = useSuspenseCredential(credentialId);

  return (
    <>
      <CredentialForm initialData={credential} />
    </>
  )
}

export default CredentialView