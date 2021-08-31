const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
	darkMode: false, // or 'media' or 'class'
	theme: {
		screens: {
			...defaultTheme.screens,
			'3xl': '1720px',
			'4xl': '1980px',
		},
		extend: {
			minWidth: {
				...defaultTheme.spacing,
			}
		},
	},
	variants: {
		extend: {},
	},
	plugins: [
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
}
