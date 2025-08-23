import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
	"./src/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			},
  			// o-kitchen Harbor Blue Palette (Primary)
  			harbor: {
  				50: "#f0f9ff", // 泡沫白 - Foam White
  				100: "#e0f2fe", // 浅泡沫 - Light Foam
  				200: "#bae6fd", // 浅海蓝 - Light Sea Blue
  				300: "#7dd3fc", // 海湾浅蓝 - Harbor Light Blue
  				400: "#38bdf8", // 海湾蓝 - Harbor Blue
  				500: "#0ea5e9", // 深海湾蓝 - Deep Harbor Blue
  				600: "#0284c7", // 海洋蓝 - Ocean Blue
  				700: "#0369a1", // 深海蓝 - Deep Sea Blue
  				800: "#075985", // 深海军蓝 - Deep Navy
  				900: "#0c4a6e", // 深渊蓝 - Abyss Blue
  				950: "#082f49", // 最深海蓝 - Deepest Sea
  			},
			// o-kitchen CHIPS Palette (For chip-related elements)
			chip: {
				50: "#fffbeb", // 薯条浅黄 - Light Chip Yellow
				100: "#fef3c7", // 浅金黄 - Light Golden
				200: "#fde68a", // 金黄 - Golden
				300: "#fcd34d", // 深金黄 - Deep Golden
				400: "#fbbf24", // 薯条黄 - Chip Yellow
				500: "#f59e0b", // 经典薯条色 - Classic Chip Color
				600: "#d97706", // 烤薯条色 - Baked Chip Color
				700: "#b45309", // 深烤色 - Deep Baked
				800: "#92400e", // 焦糖色 - Caramel
				900: "#78350f", // 深焦糖 - Deep Caramel
				950: "#451a03", // 最深焦糖 - Deepest Caramel
			  },
  			// Neutral colors for readability
  			neutral: {
  				50: "#fafafa",
  				100: "#f5f5f5",
  				200: "#e5e5e5",
  				300: "#d4d4d4",
  				400: "#a3a3a3",
  				500: "#737373",
  				600: "#525252",
  				700: "#404040",
  				800: "#262626",
  				900: "#171717",
  				950: "#0a0a0a",
  			},
  			// Success/positive actions (green tones)
  			success: {
  				50: "#f0fdf4",
  				100: "#dcfce7",
  				200: "#bbf7d0",
  				300: "#86efac",
  				400: "#4ade80",
  				500: "#22c55e",
  				600: "#16a34a",
  				700: "#15803d",
  				800: "#166534",
  				900: "#14532d",
  			},
  			// Warning/attention (amber tones)
  			warning: {
  				50: "#fffbeb",
  				100: "#fef3c7",
  				200: "#fde68a",
  				300: "#fcd34d",
  				400: "#fbbf24",
  				500: "#f59e0b",
  				600: "#d97706",
  				700: "#b45309",
  				800: "#92400e",
  				900: "#78350f",
  			},
  			// Error/danger (red tones)
  			danger: {
  				50: "#fef2f2",
  				100: "#fee2e2",
  				200: "#fecaca",
  				300: "#fca5a5",
  				400: "#f87171",
  				500: "#ef4444",
  				600: "#dc2626",
  				700: "#b91c1c",
  				800: "#991b1b",
  				900: "#7f1d1d",
  			},
  			// Seagull gray for secondary elements
  			seagull: {
  				50: "#f8fafc",
  				100: "#f1f5f9",
  				200: "#e2e8f0",
  				300: "#cbd5e1",
  				400: "#94a3b8",
  				500: "#64748b",
  				600: "#475569",
  				700: "#334155",
  				800: "#1e293b",
  				900: "#0f172a",
  			}
  		},
  		backgroundImage: {
  			"harbor-gradient": "linear-gradient(135deg, #0ea5e9 0%, #0284c7 50%, #0369a1 100%)",
  			"harbor-light": "linear-gradient(135deg, #bae6fd 0%, #7dd3fc 50%, #38bdf8 100%)",
  			"harbor-deep": "linear-gradient(135deg, #0369a1 0%, #075985 50%, #0c4a6e 100%)",
  			"harbor-wave": "linear-gradient(90deg, #f0f9ff 0%, #bae6fd 25%, #38bdf8 50%, #0284c7 75%, #0369a1 100%)",
			"chip-gradient": "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)",
        "chip-light": "linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)",
        "chip-golden": "linear-gradient(135deg, #fcd34d 0%, #fbbf24 50%, #f59e0b 100%)",
      
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			wave: {
  				"0%, 100%": { transform: "rotate(0deg)" },
  				"50%": { transform: "rotate(3deg)" },
  			},
  			float: {
  				"0%, 100%": { transform: "translateY(0px)" },
  				"50%": { transform: "translateY(-10px)" },
  			},
  			"anchor-swing": {
  				"0%, 100%": { transform: "rotate(-5deg)" },
  				"50%": { transform: "rotate(5deg)" },
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			wave: "wave 3s ease-in-out infinite",
  			float: "float 6s ease-in-out infinite",
  			"anchor-swing": "anchor-swing 4s ease-in-out infinite",
			"chip-glow": "chip-glow 2s ease-in-out infinite alternate",
			
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
