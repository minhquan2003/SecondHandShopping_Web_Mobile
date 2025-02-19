import 'package:flutter/material.dart';
import '/screen2.dart'; // Import màn hình mới

class ProductCard extends StatelessWidget {
  final String name;
  final String price;
  final String imageUrl;

  const ProductCard({
    super.key,
    required this.name,
    required this.price,
    required this.imageUrl,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        // Chuyển đến màn hình mới và truyền tên sản phẩm
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => Screen2(productName: name),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.red,
          borderRadius: BorderRadius.circular(10),
          boxShadow: [
            BoxShadow(
              color: Colors.grey.withOpacity(0.2),
              spreadRadius: 2,
              blurRadius: 5,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Column(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.vertical(top: Radius.circular(10)),
              child: Image.network(
                imageUrl,
                width: double.infinity,
                height: 100,
                fit: BoxFit.cover,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.black),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    price,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                  const SizedBox(height: 4),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}