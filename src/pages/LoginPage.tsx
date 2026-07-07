import AuthLayout from '@/components/layout/AuthLayout'
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-headline-lg tracking-tight text-primary">다시 만나서 반가워요</h1>
        <p className="text-body-md text-on-surface-variant/80">
          지금 뭐부터 할지, AI가 정해드려요
        </p>
      </div>
      <LoginForm />
    </AuthLayout>
  )
}
