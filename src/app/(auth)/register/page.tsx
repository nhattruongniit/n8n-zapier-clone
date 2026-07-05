import { RegisterForm } from "@/features/auth/components/register-form";
import { requireUnAuth } from "@/lib/auth-utils";
import Layout from "../layout";

export const Page = async () => {
  await requireUnAuth();

  return (
    <RegisterForm />
  )
};

export default Page;