require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');
const http = require('http');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 8000;

// Kết nối DB với xử lý lỗi
connectDB().catch(err => {
  console.error('Lỗi kết nối MongoDB:', err);
  process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
});

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Cấu hình lại cho phù hợp với frontend thực tế
    methods: ['GET', 'POST']
  }
});

// Import và khởi tạo logic socket
require('./socket')(io);

server.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});

module.exports = { io };