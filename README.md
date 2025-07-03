# BE_Food_Recommendation

## Mô tả
Dự án backend Node.js sử dụng Express và MongoDB (Mongoose) cho hệ thống quản lý công thức món ăn, đăng ký/đăng nhập, xác thực JWT.

## Tính năng chính
- Đăng ký, đăng nhập, xác thực người dùng bằng JWT
- CRUD công thức món ăn (chỉ tác giả mới được sửa/xóa công thức của mình)
- Lưu thông tin người dùng, công thức, bình luận, đánh giá

## Cài đặt

1. **Yêu cầu:**
   - Node.js >= 14
   - MongoDB >= 4

2. **Clone dự án:**
   ```bash
   git clone https://github.com/VanHai1009/BE_Food_Recommendation.git
   cd BE_Food_Recommendation
   ```

3. **Cài đặt package:**
   ```bash
   npm install
   ```

4. **Tạo file cấu hình môi trường `.env`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/be_cua_toi
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

5. **Khởi động MongoDB (nếu chưa chạy):**
   ```bash
   mongod
   ```

6. **Chạy server:**
   ```bash
   node server.js
   ```

Truy cập: [http://localhost:8000](http://localhost:8000)

## Một số API cơ bản

- `POST   /users/register`   Đăng ký tài khoản
- `POST   /users/login`      Đăng nhập, nhận JWT
- `GET    /users/me`         Lấy thông tin người dùng hiện tại
- `POST   /recipes`          Thêm công thức (yêu cầu đăng nhập)
- `PATCH  /recipes/:id`      Cập nhật công thức (chỉ tác giả)
- `GET    /recipes`          Lấy danh sách công thức
- `GET    /recipes/:id`      Lấy chi tiết công thức

## Đóng góp
Mọi đóng góp, issue hoặc pull request đều được hoan nghênh! 