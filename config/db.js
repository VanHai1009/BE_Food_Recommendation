const mongoose = require('mongoose');


const connectDB = async () => {
 
  try {
    await mongoose.connect('', {
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