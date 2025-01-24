import 'package:flutter/material.dart';
import 'screen1.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Navigation Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: const Screen1(),
      debugShowCheckedModeBanner: false, // Tắt biểu ngữ debug
      routes: {
        '/screen1': (context) => const Screen1(),
        // Bạn có thể thêm các màn hình khác ở đây
      },
    );
  }
}