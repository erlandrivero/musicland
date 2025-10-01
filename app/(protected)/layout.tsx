export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Protected layout will include authentication checks */}
      {children}
    </div>
  )
}
