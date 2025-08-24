import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Simple UUID generator function
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${generateUUID()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req: any, file: any, cb: any) => {
  // Allow images, documents, and common file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
    'text/csv',
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Upload file
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { taskId, projectId, description } = req.body;
    const userId = req.user.id;

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        name: req.file.originalname,
        url: req.file.filename,
        mimeType: req.file.mimetype,
        size: req.file.size,
        projectId: projectId || 'default-project-id', // Required field
        uploaderId: userId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: {
        file: fileRecord,
        url: `/api/uploads/${fileRecord.url}`,
      },
    });
  } catch (error) {
    console.error('File upload error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload file',
    });
  }
});

// Get files for a task
router.get('/task/:taskId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { taskId } = req.params;
    const userId = req.user.id;

    // Check if user has access to the task
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      },
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or access denied',
      });
    }

    const files = await prisma.file.findMany({
      where: {
        projectId: task.projectId, // Use projectId instead of taskId
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: {
        files: files.map((file: any) => ({
          ...file,
          url: `/api/uploads/${file.url}`,
        })),
      },
    });
  } catch (error) {
    console.error('Get files error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get files',
    });
  }
});

// Get files for a project
router.get('/project/:projectId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { ownerId: userId },
          {
            members: {
              some: {
                userId: userId,
              },
            },
          },
        ],
      },
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied',
      });
    }

    const files = await prisma.file.findMany({
      where: {
        projectId: projectId,
      },
      include: {
        uploader: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json({
      success: true,
      data: {
        files: files.map((file: any) => ({
          ...file,
          url: `/api/uploads/${file.url}`,
        })),
      },
    });
  } catch (error) {
    console.error('Get project files error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get project files',
    });
  }
});

// Download file
router.get('/:filename', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { filename } = req.params;
    const userId = req.user.id;

    if (!filename) {
      return res.status(400).json({
        success: false,
        message: 'Filename is required',
      });
    }

    const file = await prisma.file.findFirst({
      where: {
        url: filename,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied',
      });
    }

    const filePath = path.join(__dirname, '../../uploads', filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found on disk',
      });
    }

    return res.download(filePath, file.name);
  } catch (error) {
    console.error('File download error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to download file',
    });
  }
});

// Delete file
router.delete('/:fileId', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const { fileId } = req.params;
    const userId = req.user.id;

    const file = await prisma.file.findFirst({
      where: {
        id: fileId,
        project: {
          OR: [
            { ownerId: userId },
            {
              members: {
                some: {
                  userId: userId,
                },
              },
            },
          ],
        },
      },
    });

    if (!file) {
      return res.status(404).json({
        success: false,
        message: 'File not found or access denied',
      });
    }

    // Delete file from disk
    const filePath = path.join(__dirname, '../../uploads', file.url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete from database
    await prisma.file.delete({
      where: {
        id: fileId,
      },
    });

    return res.json({
      success: true,
      message: 'File deleted successfully',
    });
  } catch (error) {
    console.error('File deletion error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete file',
    });
  }
});

export default router; 