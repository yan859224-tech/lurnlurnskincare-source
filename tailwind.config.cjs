module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {sage:'#91a998',ink:'#25362f',ivory:'#f8f6f1'},
      fontFamily: {sans:['Inter','Noto Sans Khmer','system-ui','sans-serif']},
      boxShadow: {soft:'0 16px 60px rgba(39,57,44,.08)'}
    }
  },
  corePlugins: {preflight: false},
  plugins: []
}
