import 'package:flutter/material.dart';
import '../Checkout/checkout.dart';

class ProductDetail extends StatefulWidget {
  final Map<String, dynamic> product;

  const ProductDetail({
    super.key,
    required this.product,
  });

  @override
  _ProductDetailState createState() => _ProductDetailState();
}

class _ProductDetailState extends State<ProductDetail> {
  @override
  Widget build(BuildContext context) {
    final product = widget.product;

    return Scaffold(
      appBar: AppBar(
        title: Text(product['name']),
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.network(
                    product['image_url'],
                    width: double.infinity,
                    height: 250,
                    fit: BoxFit.contain, // Đảm bảo ảnh được hiển thị đầy đủ
                  ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    product['name'],
                    style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Giá: ${product['price']} đ',
                    style: const TextStyle(fontSize: 20, color: Colors.green),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Mô tả:',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    product['description'],
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Thương hiệu: ${product['brand']}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Tình trạng: ${product['condition']}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Xuất xứ: ${product['origin']}',
                    style: const TextStyle(fontSize: 16),
                  ),
                  const SizedBox(height: 100), // Giữ khoảng trống cho nút
                  Text(
                    'Ghi chú:',
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 4),
                  TextField(
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Nhập ghi chú của bạn',
                    ),
                  ),
                  const SizedBox(height: 100),
                ],
              ),
            ),
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              color: Colors.white,
              padding: const EdgeInsets.all(16.0),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      
                    },
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white, 
                      backgroundColor: Colors.green, // Màu chữ
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15), // Padding
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10), // Góc bo
                      ),
                    ),
                    child: const Text('Thêm vào giỏ hàng'),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      final List<dynamic> productList = product.values.toList();
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => CheckOut(products: productList)),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      foregroundColor: Colors.white, backgroundColor: Colors.blue, // Màu chữ
                      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15), // Padding
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10), // Góc bo
                      ),
                    ),
                    child: const Text('Đặt hàng'),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}