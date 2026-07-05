import { LoginForm } from "@/features/auth/components/login-form";
import { requireUnAuth } from "@/lib/auth-utils"
;
import Layout from "../layout";

const Page = async () => {
  await requireUnAuth();
  
  return (
    <LoginForm />
  )
}

export default Page;

// http://localhost:3000/login