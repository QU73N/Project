import express from 'express';
import { ENV } from '../config/env.js';

const router = express.Router();

// Clerk webhook for user creation
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const svix_id = req.headers['svix-id'];
    const svix_timestamp = req.headers['svix-timestamp'];
    const svix_signature = req.headers['svix-signature'];

    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.log('Missing webhook headers');
      return res.status(400).json({ error: 'Missing webhook headers' });
    }

    // TODO: Verify webhook signature with CLERK_WEBHOOK_SECRET
    // For now, we'll just log the events
    const events = JSON.parse(req.body);

    console.log('Received Clerk webhook events:', events);

    // Handle different event types
    events.forEach((event) => {
      switch (event.type) {
        case 'user.created':
          console.log('New user created:', event.data);
          // TODO: Create user in database
          break;
        case 'user.updated':
          console.log('User updated:', event.data);
          // TODO: Update user in database
          break;
        case 'session.created':
          console.log('New session created:', event.data);
          break;
        case 'session.ended':
          console.log('Session ended:', event.data);
          break;
        default:
          console.log('Unhandled event type:', event.type);
      }
    });

    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get current user info (protected route)
router.get('/me', async (req, res) => {
  try {
    // This would typically use Clerk's getUser() method
    // For now, return user info if properly authenticated
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization header' });
    }

    // TODO: Verify Clerk session token
    // For now, this is a placeholder
    
    res.json({ 
      message: 'Clerk integration placeholder',
      note: 'Implement proper Clerk session verification'
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
