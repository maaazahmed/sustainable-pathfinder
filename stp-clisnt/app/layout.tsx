// import type React from "react"
// import type { Metadata } from "next"
// import { Inter } from "next/font/google"
// import "./globals.css"
// import { Toaster } from "@/components/ui/toaster"
// import { ThemeProvider } from "@/components/theme-provider"
// import { AuthProvider } from "@/contexts/auth-context"

// const inter = Inter({ subsets: ["latin"] })

// export const metadata: Metadata = {
//   title: "Sustainable Pathfinders - Dashboard",
//   description: "Login and dashboard for Sustainable Pathfinders",
//   generator: 'v0.dev'
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>
//         {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           {children}
//           <Toaster />
//         </ThemeProvider> */}
//         <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
//           <AuthProvider>
//             {children}
//             <Toaster />
//           </AuthProvider>
//         </ThemeProvider>
//       </body>
//     </html>
//   )
// }


import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
// import "@/styles/globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sustainable Pathfinders - Dashboard",
  description: "Login and dashboard for Sustainable Pathfinders",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
