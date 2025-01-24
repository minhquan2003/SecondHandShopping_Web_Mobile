import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key});

  @override
  Widget build(BuildContext context){
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Màn Hình 1'),
      // ),
      body: Center(
        child: const Text('Chuyển qua Màn Hình 2'),
      ),
    );
  }
}