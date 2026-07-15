import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import memberRoutes from './routes/member.routes';
import attendanceRoutes from './routes/attendance.routes';
import titheRoutes from './routes/tithe.routes';
import dashboardRoutes from './routes/dashboard.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/tithes', titheRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Church Management System API is running.' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
