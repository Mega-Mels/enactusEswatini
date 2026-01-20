'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'

export default function DonationForm() {
  const [amount, setAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(100)
  const [paymentMethod, setPaymentMethod] = useState('momo')
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const presetAmounts = [100, 250, 500, 1000]

  const handleAmountSelect = (value: number | 'custom') => {
    setSelectedAmount(value)
    if (value === 'custom') {
      setAmount(0)
    } else {
      setAmount(value)
      setCustomAmount('')
    }
  }

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value)
    setAmount(Number(value) || 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (amount < 10) {
        throw new Error('Minimum donation amount is E10')
      }
      const { error: donationError } = await supabase
        .from('donations')
        .insert({
          donor_name: donorName || 'Anonymous',
          email: email,
          amount: amount,
          currency: 'SZL',
          payment_method: paymentMethod,
          status: 'pending'
        })

      if (donationError) throw donationError
      setSuccess(true)
      
      setTimeout(() => {
        setSuccess(false)
        setDonorName('')
        setEmail('')
        setSelectedAmount(100)
        setAmount(100)
        setCustomAmount('')
      }, 5000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-10">
      <h2 className="mb-8 text-center text-3xl font-extrabold text-slate-900">Make a Donation</h2>

      {success && (
        <div className="mb-8 rounded-lg bg-green-50 p-4 text-center text-green-800 border border-green-200 animate-in fade-in zoom-in duration-300">
          <p className="font-bold text-lg">✅ Thank you for your donation of E{amount}!</p>
          <p className="text-sm">You&apos;ll receive a confirmation email shortly.</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount Selection */}
        <div>
          <label className="mb-3 block text-sm font-bold text-slate-700 uppercase tracking-wide">
            Choose an amount (E)
          </label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handleAmountSelect(preset)}
                className={`py-3 px-2 border-2 rounded-xl font-bold transition-all duration-200 ${
                  selectedAmount === preset
                    ? 'border-yellow-500 bg-yellow-50 text-yellow-700 shadow-inner'
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
                }`}
              >
                E{preset}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleAmountSelect('custom')}
              className={`py-3 px-2 border-2 rounded-xl font-bold transition-all duration-200 ${
                selectedAmount === 'custom'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-300'
              }`}
            >
              Custom
            </button>
          </div>

          {selectedAmount === 'custom' && (
            <div className="mt-4 animate-in slide-in-from-top-2 duration-200">
              <input
                type="number"
                min="10"
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none transition"
                placeholder="Enter custom amount (Minimum E10)"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="mb-3 block text-sm font-bold text-slate-700 uppercase tracking-wide">
            Payment Method
          </label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('momo')}
              className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${
                paymentMethod === 'momo'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-100 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">📱</span>
              <span className="text-[10px] font-bold mt-1">MTN MOMO</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${
                paymentMethod === 'card'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-slate-100 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">💳</span>
              <span className="text-[10px] font-bold mt-1">CARD</span>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl transition-all ${
                paymentMethod === 'paypal'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-slate-100 text-slate-500 hover:border-slate-300'
              }`}
            >
              <span className="text-xl">🌐</span>
              <span className="text-[10px] font-bold mt-1">PAYPAL</span>
            </button>
          </div>
        </div>

        {/* Donor Information */}
        <div className="space-y-4 pt-4">
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">Full Name (Optional)</label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="Your name or 'Anonymous'"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-slate-500 uppercase">Email Address *</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 outline-none"
              placeholder="For receipt"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {error && <p className="text-sm font-bold text-red-500 italic">⚠️ {error}</p>}

        <button
          type="submit"
          disabled={loading || amount < 10}
          className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
            loading || amount < 10
              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
              : 'bg-yellow-500 text-slate-900 hover:bg-yellow-400'
          }`}
        >
          {loading ? 'Processing...' : `Donate E${amount || '...'} Now`}
        </button>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          🔒 All donations are secure. You will receive an official receipt via email.
        </p>
      </form>
    </div>
  )
}