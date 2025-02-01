import 'package:flutter/material.dart';
import 'components/Product/product_list.dart';

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
        scaffoldBackgroundColor: Colors.blue,
        // dialogBackgroundColor: Colors.yellow
      ),
      home: const ProductList(),
      debugShowCheckedModeBanner: false,
    );
  }
}