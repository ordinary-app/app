import { Header } from "@/components/header"
import { Feed } from "@/components/feed"

export default function FeedPage () {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Feed />
      </main>
    </div>
  )
}