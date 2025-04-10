import { Link } from "lucide-react";


export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r p-4">
      <h2 className="text-xl font-semibold mb-4">Nour</h2>
      <ul className="space-y-2">
        <li><Link href="/" className="text-blue-600 hover:underline">Chat</Link></li>
        <li><Link href="/signin" className="text-red-600 hover:underline">Logout</Link></li>
      </ul>
    </div>
  )
}
