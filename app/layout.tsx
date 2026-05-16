import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RAY AI Assistant',
  description: 'RAY chatbot and ticketing workspace',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
