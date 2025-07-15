const Chat = require('./models/Chat');
const User = require('./models/User');

module.exports = (io) => {
  // Lưu map userId <-> socketId
  const userSocketMap = new Map();

  io.on('connection', (socket) => {
    // Khi user đăng nhập, gửi userId lên để join room
    socket.on('join', async (userId) => {
      // Xác thực userId có tồn tại không
      const user = await User.findById(userId);
      if (!user) {
        socket.emit('join_error', { message: 'UserId không hợp lệ hoặc chưa đăng nhập.' });
        return;
      }
      userSocketMap.set(userId, socket.id);
      socket.join(userId); // mỗi user join vào room riêng theo userId
      // Gửi lịch sử chat về cho user này
      const chats = await Chat.find({ $or: [ { from: userId }, { to: userId } ] }).sort({ timestamp: 1 });
      socket.emit('chat_history', chats);
    });

    // Lắng nghe sự kiện gửi tin nhắn
    socket.on('private_message', async ({ from, to, message }) => {
      // Lưu tin nhắn vào database
      try {
        await Chat.create({ from, to, message });
      } catch (err) {
        console.error('Lỗi lưu tin nhắn:', err);
      }
      // Gửi tin nhắn tới user nhận (theo userId)
      io.to(to).emit('private_message', { from, to, message });
      io.to(from).emit('private_message', { from, to, message }); // Thêm dòng này!
    });

    // Xử lý khi user disconnect
    socket.on('disconnect', () => {
      for (const [userId, sId] of userSocketMap.entries()) {
        if (sId === socket.id) {
          userSocketMap.delete(userId);
          break;
        }
      }
    });
  });
}; 