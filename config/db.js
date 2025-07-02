const mongoose = require('mongoose');


const connectDB = async () => {
 
  try {
    await mongoose.connect('mongodb+srv://tranhai1009:002012@cluster0.xpdomyq.mongodb.net/Food_Recommendation?retryWrites=true&w=majority&appName=Cluster0', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Đã kết nối MongoDB!');
  } catch (err) {
    console.error('Lỗi kết nối MongoDB:', err);
    process.exit(1);
  }
};

module.exports = connectDB; 