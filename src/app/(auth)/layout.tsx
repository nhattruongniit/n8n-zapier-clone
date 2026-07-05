import AuthLayout from "@/features/auth/components/auth-layout";

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}

export default Layout;