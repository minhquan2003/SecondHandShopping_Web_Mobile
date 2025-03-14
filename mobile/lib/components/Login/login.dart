import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import '../Home/main_screen.dart';

class Login extends StatefulWidget {
  const Login({super.key});

  @override
  _LoginState createState() => _LoginState();
}

class _LoginState extends State<Login> {
  final TextEditingController emailController = TextEditingController(); // Controller cho email
  final TextEditingController passwordController = TextEditingController(); // Controller cho mật khẩu

  @override
  void dispose() {
    // Giải phóng controller khi không còn sử dụng
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Đăng nhập')),
      body: SingleChildScrollView(
        child: Container(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Center(
                child: Text(
                  'Thông tin đăng nhập',
                  style: TextStyle(fontSize: 16),
                ),
              ),
              const SizedBox(height: 10),
              TextField(
                controller: emailController, // Gán controller cho ô nhập email
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Nhập email',
                ),
              ),
              const SizedBox(height: 20),
              TextField(
                controller: passwordController, // Gán controller cho ô nhập mật khẩu
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  hintText: 'Nhập mật khẩu',
                ),
                obscureText: true, // Ẩn mật khẩu khi nhập
              ),
              const SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      // Xử lý đăng ký
                    },
                    child: const Text('Đăng ký'),
                  ),
                  ElevatedButton(
                    onPressed: () async {
                      final bool checkLogin = await Provider.of<LoginInfo>(context, listen: false).login(
                        emailController.text, 
                        passwordController.text,
                      );
                      
                      if (checkLogin) {
                        // Nếu đăng nhập thành công, điều hướng đến MainScreen
                        Navigator.of(context).pushAndRemoveUntil(
                          MaterialPageRoute(builder: (context) => MainScreen()),
                          (Route<dynamic> route) => false,
                        );
                      } else {
                        // Nếu đăng nhập thất bại, xóa nội dung ô nhập
                        emailController.clear();
                        passwordController.clear();
                        
                        // Hiển thị thông báo
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.')),
                        );
                      }
                    },
                    child: const Text('Đăng nhập'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}