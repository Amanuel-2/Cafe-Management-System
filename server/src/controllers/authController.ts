import { Request, Response } from 'express';

const mockUsers = [
  { id: 'u1', name: 'Admin User', email: 'admin@cafe.test', role: 'admin' },
  { id: 'u2', name: 'Maya Chen', email: 'waiter@cafe.test', role: 'waiter' },
  { id: 'u3', name: 'Leo Martin', email: 'chef@cafe.test', role: 'chef' },
];

export const authController = {
  login: (req: Request, res: Response) => {
    const { email } = req.body;

    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  },
};
