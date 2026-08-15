export const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'TaskHub Pro API Reference',
    version: '1.0.0',
    description: 'REST API documentation for TaskHub Pro Internal Task & Management Dashboard.',
    contact: {
      name: 'Development Team',
      email: 'kamalpreet@example.com'
    }
  },
  servers: [
    {
      url: '/api',
      description: 'Local Proxy API Gateway'
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your JWT token to authorize requests. Format: Bearer <TOKEN>'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'user-id-123' },
          name: { type: 'string', example: 'Kamalpreet Singh' },
          email: { type: 'string', example: 'kamalpreet@example.com' },
          role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'MEMBER'], example: 'ADMIN' },
          avatar: { type: 'string', example: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kamalpreet' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Task: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'task-id-abc' },
          title: { type: 'string', example: 'Configure Redis Caching Layer' },
          description: { type: 'string', example: 'Implement cache-aside queries for API endpoints' },
          status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'], example: 'IN_PROGRESS' },
          priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], example: 'HIGH' },
          dueDate: { type: 'string', format: 'date', example: '2026-08-30' },
          assignedToId: { type: 'string', example: 'user-id-123' },
          externalClient: { type: 'string', example: 'Leanne Graham' },
          createdById: { type: 'string', example: 'admin-id-456' }
        }
      },
      Comment: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'comment-id-789' },
          content: { type: 'string', example: 'Redis installation complete. Testing endpoints now.' },
          taskId: { type: 'string', example: 'task-id-abc' },
          userId: { type: 'string', example: 'user-id-123' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      },
      Notification: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'notif-id-444' },
          type: { type: 'string', example: 'STATUS_CHANGED' },
          message: { type: 'string', example: 'Task Configure Redis Caching status changed to COMPLETED' },
          read: { type: 'boolean', example: false },
          userId: { type: 'string', example: 'user-id-123' },
          createdAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  },
  paths: {
    '/health': {
      get: {
        summary: 'Server Health Check',
        description: 'Verify if the API server is active and retrieve status metrics.',
        responses: {
          200: {
            description: 'API is running successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'API is running' },
                    data: {
                      type: 'object',
                      properties: {
                        status: { type: 'string', example: 'healthy' },
                        uptime: { type: 'number', example: 124.5 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/auth/login': {
      post: {
        summary: 'User Login Authentication',
        description: 'Verify login credentials and return a Bearer JWT Token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'kamalpreet@example.com' },
                  password: { type: 'string', format: 'password', example: 'password' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Authentication successful.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Login successful' },
                    data: {
                      type: 'object',
                      properties: {
                        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
                        user: { $ref: '#/components/schemas/User' }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Invalid credentials.'
          }
        }
      }
    },
    '/auth/logout': {
      post: {
        summary: 'User Session Logout',
        description: 'Clears active credentials cookies or states.',
        responses: {
          200: {
            description: 'Logout completed successfully.'
          }
        }
      }
    },
    '/auth/me': {
      get: {
        summary: 'Get Current Logged-in User Profile',
        description: 'Fetches profile metadata of the user linked to the active Bearer JWT token.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Active profile details.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized token.'
          }
        }
      }
    },
    '/users': {
      get: {
        summary: 'Get Users Directory List',
        description: 'Retrieve users list for assignees lists dropdown selections.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'List of users retrieved.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/User' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create User Profile',
        description: 'Admin/Manager level route to add a new employee profile.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password', 'role'],
                properties: {
                  name: { type: 'string', example: 'Suraj Kumar' },
                  email: { type: 'string', example: 'suraj@example.com' },
                  password: { type: 'string', example: 'securepassword123' },
                  role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'MEMBER'], example: 'MEMBER' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'User created successfully.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/users/{id}': {
      get: {
        summary: 'Get User Metadata by ID',
        description: 'Get profile details of a single user.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'User details found.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          }
        }
      },
      put: {
        summary: 'Update User Profile Details',
        description: 'Admin/Manager level route to update user fields.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'Suraj Kumar Edit' },
                  role: { type: 'string', enum: ['ADMIN', 'MANAGER', 'MEMBER'], example: 'MANAGER' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'User updated.'
          }
        }
      },
      delete: {
        summary: 'Delete User Account',
        description: 'Admin exclusive action to delete a user profile.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'User profile terminated.'
          }
        }
      }
    },
    '/tasks': {
      get: {
        summary: 'Search, Filter, and Paginate Tasks',
        description: 'Query task lists with pagination, status filtering, and query strings.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
          { name: 'priority', in: 'query', schema: { type: 'string' } },
          { name: 'search', in: 'query', schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Paginated lists.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Task' }
                    },
                    meta: {
                      type: 'object',
                      properties: {
                        totalItems: { type: 'integer', example: 25 },
                        totalPages: { type: 'integer', example: 3 }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Create New Task',
        description: 'Creates a new task. Supports linking external Client.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['title'],
                properties: {
                  title: { type: 'string', example: 'Setup SSL Certificate' },
                  description: { type: 'string', example: 'Install secure certificates on the gateway server' },
                  status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'], example: 'PENDING' },
                  priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], example: 'MEDIUM' },
                  dueDate: { type: 'string', format: 'date', example: '2026-08-25' },
                  assignedToId: { type: 'string', example: 'user-uuid-123' },
                  externalClient: { type: 'string', example: 'Leanne Graham' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Task created.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: { $ref: '#/components/schemas/Task' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/tasks/{id}': {
      get: {
        summary: 'Get Detailed Task Metrics',
        description: 'Includes assignee details, comments, and client metrics.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Task details found.'
          }
        }
      },
      put: {
        summary: 'Update Task Properties',
        description: 'Triggers activity logs and notification dispatch engines on updates.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED', 'BLOCKED'] },
                  priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'] },
                  assignedToId: { type: 'string' },
                  externalClient: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Task updated.'
          }
        }
      },
      delete: {
        summary: 'Delete Task Record',
        description: 'Admin/Manager level action to remove a task.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Task deleted successfully.'
          }
        }
      }
    },
    '/tasks/{id}/activity': {
      get: {
        summary: 'Get Task Audit Activity Timeline',
        description: 'Get list of activity edits for a specific task.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Audit history list.'
          }
        }
      }
    },
    '/tasks/{id}/comments': {
      get: {
        summary: 'Get Task Discussion Thread Comments',
        description: 'Retrieve chronological list of comments.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Discussion thread list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Comment' }
                    }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        summary: 'Add Discussion Thread Comment',
        description: 'Post a new comment. Automatically notifies assignees.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['content'],
                properties: {
                  content: { type: 'string', example: 'Setup verification tests finished.' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Comment posted.'
          }
        }
      }
    },
    '/notifications': {
      get: {
        summary: 'Get Active User Notifications',
        description: 'Retrieve alerts matching roles or direct assignments.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Notifications list.',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Notification' }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/notifications/read': {
      patch: {
        summary: 'Mark All Notifications as Read',
        description: 'Update status of all active user alerts to read.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'All notifications updated.'
          }
        }
      }
    },
    '/notifications/{id}/read': {
      patch: {
        summary: 'Mark Specific Notification as Read',
        description: 'Update status of a specific alert.',
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } }
        ],
        responses: {
          200: {
            description: 'Notification updated.'
          }
        }
      }
    },
    '/dashboard': {
      get: {
        summary: 'Compile Dashboard Performance Statistics',
        description: 'Get counts for total tasks, status, and activity timeline logs.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Statistics compilation.'
          }
        }
      }
    },
    '/external/users': {
      get: {
        summary: 'Get Synced External Directory Contacts',
        description: 'Fetches cached/live records from the configured custom API gateway URL.',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Directory records list.'
          }
        }
      }
    },
    '/external/settings': {
      get: {
        summary: 'Get Custom API Gateway Settings',
        description: 'Retrieve dynamic configurations (Admin/Manager scope only).',
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            description: 'Integration configuration settings.'
          }
        }
      },
      post: {
        summary: 'Update API Gateway Configuration',
        description: 'Save URL and Headers configurations and clear active caches.',
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['apiUrl'],
                properties: {
                  apiUrl: { type: 'string', example: 'https://randomuser.me/api/?results=10' },
                  apiHeaders: { type: 'string', example: '{"Authorization": "Bearer TokenKey"}' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'API Gateway configurations updated.'
          }
        }
      }
    }
  }
};
