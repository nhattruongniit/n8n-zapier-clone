"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from "lucide-react";
import { EmptyView, EntityContainer, EntityHeader, EntityItem, EntityList, EntityPagination , ErrorView, LoadingView } from "@/components/entity-components";
import { Execution, ExecutionStatus } from "@/generated/prisma";

import { useExecutionsParams } from "../hooks/use-executions-params";
import { useSuspenseExecutions } from "../hooks/use-executions";
import { formatDistanceToNow } from "date-fns";
import { getDuration } from "@/utils/getDuration";

export const ExecutionsList = () => {
  const executions = useSuspenseExecutions();

  return (
    <EntityList 
      items={executions.data.items}
      getKey={(execution) => execution.id}
      renderItem={(execution) => <ExecutionsItem data={execution} />}
      emptyView={<ExecutionsEmpty />}
    />
  )
}

export const ExecutionsHeader = () => {
  return (
    <>
      <EntityHeader 
        title="Executions"
        description="Create and manage your Executions"
      />
    </>
  )
}

export const ExecutionsPagination = () => {
  const executions = useSuspenseExecutions();
  const [params, setParams] = useExecutionsParams();

  return (
    <EntityPagination 
      disabled={executions.isPending}
      totalPages={executions.data.totalPages}
      page={executions.data.page}
      onPageChange={page => setParams({ ...params, page })}
    />
  )
}

export const ExecutionsContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <EntityContainer
      header={<ExecutionsHeader />}
      pagination={<ExecutionsPagination />}
    >
      {children}
    </EntityContainer>
  )
}

export const ExecutionsLoading = () => {
  return (
    <LoadingView message="Loading Executions..." />
  )
}

export const ExecutionsError = () => {
  return (
    <ErrorView message="Error loading Executions..." />
  )
}

export const ExecutionsEmpty = () => {
  const router = useRouter();

  function handleCreate() {
    router.push(`/executions/new`);
  }

  return (
    <>
      <EmptyView
        onNew={handleCreate}
        message={<>You haven't created any executions yet. <br /> Get started by running your first workflow.</>}
      />
    </>
  )
}

const getStatusIcon = (status: ExecutionStatus) => {
  switch (status) {
    case ExecutionStatus.SUCCESS: 
      return <CheckCircle2Icon className="size-5 text-green-600" />;
    case ExecutionStatus.FAILED:
      return <XCircleIcon className="size-5 text-red-600" />;
    case ExecutionStatus.RUNNING:
      return <Loader2Icon className="size-5 text-blue-600 animate-spin" />;
    default:
      return <ClockIcon className="size-5 text-muted-foreground" />;
  }
}

const formatStatus = (status: ExecutionStatus) => {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionsItem = ({
  data,
}: {
  data: Execution & {
    workflow: {
      id: string;
      name: string;
    }
  };
}) => {
  const duration = getDuration(data);
  const subtitle = (
    <> 
      {data.workflow.name} &bull; Started {" "}
      {formatDistanceToNow(data.startedAt, { addSuffix: true })}
      {duration !== null && <> &bull; Took {duration}s </>}
    </>
  );

  return (
    <EntityItem 
      href={`/executions/${data.id}`}
      title={formatStatus(data.status)}
      subtitle={subtitle}
      image={
        <div className="size-8 flex items-center justify-center">
          {getStatusIcon(data.status)}
        </div>
      }
    />
  )
}