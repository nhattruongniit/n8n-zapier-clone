import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
  params: Promise<{
    credentialId: string;
  }>;
}

// credentials/123

const Page = async ({ params }: PageProps) => {
  await requireAuth();

  const { credentialId } = await params;
  return (
    <p>credentials id: {credentialId}</p>
  )
}

export default Page;