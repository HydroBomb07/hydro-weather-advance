import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
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
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			backgroundSize: {
				'size-200': '200% 200%',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'slide-in-up': {
					'0%': { opacity: '0', transform: 'translateY(50px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'fade-in-scale': {
					'0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
					'100%': { opacity: '1', transform: 'scale(1) translateY(0)' }
				},
				'glow': {
					'0%, 100%': { textShadow: '0 0 5px rgba(116, 185, 255, 0.5)' },
					'50%': { textShadow: '0 0 20px rgba(116, 185, 255, 0.8), 0 0 30px rgba(116, 185, 255, 0.6)' }
				},
				'pulse-soft': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' }
				},
				'shake': {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-5px)' },
					'75%': { transform: 'translateX(5px)' }
				},
				'gradient-shift': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'float-particles': {
					'0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
					'10%': { opacity: '1' },
					'90%': { opacity: '1' },
					'100%': { transform: 'translateY(-100px) rotate(360deg)', opacity: '0' }
				},
				'weather-icon-spin': {
					'0%': { transform: 'rotate(0deg) scale(1)' },
					'25%': { transform: 'rotate(5deg) scale(1.1)' },
					'50%': { transform: 'rotate(0deg) scale(1.2)' },
					'75%': { transform: 'rotate(-5deg) scale(1.1)' },
					'100%': { transform: 'rotate(0deg) scale(1)' }
				},
				'typing': {
					'from': { width: '0' },
					'to': { width: '100%' }
				},
				'blink': {
					'50%': { borderColor: 'transparent' }
				},
				'ripple': {
					'0%': { transform: 'scale(0)', opacity: '1' },
					'100%': { transform: 'scale(4)', opacity: '0' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'spin-reverse': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(-360deg)' }
				},
				'orbit': {
					'0%': { transform: 'rotate(0deg) translateX(40px) rotate(0deg)' },
					'100%': { transform: 'rotate(360deg) translateX(40px) rotate(-360deg)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% center' },
					'100%': { backgroundPosition: '200% center' }
				},
				'text-glow': {
					'0%, 100%': { textShadow: '0 0 5px rgba(147, 51, 234, 0.5), 0 0 10px rgba(147, 51, 234, 0.3)' },
					'50%': { textShadow: '0 0 20px rgba(147, 51, 234, 0.8), 0 0 30px rgba(147, 51, 234, 0.6), 0 0 40px rgba(147, 51, 234, 0.4)' }
				},
				'text-slide': {
					'0%': { transform: 'translateX(-20px)', opacity: '0' },
					'100%': { transform: 'translateX(0)', opacity: '1' }
				},
				'text-fade': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'number-count': {
					'0%': { transform: 'scale(0.8)', opacity: '0' },
					'50%': { transform: 'scale(1.1)', opacity: '0.7' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'counter': {
					'0%': { transform: 'translateY(20px)', opacity: '0' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.8s ease-out',
				'slide-in-up': 'slide-in-up 0.8s ease-out',
				'fade-in-scale': 'fade-in-scale 0.8s ease-out',
				'glow': 'glow 3s ease-in-out infinite',
				'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
				'shake': 'shake 0.6s ease-in-out',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'float-particles': 'float-particles 25s linear infinite',
				'weather-icon-spin': 'weather-icon-spin 4s ease-in-out infinite',
				'typing': 'typing 2s steps(20) 1s both',
				'blink': 'blink 1s step-end infinite',
				'ripple': 'ripple 0.6s linear',
				'float': 'float 6s ease-in-out infinite',
				'spin-reverse': 'spin-reverse 2s linear infinite',
				'orbit': 'orbit 2s linear infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'text-glow': 'text-glow 3s ease-in-out infinite',
				'text-slide': 'text-slide 0.6s ease-out',
				'text-fade': 'text-fade 0.8s ease-out',
				'number-count': 'number-count 1s ease-out',
				'counter': 'counter 0.6s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
