import express from 'express'
import cors from 'cors'
import { ENV } from './config/env.js'
import job from './config/cron.js'
import authRoutes from './routes/auth.js'
import subjectRoutes from './routes/subjects.js'
import userRoutes from './routes/users.js'
import debugRoutes from './routes/debug.js'
import clerkRoutes from './routes/clerk.js'

export const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.get('/api/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    })
})

app.use('/api/auth', authRoutes)
app.use('/api/subjects', subjectRoutes)
app.use('/api/users', userRoutes)
app.use('/api/debug', debugRoutes)
app.use('/api/clerk', clerkRoutes)

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

// Start cron job
job.start()

// Start server
app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`)
    console.log(`Environment: ${ENV.NODE_ENV}`)
})