"use client"

import type React from "react"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { ToastProvider } from "@/components/toast-provider"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased min-h-screen bg-black text-white`}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <Suspense>
            <main className="flex-1">{children}</main>
          </Suspense>
          <Footer />
          <ToastProvider />
          <Analytics />
        </div>
      </body>
    </html>
  )
}
