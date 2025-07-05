import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">🍟</div>
              <span className="font-bold text-xl">CHIPDOCK</span>
            </div>
            <p className="text-gray-400 text-sm">
              A safe harbor for decentralized fan creation, protecting freedom of creativity and publishing rights for fan art creators.
            </p>
            <div className="flex space-x-4 text-2xl">
              <span>🕊️</span>
              <span>⚓</span>
              <span>🌊</span>
            </div>
          </div>

          {/* Core Principles */}
          <div>
            <h3 className="font-semibold mb-4">Core Principles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>(001) 抗审查 Anti-Censorship</li>
              <li>(010) 尊重原创 Respect Originality</li>
              <li>(011) 分散自治 Decentralized Governance</li>
              <li>(100) 为爱发电 Create with Passion</li>
              <li>(101) 有偿交换 Fair Exchange</li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/feed" className="text-gray-400 hover:text-white transition-colors">
                  Community Feed
                </Link>
              </li>
              <li>
                <Link href="/creators" className="text-gray-400 hover:text-white transition-colors">
                  Featured Creators
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-gray-400 hover:text-white transition-colors">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Creator Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/api" className="text-gray-400 hover:text-white transition-colors">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 ChipDock. Built with ❤️ for the decentralized non-commercial fanart community.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-gray-400 text-sm">Powered by</span>
            <div className="flex items-center space-x-2">
              <span className="text-green-400 font-medium">Lens Protocol</span>
              <span className="text-gray-400">•</span>
              <span className="text-blue-400 font-medium">Grove Storage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
