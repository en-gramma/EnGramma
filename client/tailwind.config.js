/** @type {import('tailwindcss').Config} */
module.exports = {

  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'custom': ['Engramma', 'sans-serif'],
    },
    extend: {
      textShadow: {
        '3d': '0 2px 3px rgba(0,0,0,0.3)'
      },
      opacity: {
        '1': '0.01',
        '2': '0.02',
        '3': '0.03',
        '4': '0.04',
      },
        colors: {
          'Engramma':'#88b4bd',
          'orange2':'#FF5733',
        },

        fontSize: {
          'xxs': '0.6rem', 
        },
  
      height: {
        'screen-110': '110vh',
        'screen-120': '120vh',
        '50': '12.5rem',
        '60': '15rem',
        'h64': '16rem',
        '70': '17.5rem',
        '80': '20rem',
        '90': '22.5rem',
        '100': '25rem',
        '110': '27.5rem',
        '120': '30rem',
        '128': '32rem',
        '130': '32.5rem',
        '133': '33rem',
        '140': '35rem',
        '150': '37.5rem',
      },
        screens: {
      'sm': '768px',
      // => @media (min-width: 640px) { ... }

      'md': '900px',
      // => @media (min-width: 768px) { ... }

      'lg': '1240px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }  
    },
    
  },
  variants: {},
  
  plugins: [
    require('tailwindcss-animated'),
    require('tailwindcss-textshadow')
  ],
  
}

