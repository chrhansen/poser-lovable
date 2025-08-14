import { useState } from 'react'
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { api } from '@/services/api'
import { useAuthStore } from '@/store/authStore'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resendMessage, setResendMessage] = useState('')
  
  const { login } = useAuthStore()

  const handleSendCode = async () => {
    setLoading(true)
    setError('')
    
    try {
      await api.requestCode(email)
      setStep('code')
    } catch (err: any) {
      console.error('Send code error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Failed to send verification code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await api.verifyCode(email, code)
      login(response.access_token)
      onSuccess()
    } catch (err: any) {
      console.error('Verification error:', err)
      if (err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError('Invalid verification code. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')
    setResendMessage('')
    
    try {
      await api.requestCode(email)
      setResendMessage('Verification code sent! Check your email for the verification code')
    } catch (err) {
      setError('Failed to resend code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    setStep('email')
    setCode('')
    setError('')
    setResendMessage('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {step === 'code' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="h-8 w-8"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <Mail className="h-5 w-5" />
            <DialogTitle>Email Verification</DialogTitle>
          </div>
        </DialogHeader>

        {step === 'email' ? (
          <>
            <div className="text-center pt-2 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">
                Verify Your Email
              </h3>
              <DialogDescription className="text-sm text-muted-foreground">
                We'll send you a verification code to ensure you can receive your analysis results
              </DialogDescription>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendCode()}
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              <Button
                onClick={handleSendCode}
                disabled={!email || loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center pt-2 space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Check Your Email
              </h3>
              <DialogDescription className="text-sm text-muted-foreground">
                We sent a 6-digit verification code to {email}
              </DialogDescription>
            </div>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerifyCode()}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
              
              {resendMessage && (
                <div className="flex items-center gap-2 p-2 bg-primary/10 rounded-md">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <p className="text-sm text-primary">{resendMessage}</p>
                </div>
              )}
              
              <Button
                onClick={handleVerifyCode}
                disabled={code.length !== 6 || loading}
                className="w-full"
                size="lg"
              >
                {loading ? 'Verifying...' : 'Verify & Process'}
                {loading && <CheckCircle className="ml-2 h-4 w-4 animate-pulse" />}
              </Button>
              
              <div className="text-center">
                <button
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-muted-foreground hover:text-foreground underline"
                >
                  Didn't receive the code? Resend
                </button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}