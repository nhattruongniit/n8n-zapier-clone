import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { EditorHeader } from "@/features/editor/components/editor-header";
import { Editor } from "@/features/editor/components/editor";
import { EditorError } from "@/features/editor/components/editor-error";
import { EditorLoading } from "@/features/editor/components/editor-loading";

interface PageProps {
  params: Promise<{
    workflowId: string;
  }>;
}

// workflows/123
const Page = async ({ params }: PageProps) => {
  await requireAuth();
  
  const { workflowId } = await params;
  prefetchWorkflow(workflowId);

  return (
    <HydrateClient>
      <ErrorBoundary fallback={<EditorError />}>
        <Suspense fallback={<EditorLoading />}>
          <EditorHeader workflowId={workflowId} />
          <div className="flex-1">
            <Editor workflowId={workflowId} />
          </div>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
  )
}

export default Page;