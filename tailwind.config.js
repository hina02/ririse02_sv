/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			height: {
				'screen-14': 'calc(100vh - 4rem)',
				'screen-30': 'calc(100vh - 5.4rem)',
			},
			fontFamily: {
				zen: ['Zen Maru Gothic', 'serif'],
				notoJP: ['Lato', 'Noto Sans JP', 'Noto Sans', 'sans-serif', 'Apple Color Emoji', 'Noto Color Emoji'],
			},
		},
	},
  plugins: [],
}

