import AuthLayout from '@/components/layout/AuthLayout'
import SignupForm from '@/features/auth/components/SignupForm'

export default function SignupPage() {
  return (
    <AuthLayout>
      <div className="mb-10 text-center">
        <h1 className="mb-3 text-headline-lg tracking-tight text-primary">지금 바로 시작해요</h1>
        <p className="text-body-md text-on-surface-variant/80">
          가장 중요한 일부터, AI가 정해드려요
        </p>
      </div>
      <SignupForm />
    </AuthLayout>
  )
}
