import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/ui/Icon'
import TextField from '@/components/ui/TextField'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }
    setError(null)
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

      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="flex items-center gap-2 text-label-md text-on-surface-variant">
            <Icon name="lock" className="text-[18px]" />
            비밀번호
          </label>
          <a href="#" className="text-label-sm font-semibold text-secondary transition-colors hover:text-primary">
            비밀번호를 잊으셨나요?
          </a>
        </div>
        <TextField
          id="password"
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
      </div>

      <div className="flex items-center gap-3 py-1">
        <input
          id="remember"
          type="checkbox"
          className="h-5 w-5 rounded border-outline-variant text-secondary focus:ring-secondary/20"
        />
        <label htmlFor="remember" className="select-none text-label-md text-on-surface-variant">
          로그인 상태 유지
        </label>
      </div>

      {error && (
        <p className="rounded-lg bg-error-container/50 px-4 py-2 text-label-md font-bold text-error">{error}</p>
      )}

      <button
        type="submit"
        className="mt-2 h-[58px] w-full rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-[16px] font-bold tracking-wide text-on-primary shadow-lg shadow-secondary/20 transition-transform hover:scale-[1.01] active:scale-95"
      >
        로그인
      </button>

      <div className="flex flex-col items-center gap-4 border-t border-surface-container/50 pt-8">
        <p className="text-body-md text-on-surface-variant">
          계정이 없으신가요?{' '}
          <Link
            to="/signup"
            className="ml-1.5 font-bold text-secondary underline-offset-4 transition-colors hover:text-primary"
          >
            회원가입
          </Link>
        </p>
      </div>
    </form>
  )
}
