require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 8000;

// Kết nối DB với xử lý lỗi
connectDB().catch(err => {
  console.error('Lỗi kết nối MongoDB:', err);
  process.exit(1); // Thoát ứng dụng nếu kết nối thất bại
});

app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});