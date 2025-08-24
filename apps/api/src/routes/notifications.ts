import { Router } from 'express';

const router = Router();

// Get notifications
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Get notifications endpoint - to be implemented'
  });
});

// Mark notification as read
router.put('/:id/read', (req, res) => {
  res.json({
    success: true,
    message: 'Mark notification as read endpoint - to be implemented'
  });
});

export default router; 
 