import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 py-24 text-white">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1471&auto=format&fit=crop"
            alt="Students collaborating"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="mb-4 inline-block rounded-full bg-yellow-500/20 px-4 py-1.5 text-sm font-bold tracking-wider text-yellow-500 uppercase">
            Our Mission
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
            Empowering Eswatini's youth to compete in the <span className="text-yellow-500">global digital economy</span>
          </h1>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-slate-900 sm:text-4xl">Who We Are</h2>
              <div className="space-y-6 text-lg leading-relaxed text-slate-600">
                <p>
                  Enactus Remote is an initiative by <span className="font-semibold text-slate-900">Enactus Eswatini</span> designed to address the high youth unemployment rate in our country. We believe that talent is universal, but opportunity is not.
                </p>
                <p>
                  Founded in 2024 at the University of Eswatini, our platform connects young professionals with international employers, provides industry-recognized training, and builds a sustainable ecosystem for digital work in Southern Africa.
                </p>
                <p>
                  We work with local communities, international partners, and government agencies to ensure that every young person in Eswatini has access to the tools they need to build successful remote careers.
                </p>
              </div>
            </div>
            <div className="relative h-[400px] overflow-hidden rounded-2xl shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1470&auto=format&fit=crop"
                alt="Digital workplace"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-12 text-center text-3xl font-bold text-slate-900">Our Impact</h2>
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {[
              { label: 'Students Trained', value: '500+' },
              { label: 'Global Partners', value: '50+' },
              { label: 'Impact Investment', value: 'E100k+' },
              { label: 'Job Placement Rate', value: '85%' },
            ].map((stat) => (
              <div key={stat.label} className="group rounded-2xl bg-white p-8 text-center shadow-sm transition-all hover:shadow-md">
                <p className="text-3xl font-extrabold text-blue-600 group-hover:scale-110 transition-transform">{stat.value}</p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-16 text-center text-3xl font-bold text-slate-900 uppercase tracking-widest">Our Core Values</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: '🎯', title: 'Excellence', desc: 'We strive for the highest quality in everything we do, from training programs to job placements.' },
              { icon: '🤝', title: 'Community', desc: 'We believe in lifting each other up and creating opportunities that benefit all of Eswatini.' },
              { icon: '🌍', title: 'Global Mindset', desc: 'We prepare our students to compete and succeed in the international marketplace.' },
            ].map((value) => (
              <div key={value.title} className="rounded-2xl border border-slate-100 p-8 transition hover:bg-slate-50">
                <span className="mb-4 block text-4xl">{value.icon}</span>
                <h3 className="mb-3 text-xl font-bold text-slate-900">{value.title}</h3>
                <p className="leading-relaxed text-slate-600">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center">
            <h2 className="mb-6 text-3xl font-bold uppercase tracking-widest">Our Partners</h2>
            <p className="mb-12 max-w-2xl text-slate-400">
              We collaborate with leading organizations to provide the best opportunities for Swati youth.
            </p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <span className="text-lg font-bold">University of Eswatini</span>
              <span className="text-lg font-bold">Enactus International</span>
              <span className="text-lg font-bold">Palladium Group</span>
              <span className="text-lg font-bold">Tech Companies Worldwide</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-yellow-500 px-8 py-16 shadow-2xl">
            <h2 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">Want to Join Our Mission?</h2>
            <p className="mb-10 text-lg font-medium text-slate-800">
              Whether you're a student, employer, or donor, there's a place for you in our community.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/learning" className="rounded-full bg-slate-900 px-8 py-4 font-bold text-white transition hover:bg-slate-800">
                Join as Student
              </Link>
              <Link href="/contact" className="rounded-full border-2 border-slate-900 px-8 py-4 font-bold text-slate-900 transition hover:bg-slate-900 hover:text-white">
                Partner With Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}