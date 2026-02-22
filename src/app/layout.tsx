import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Enactus Eswatini Youth Hub',
  description:
    "A youth community for Eswatini — learn with MTN Digital Skills Academy, connect with mentors, explore opportunities, and support impact through MTN MoMo.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />

        <main className="flex-grow">{children}</main>

        <ChatWidget />
        <Footer />
      </body>
    </html>
  )
}
