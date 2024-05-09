const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/script.js',  // Certifique-se de que esse é o caminho correto para seu arquivo de entrada principal
  output: {
    path: path.resolve(__dirname, 'dist'),  // Este é o diretório onde os arquivos resultantes serão colocados
    filename: 'bundle.js'  // O nome do arquivo de saída
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_KEY_PLACEHOLDER': JSON.stringify(process.env.API_KEY_PLACEHOLDER),
      'process.env.APP_ID_PLACEHOLDER': JSON.stringify(process.env.APP_ID_PLACEHOLDER),
      'process.env.AUTH_DOMAIN_PLACEHOLDER': JSON.stringify(process.env.AUTH_DOMAIN_PLACEHOLDER),
      'process.env.DATABASE_URL_PLACEHOLDER': JSON.stringify(process.env.DATABASE_URL_PLACEHOLDER),
      'process.env.MEASUREMENT_ID_PLACEHOLDER': JSON.stringify(process.env.MEASUREMENT_ID_PLACEHOLDER),
      'process.env.MESSAGING_SENDER_ID_PLACEHOLDER': JSON.stringify(process.env.MESSAGING_SENDER_ID_PLACEHOLDER),
      'process.env.PROJECT_ID_PLACEHOLDER': JSON.stringify(process.env.PROJECT_ID_PLACEHOLDER),
      'process.env.STORAGE_BUCKET_PLACEHOLDER': JSON.stringify(process.env.STORAGE_BUCKET_PLACEHOLDER)
    })
  ],
  mode: 'production'
};
