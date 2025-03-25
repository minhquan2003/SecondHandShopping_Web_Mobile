import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import './components/Home/main_screen.dart';

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => LoginInfo(),
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Navigation Example',
      theme: ThemeData(
        primarySwatch: Colors.blue,
        scaffoldBackgroundColor: Colors.white,
      ),
      home: MainScreen(), // Chuyển đến MainScreen
      debugShowCheckedModeBanner: false,
    );
  }
}
