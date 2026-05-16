import { AdminPanel } from '@/components/admin-panel'
import { ChatInterface } from '@/components/chat-interface'
import { RayDeskPage } from '@/components/ray-desk-page'
import { Sidebar } from '@/components/sidebar'

export default function HomePage() {
  return (
    <main style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <ChatInterface />
        <RayDeskPage />
        <AdminPanel />
      </div>
    </main>
  )
}
