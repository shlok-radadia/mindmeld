const path = require('path')

module.exports = [
    {
        mode: 'development',
        entry: './src/login.js',
        output: {
          path: path.resolve(__dirname, 'dist/login'),
          filename: 'script.js'
        },
        watch: true
    },
    {
        mode: 'development',
        entry: './src/signup.js',
        output: {
          path: path.resolve(__dirname, 'dist/signup'),
          filename: 'script.js'
        },
        watch: true
    },
    {
      mode: 'development',
      entry: './src/home.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/home'),
        filename: 'script.js'
      },
      watch: true
    },
    {
      mode: 'development',
      entry: './src/profile.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/profile'),
        filename: 'script.js'
      },
      watch: true
    },
    {
      mode: 'development',
      entry: './src/reaction.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/reaction'),
        filename: 'script.js'
      },
      watch: true
    },
    {
      mode: 'development',
      entry: './src/problem.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/problem'),
        filename: 'script.js'
      },
      watch: true
    },
    {
      mode: 'development',
      entry: './src/attention.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/attention'),
        filename: 'script.js'
      },
      watch: true
    },
    {
      mode: 'development',
      entry: './src/memory.js',
      output: {
        path: path.resolve(__dirname, 'dist/app/memory'),
        filename: 'script.js'
      },
      watch: true
    }
]