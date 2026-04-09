'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Coffee, Mail, Phone } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [mode, setMode] = useState<'email' | 'phone'>('email')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    const supabase = createClient()

    try {
      if (mode === 'email') {
        const { error } = isSignUp
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        if (isSignUp) {
          setMessage('Check your email for a confirmation link!')
          return
        }
      } else {
        const { error } = await supabase.auth.signInWithOtp({ phone })
        if (error) throw error
        setMessage('Check your phone for an OTP code!')
        return
      }
      router.push('/')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-up">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-5">
            <Coffee className="w-8 h-8 text-gold" />
          </div>
          <h1 className="font-display text-3xl text-brew-50">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-brew-500 mt-2 text-sm">Earn loyalty points on every order</p>
        </div>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-8 bg-brew-900 border border-brew-800 rounded-xl p-1">
          <button
            onClick={() => setMode('email')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'email'
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'text-brew-500 hover:text-brew-300'
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            onClick={() => setMode('phone')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
              mode === 'phone'
                ? 'bg-gold/15 text-gold border border-gold/20'
                : 'text-brew-500 hover:text-brew-300'
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'email' ? (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
                className="w-full px-4 py-3 bg-brew-900 border border-brew-800 rounded-xl text-brew-100 placeholder-brew-600 focus:border-gold/50 transition-colors"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-4 py-3 bg-brew-900 border border-brew-800 rounded-xl text-brew-100 placeholder-brew-600 focus:border-gold/50 transition-colors"
              />
            </>
          ) : (
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1234567890"
              required
              className="w-full px-4 py-3 bg-brew-900 border border-brew-800 rounded-xl text-brew-100 placeholder-brew-600 focus:border-gold/50 transition-colors"
            />
          )}

          {error && (
            <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
          {message && (
            <div className="px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold text-brew-950 rounded-xl font-semibold hover:bg-gold-light transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {mode === 'email' && (
          <p className="text-center text-sm text-brew-500 mt-6">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-gold font-medium hover:text-gold-light transition-colors"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
