// .prettierrc.js
module.exports = {
  tabWidth: 2,
  singleQuote: true,
  bracketSpacing: true,
  arrowParens: 'always',
  overrides: [
    {
      files: 'resources/assets/**/*.css',
      options: {
        tabWidth: 2,
        singleQuote: false,
        semicolons: true
      }
    },
    {
      files: 'resources/assets/**/*.scss',
      options: {
        tabWidth: 2,
        singleQuote: false,
        semicolons: true
      }
    }
  ]
};
