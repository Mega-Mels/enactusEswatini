'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { CheckCircle2, Info, Loader2, Lock, Phone, Send } from 'lucide-react'

import mtnLogo from '@/assets/partners/mtn_logo.png'
import momoLogo from '@/assets/partners/mtn_momo.png'

type PaymentMethod = 'momo' | 'card' | 'paypal'

export default function DonationForm() {
  const supabase = createClient()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('momo')
  const [selectedAmount, setSelectedAmount] = useState<number | 'custom'>(100)
  const [amount, setAmount] = useState<number>(100)

  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [momoNumber, setMomoNumber] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const safeAmount = useMemo(() => Number(amount), [amount])

  const normalizePhone = (raw: string) => raw.replace(/[^\d+]/g, '').trim()

  const submitDonation = async () => {
    setError(null)
    setSuccess(null)

    if (!Number.isFinite(safeAmount) || safeAmount <= 0) {
      setError('Please enter a valid amount.')
      return
    }
    if (!email.trim()) {
      setError('Email address is required.')
      return
    }
    if (paymentMethod === 'momo') {
      const phone = normalizePhone(momoNumber)
      if (!phone) {
        setError('Please enter your MTN MoMo number.')
        return
      }
      // Optional: basic length check (adjust if you want stricter rules)
      if (phone.replace('+', '').length < 8) {
        setError('Please enter a valid phone number.')
        return
      }
    }

    setLoading(true)
    try {
      // Match your DB schema as much as possible.
      // If your donations table doesn't have some columns, remove them here.
      const payload: any = {
        donor_name: donorName.trim() || null,
        email: email.trim(),
        amount: safeAmount,
        payment_method: paymentMethod,
        momo_number: paymentMethod === 'momo' ? normalizePhone(momoNumber) : null,
        status: 'pending',
      }

      const { error: insertError } = await supabase.from('donations').insert(payload)
      if (insertError) throw insertError

      setSuccess(
        paymentMethod === 'momo'
          ? 'Donation recorded. Please complete the MoMo payment on your phone using the instructions below.'
          : 'Donation recorded. This payment method will be enabled soon.'
      )

      // reset
      setDonorName('')
      setEmail('')
      setMomoNumber('')
      setSelectedAmount(100)
      setAmount(100)
      setPaymentMethod('momo')
    } catch (e: any) {
      setError(e?.message || 'Something went wrong while saving your donation. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const AmountButton = ({ value }: { value: number }) => (
    <button
      type="button"
      onClick={() => {
        setSelectedAmount(value)
        setAmount(value)
      }}
      className={[
        'py-4 rounded-2xl font-black text-sm transition-all border-2',
        selectedAmount === value
          ? 'border-[#FFCB05] bg-[#FFCB05] text-[#001A70] shadow-lg shadow-yellow-500/20'
          : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200',
      ].join(' ')}
    >
      E{value}
    </button>
  )

  return (
    <div className="space-y-8">
      {/* MTN MoMo primary banner */}
      <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image src={mtnLogo} alt="MTN" width={70} height={26} className="h-6 w-auto" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Primary method</span>
          </div>
          <Image src={momoLogo} alt="MTN MoMo" width={90} height={28} className="h-6 w-auto" />
        </div>
        <p className="mt-3 text-sm font-bold text-slate-700">
          Donate securely using MTN MoMo.
        </p>
      </div>

      {/* Amount */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          Contribution Amount (SZL)
        </label>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[100, 250, 500, 1000].map((amt) => (
            <AmountButton key={amt} value={amt} />
          ))}

          <button
            type="button"
            onClick={() => setSelectedAmount('custom')}
            className={[
              'py-4 rounded-2xl font-black text-xs border-2 transition-all',
              selectedAmount === 'custom'
                ? 'border-[#FFCB05] bg-[#FFCB05] text-[#001A70]'
                : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200',
            ].join(' ')}
          >
            Custom
          </button>
        </div>

        {selectedAmount === 'custom' && (
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 font-black text-slate-900 outline-none focus:border-[#FFCB05]"
            placeholder="Enter amount (e.g. 150)"
          />
        )}
      </div>

      {/* Payment method — keep it simple */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
          Payment Method
        </label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setPaymentMethod('momo')}
            className={[
              'rounded-3xl border-2 p-5 text-left transition-all',
              paymentMethod === 'momo'
                ? 'border-[#FFCB05] bg-[#FFCB05]/60'
                : 'border-slate-100 bg-slate-50 hover:border-slate-200',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image src={momoLogo} alt="MTN MoMo" width={86} height={26} className="h-6 w-auto" />
                <div>
                  <p className="text-xs font-black uppercase tracking-tight text-slate-900">MTN MoMo</p>
                  <p className="text-[10px] font-bold text-slate-700">Recommended</p>
                </div>
              </div>
              <span className="text-[10px] font-black text-[#001A70] bg-white/60 px-3 py-1 rounded-full">Primary</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={[
              'rounded-3xl border-2 p-5 text-left transition-all',
              paymentMethod === 'card'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-100 bg-slate-50 text-slate-400',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-tight">Card</p>
                <p className="text-[10px] font-bold opacity-80">Coming soon</p>
              </div>
              <Lock size={16} className={paymentMethod === 'card' ? 'text-[#FFCB05]' : ''} />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('paypal')}
            className={[
              'rounded-3xl border-2 p-5 text-left transition-all',
              paymentMethod === 'paypal'
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-100 bg-slate-50 text-slate-400',
            ].join(' ')}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-tight">PayPal</p>
                <p className="text-[10px] font-bold opacity-80">Coming soon</p>
              </div>
              <Lock size={16} className={paymentMethod === 'paypal' ? 'text-[#FFCB05]' : ''} />
            </div>
          </button>
        </div>
      </div>

      {/* MoMo number input (only show when momo selected) */}
      {paymentMethod === 'momo' && (
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <div className="flex items-center gap-2 mb-3">
            <Phone className="text-[#001A70]" size={18} />
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">MTN MoMo Number</p>
          </div>

          <input
            type="tel"
            value={momoNumber}
            onChange={(e) => setMomoNumber(e.target.value)}
            className="w-full rounded-2xl border-2 border-slate-200 bg-white px-5 py-4 font-black text-slate-900 outline-none focus:border-[#FFCB05]"
            placeholder="e.g. 76xxxxxx"
          />

          <div className="mt-4 rounded-2xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">How it works</p>
            <ul className="mt-2 space-y-2 text-sm font-bold text-slate-700">
              <li className="flex gap-2">
                <CheckCircle2 className="text-emerald-600 mt-0.5" size={16} />
                Submit this form to record your donation.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="text-emerald-600 mt-0.5" size={16} />
                Complete the MoMo transfer on your phone.
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Donor info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          value={donorName}
          onChange={(e) => setDonorName(e.target.value)}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 text-sm outline-none focus:border-slate-900 placeholder:text-slate-400"
          placeholder="Full Name (Optional)"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-black text-slate-900 text-sm outline-none focus:border-slate-900 placeholder:text-slate-400"
          placeholder="Email Address *"
          required
        />
      </div>

      {/* Feedback */}
      {(error || success) && (
        <div
          className={[
            'rounded-2xl border p-4 flex items-start gap-3',
            error ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700',
          ].join(' ')}
        >
          <Info size={18} className="mt-0.5" />
          <p className="text-sm font-bold leading-snug">{error || success}</p>
        </div>
      )}

      {/* Submit */}
      <button
        type="button"
        onClick={submitDonation}
        disabled={loading}
        className="w-full bg-[#FFCB05] hover:bg-yellow-300 disabled:opacity-60 disabled:cursor-not-allowed text-[#001A70] py-5 rounded-[2rem] font-black text-lg shadow-xl shadow-yellow-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" /> Processing…
          </>
        ) : (
          <>
            Continue with MTN MoMo <Send size={18} />
          </>
        )}
      </button>

      <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tight leading-relaxed">
        This form records donation intent.
      </p>
    </div>
  )
}