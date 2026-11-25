import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import MainLayout from './MainLayout'

function renderAt(path: string) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/login" element={<p>로그인 화면</p>} />
          <Route path="/" element={<MainLayout />}>
            <Route index element={<p>대시보드 화면</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('MainLayout', () => {
  afterEach(() => localStorage.clear())

  it('토큰이 없으면 로그인 화면으로 보낸다', () => {
    renderAt('/')
    expect(screen.getByText('로그인 화면')).toBeInTheDocument()
    expect(screen.queryByText('대시보드 화면')).not.toBeInTheDocument()
  })

  it('토큰이 있으면 화면을 보여 준다', () => {
    localStorage.setItem('accessToken', 'test-token')
    renderAt('/')
    expect(screen.getByText('대시보드 화면')).toBeInTheDocument()
  })
})
