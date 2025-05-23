import { SubAdminProvider } from "../src/context/sub-admin-context"
import "./globals.css"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SubAdminProvider>{children}</SubAdminProvider>
      </body>
    </html>
  )
}
