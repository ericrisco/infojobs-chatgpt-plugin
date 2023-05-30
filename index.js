import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import { getOffersByQuery } from './infojobs/jobs.js';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors(
    {
      methods: ['GET'],
      origin: [`http://localhost:${PORT}`, 'https://chat.openai.com']
    }
  ))

app.use(helmet());
app.use(bodyParser.json());
app.use(morgan('[:date[clf]]: :remote-addr ":user-agent" :method :url :status - :response-time ms'));

app.get('/openai.yaml', async (req, res, next) => {
  try {
    const filePath = path.join(process.cwd(), 'openai.yaml')
    const yamlData = await fs.readFile(filePath, 'utf-8')
    res.setHeader('Content-Type', 'text/yaml')
    res.send(yamlData)
  } catch (e) {
    console.error(e.message)
    res.status(500);
  }
})

app.get('/.well-known/ai-plugin.json', (req, res) => {
  res.sendFile(path.join(process.cwd(), '.well-known/ai-plugin.json'))
})

app.get('/logo.png', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'logo.png'))
})

app.get('/search', async (req, res) => {
  const jobs = await getOffersByQuery(req.query);
  return res.json({ jobs })
})

app.listen(PORT, () => {
  console.log('ChatGPT Plugin is listening on port', PORT)
})
