// server/index.js
import 'dotenv/config'

import path, { dirname } from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import _ from 'lodash'

const __dirname = dirname(fileURLToPath(import.meta.url));
import express from 'express'
import cookieParser from 'cookie-parser'

import routes from './routes/index.js'

const PORT = process.env.PORT || 3001;
const app = express();

let volume = 40

function setVolume() {
  exec(`amixer set Master ${volume}%`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  })
}

app.set('trust proxy', 1)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.dirname('./client/build/static')));
app.use('/video', express.static(path.dirname('./video/test')));

app.use(cookieParser())

app.use('/api', routes)
app.post('/volume_up', (req, res) => {
  volume = _.clamp(volume + 2, 38, 100)
  setVolume()

  res.json({ volume })
})

app.post('/volume_down', (req, res) => {
  volume = _.clamp(volume - 2, 38, 100)
  setVolume()

  res.json({ volume })
})

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});