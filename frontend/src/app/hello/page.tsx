import Sidebar from '@/components/Sidebar'
import ImagePage from '@/components/ImagePage'

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-50">
        <ImagePage />
      </main>
    </div>
  )
}
