# BE_cua_toi

## Mô tả
Dự án backend Node.js sử dụng Express và kết nối MongoDB bằng Mongoose.

## Cài đặt

1. Cài Node.js và MongoDB trên máy.
2. Clone hoặc tải mã nguồn về.
3. Cài đặt package:
   ```bash
   npm install
   ```
4. Tạo file `.env` với nội dung ví dụ:
   ```env
   MONGODB_URI=mongodb://localhost:27017/be_cua_toi
   PORT=3000
   ```
5. Khởi động MongoDB (nếu chưa chạy):
   ```bash
   mongod
   ```
6. Chạy server:
   ```bash
   node index.js
   ```

Truy cập: [http://localhost:3000](http://localhost:3000) 