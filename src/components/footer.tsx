import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const homeT = useTranslations("home");
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
        {/* <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/*<div className="text-2xl">⚓</div>*/}
        {/* <span className="font-bold text-xl">o-kitchen</span>
            </div>
            <p className="text-gray-400 text-sm">{t("brand.description")}</p>
            <div className="flex space-x-4 text-2xl">
              <span>🕊️</span>
              <span>🍟</span>
              <span>🌊</span>
            </div>
          </div> */}

        {/* Core Principles */}
        {/* <div>
            <h3 className="font-semibold mb-4">Core Principles</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>(1) 抗审查 Anti-Censorship</li>
              <li>(2) 尊重原创 Respect Originality</li>
              <li>(3) 去中心化 Decentralized</li>
              <li>(4) 为爱发电 Powered by Love</li>
              <li>(5) 有偿交换 Coin Exchange</li>
            </ul>
          </div> */}

        {/* Community */}
        {/* <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/feed"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.feed")}
                </Link>
              </li>
              <li>
                <Link
                  href="/creators"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.creators")}
                </Link>
              </li>
              <li>
                <Link
                  href="/guidelines"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.guidelines")}
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("community.support")}
                </Link>
              </li>
            </ul>
          </div> */}

        {/* Resources */}
        {/* <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.documentation")}
                </Link>
              </li>
              <li>
                <Link
                  href="/api"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.api")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {t("resources.terms")}
                </Link>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <p className="text-gray-400 text-sm text-center">
            © 2025 o-kitchen Labs. Built with ❤️ for the decentralized fandoms.
          </p>
          <div className="flex items-center space-x-4">
            <Link
              href="https://github.com/o-kitchen/app"
              target="_blank"
              className="flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Github</title>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>

            <Link 
              href="https://hey.xyz/u/o_kitchen" 
              className="flex items-center text-gray-400 hover:text-white transition-colors group"
              target="_blank"
            >
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 270 270" fill="currentColor">
                <title>Hey</title>
                  <path
                    d="M185.873 44.6967C196.939 35.5295 209.287 32.0417 221.128 32.9234C233.759 33.864 245.449 39.7422 254.178 48.2805C262.908 56.8195 268.905 68.2405 269.865 80.5667C270.834 93.0051 266.639 106.033 255.58 117.466C254.568 118.519 253.534 119.558 252.479 120.584C246.987 125.955 241.298 130.74 235.52 135.001C241.299 139.265 246.989 144.05 252.481 149.423L252.492 149.433C253.53 150.455 254.553 151.483 255.56 152.518L255.568 152.527C266.633 163.95 270.832 176.975 269.866 189.413C268.909 201.737 262.916 213.159 254.189 221.701C245.462 230.243 233.774 236.126 221.141 237.07C209.3 237.955 196.95 234.472 185.877 225.309C184.687 239.441 178.484 250.44 169.479 258.002C159.876 266.067 147.361 270 135.002 270C122.644 270 110.129 266.067 100.526 258.002C91.5201 250.439 85.3165 239.438 84.1271 225.303C73.061 234.47 60.7133 237.958 48.8723 237.077C36.2406 236.136 24.5514 230.258 15.8221 221.719C7.09216 213.18 1.095 201.759 0.134964 189.433C-0.833822 176.995 3.36072 163.967 14.4203 152.534C15.4321 151.481 16.4658 150.442 17.5214 149.416C23.013 144.045 28.702 139.26 34.4803 134.998C28.7012 130.735 23.0113 125.95 17.5188 120.577L17.5078 120.567C16.4696 119.545 15.447 118.517 14.44 117.482L14.4319 117.473C3.3671 106.05 -0.831604 93.0254 0.134066 80.5871C1.09086 68.2632 7.08416 56.8407 15.8114 48.2988C24.538 39.7574 36.2259 33.8745 48.8595 32.9299C60.7002 32.0446 73.0499 35.5282 84.1227 44.691C85.3133 30.5586 91.5164 19.5596 100.521 11.9979C110.124 3.93303 122.639 0 134.998 0C147.356 0 159.871 3.93303 169.474 11.9979C178.48 19.5606 184.684 30.5616 185.873 44.6967ZM94 123C89.5817 123 86 126.582 86 131V150C86 154.418 89.5817 158 94 158C98.4183 158 102 154.418 102 150V131C102 126.582 98.4183 123 94 123ZM176 123C171.582 123 168 126.582 168 131V150C168 154.418 171.582 158 176 158C180.418 158 184 154.418 184 150V131C184 126.582 180.418 123 176 123ZM155.002 145.493C156.536 149.636 154.421 154.239 150.278 155.773C145.508 157.539 140.357 158.5 135 158.5C129.643 158.5 124.492 157.539 119.722 155.773C115.579 154.239 113.464 149.636 114.998 145.493C116.532 141.349 121.135 139.234 125.278 140.768C128.296 141.886 131.567 142.5 135 142.5C138.433 142.5 141.704 141.886 144.722 140.768C148.865 139.234 153.468 141.349 155.002 145.493Z"
                  />
              </svg>
            </Link>

            <Link
              href="https://x.com/o_kitchen_labs"
              target="_blank"
              className="flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 17 17"
              >
                <title>Twitter</title>
                <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334q.002-.211-.006-.422A6.7 6.7 0 0 0 16 3.542a6.7 6.7 0 0 1-1.889.518 3.3 3.3 0 0 0 1.447-1.817 6.5 6.5 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.32 9.32 0 0 1-6.767-3.429 3.29 3.29 0 0 0 1.018 4.382A3.3 3.3 0 0 1 .64 6.575v.045a3.29 3.29 0 0 0 2.632 3.218 3.2 3.2 0 0 1-.865.115 3 3 0 0 1-.614-.057 3.28 3.28 0 0 0 3.067 2.277A6.6 6.6 0 0 1 .78 13.58a6 6 0 0 1-.78-.045A9.34 9.34 0 0 0 5.026 15"/>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
