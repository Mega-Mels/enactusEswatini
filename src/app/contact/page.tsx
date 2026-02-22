import ContactForm from '@/components/contact/ContactForm'
import Link from 'next/link'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          
          {/* Contact Info Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 font-bold text-xl">
                    📍
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Address</p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      University of Eswatini<br />
                      Kwaluseni Campus<br />
                      Eswatini
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-50 text-green-600 font-bold text-xl">
                    📞
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Phone</p>
                    <p className="text-sm text-slate-500">+268 7636 8299</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold text-xl">
                    📧
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Email</p>
                    <p className="text-sm text-slate-500">support@enactus.sz</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 font-bold text-xl">
                    🕐
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Business Hours</p>
                    <p className="text-sm text-slate-500">Mon - Fri: 8:00 AM - 5:00 PM SAST</p>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-10 border-t border-slate-100 pt-8">
                <p className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Follow Us</p>
                <div className="flex gap-4">
                  {['Facebook', 'LinkedIn', 'Instagram', 'Twitter'].map((platform) => (
                    <Link 
                      key={platform} 
                      href="#" 
                      className="h-10 w-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-900 hover:text-white transition"
                      title={platform}
                    >
                      <span className="text-xs font-bold">{platform[0]}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-24">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { 
                q: "How do I apply for jobs?", 
                a: "Create a free account, browse our opportunities page, and click 'Apply' on jobs that interest you." 
              },
              { 
                q: "Are the courses really free?", 
                a: "Yes! All our internal courses are completely free. Some external courses may have fees set by the provider." 
              },
              { 
                q: "How can my company post jobs?", 
                a: "Contact us through this form or email us at support@enactus.sz to discuss partnership opportunities." 
              },
              { 
                q: "Do I need to be in Eswatini to use this platform?", 
                a: "While our primary focus is Swati youth, anyone can create an account and access our resources." 
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 transition-colors">
                <h4 className="font-bold text-slate-900 mb-2">{faq.q}</h4>
                <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}