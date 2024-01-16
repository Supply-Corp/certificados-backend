import cors from 'cors'

const ACCEPTED_ORIGINS = [
  'http://localhost:5173',
  'https://certificados.institutoelevateperu.com/*'
]

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors({
  origin: (origin:any, callback:any) => {
    if (acceptedOrigins.includes(origin)) {
      return callback(null, true)
    }

    if (!origin) {
      return callback(null, true)
    }

    return callback(new Error('Not allowed by CORS'))
  }
})