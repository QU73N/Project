import express from 'express'
import { ENV } from './config/env.js'

export const app = express()

app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true })
})
app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`)
})