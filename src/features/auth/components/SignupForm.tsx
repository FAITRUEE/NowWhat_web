import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import Icon from '@/components/ui/Icon'
import TextField from '@/components/ui/TextField'
import { authApi } from '@/features/auth/api/authApi'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const PASSWORD_MIN_LENGTH = 8

export default function SignupForm() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      navigate('/login')
    },
    onError: (err) => {
      setError(
        (isAxiosError(err) && (err.response?.data as { message?: string })?.message) ||
          '회원가입에 실패했습니다.',
      )
    },
  })

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email || !password || !passwordConfirm) {
      setError('모든 항목을 입력해주세요.')
      return
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('올바른 이메일 형식이 아닙니다.')
      return
    }
    if (password.length < PASSWORD_MIN_LENGTH) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setError(null)
    signupMutation.mutate({ email, password })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <TextField
        id="email"
        label="이메일 주소"
        icon="mail"
        type="email"
        placeholder="example@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <TextField
        id="password"
        label="비밀번호"
        icon="lock"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 입력하세요"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        rightSlot={
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="text-outline/60 transition-colors hover:text-primary"
          >
            <Icon name={showPassword ? 'visibility_off' : 'visibility'} />
          </button>
        }
      />

      <TextField
        id="passwordConfirm"
        label="비밀번호 확인"
        icon="lock"
        type={showPassword ? 'text' : 'password'}
        placeholder="비밀번호를 다시 입력하세요"
        value={passwordConfirm}
        onChange={(event) => setPasswordConfirm(event.target.value)}
      />

      {error && (
        <p className="rounded-lg bg-error-container/50 px-4 py-2 text-label-md font-bold text-error">{error}</p>
      )}

      <button
        type="submit"
        disabled={signupMutation.isPending}
        className="mt-2 h-[58px] w-full rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-[16px] font-bold tracking-wide text-on-primary shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
      >
        {signupMutation.isPending ? '가입 중...' : '가입하기'}
      </button>

      <div className="flex flex-col items-center gap-4 border-t border-surface-container/50 pt-8">
        <p className="text-body-md text-on-surface-variant">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="ml-1.5 font-bold text-secondary underline-offset-4 transition-colors hover:text-primary">
            로그인
          </Link>
        </p>
      </div>
    </form>
  )
}
