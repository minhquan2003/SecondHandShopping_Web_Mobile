import 'package:flutter/material.dart';
import 'product_detail.dart'; // Import màn hình mới

class ProductCard extends StatelessWidget {
  final Map<String, dynamic> product;

  const ProductCard({
    super.key,
    required this.product,
  });

  @override
  Widget build(BuildContext context) {
    // Lấy các thuộc tính từ đối tượng product
    final String name = product['name'];
    final String price = "${product['price']} đ"; // Chuyển giá thành chuỗi với đơn vị
    final String imageUrl = product['image_url'];
    // final String description = product['description'] ?? 'Không có mô tả'; // Mô tả sản phẩm

    return GestureDetector(
      onTap: () {
        // Chuyển đến màn hình mới và truyền tên sản phẩm
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ProductDetail(product: product),
          ),
        );
      },
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(5),
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
              borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
              child: Image.network(
                imageUrl,
                width: double.infinity,
                height: 170,
                fit: BoxFit.contain,
              ),
            ),
            Padding(
              padding: const EdgeInsets.all(4.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    name,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.black,),
                      maxLines: 1, // Giới hạn số dòng là 1
                      overflow: TextOverflow.ellipsis, // Sử dụng ba chấm khi vượt quá chiều dài
                  ),
                  const SizedBox(height: 4),
                  Text(
                    price,
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.green),
                  ),
                  const SizedBox(height: 4),
                  // Text(
                  //   description,
                  //   style: const TextStyle(fontSize: 5, color: Colors.black54),
                  // ),
                  // const SizedBox(height: 4),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}