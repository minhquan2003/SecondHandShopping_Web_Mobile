import 'package:flutter/material.dart';
import '../Login/login.dart';

class BeforeLogin extends StatelessWidget {
  const BeforeLogin({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Đăng nhập'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('Bạn chưa đăng nhập'),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Login()),
                );
              },
              child: const Text('Đăng nhập'),
            ),
          ],
        ),
      ),
    );
  }
}
