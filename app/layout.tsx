import './styles/globals.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import {ThemeProvider} from './theme-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Supplier Calculator',
  description: 'Supplier Calculator',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header className='grid grid-cols-2 mb-4 p-8'>
          <Link href="/" className='font-bold uppercase'>Supplier Calculator</Link>
          <nav className='justify-self-end'>
            <ul className='flex'>
              <li className='ml-4'>
                <Link href="/">Recommend</Link>
              </li>
              <li className='ml-4'>
                <Link href="/admin">List</Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className='p-8'>
          <ThemeProvider>{children}</ThemeProvider>
        </main>
      </body>
    </html>
  )
}
