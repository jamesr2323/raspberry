// server/index.js
import 'dotenv/config'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url));
import express from 'express'
import cookieParser from 'cookie-parser'

import routes from './routes/index.js'

const PORT = process.env.PORT || 3001;
const app = express();

app.set('trust proxy', 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.dirname('./client/build/static')));

app.use(cookieParser())

app.use('/api', routes)

app.get('/nts', (req, res) => {
  const file = path.resolve(__dirname, './static/nts.html')
  res.sendFile(file);
})

// app.get('*', (req, res) => {
//   const file = path.resolve(__dirname, '../client/build/index.html')
//   res.sendFile(file);
// });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});