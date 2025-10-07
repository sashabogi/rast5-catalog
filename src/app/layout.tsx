// Root layout - minimal wrapper without locale-specific content
// The actual layout with translations is in [locale]/layout.tsx

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
