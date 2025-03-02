import 'package:flutter/material.dart';
import '../Product/product_list.dart'; // Đảm bảo rằng bạn có file này
import '../Category/category_list.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            height: 110, // Đặt chiều cao cho Container
            color: Colors.green, // Đặt màu nền cho Container
            child: CategoryList(), // CategoryList nằm trong Container
          ),
          Expanded(
            flex: 3,
            child: ProductList(), // ProductList nằm trong Home
          ),
        ],
      ),
    );
  }
}