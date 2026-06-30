import { caller } from "@/trpc/server";
import { Button } from "@/components/ui/button";

const Page = async () => {
  const users = await caller.getUsers();
  return (
    <div>
      {JSON.stringify(users)}
    </div>
  )
}

export default Page;