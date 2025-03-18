import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config.dart';
import '../../utils/convert.dart';
// import '../Product/product_detail.dart';
import '../Home/main_screen.dart';

class Cart extends StatefulWidget {
  const Cart({super.key});

  @override
  _CartState createState() => _CartState();
}

class _CartState extends State<Cart> {
  late LoginInfo loginInfo;
  List<dynamic> productCart = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchCart(loginInfo.id);
  }

  Future<void> fetchCart(idUser) async {
    final response = await http.get(Uri.parse('http://$ip:5555/carts/$idUser'));

    if (response.statusCode == 200) {
      setState(() {
        productCart = json.decode(response.body);
        isLoading = false;
      });
    } else {
      throw Exception('Failed to load products in cart');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Giỏ hàng'),
      ),
      body: isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Padding(
            padding: const EdgeInsets.all(4.0),
            child: ListView.builder(
              itemCount: productCart.length,
              itemBuilder: (context, index) {
                final product = productCart[index];
                return Container(
                  child: GestureDetector( // Thêm GestureDetector để nhận sự kiện nhấn
                    onTap: () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) => MainScreen(), // Giả định bạn đã định nghĩa ProductDetail
                        ),
                      );
                    },
                    child: Card(
                      child: Padding(
                        padding: const EdgeInsets.all(16.0),
                        child: Row(
                          children: [
                            Container(
                              width: 70,
                              height: 70, // Đặt chiều cao cụ thể cho hình ảnh
                              child: Image.network(
                                product['product_imageUrl'],
                                fit: BoxFit.cover,
                              ),
                            ),
                            SizedBox(width: 10), // Khoảng cách giữa hình ảnh và văn bản
                            Expanded( // Để đảm bảo Column có đủ không gian
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 120, // Đặt chiều rộng cho Container
                                    child: Text(
                                      product['product_name'],
                                      style: TextStyle(fontSize: 14),
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      softWrap: false,
                                    ),
                                  ),
                                  Text(
                                    '${formatPrice(product['product_price'])}đ',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                  Text(
                                    'Số lượng: x${product['product_quantity']}',
                                    style: TextStyle(fontSize: 14),
                                  ),
                                ],
                              ),
                            ),
                            Container(
                              child: Text('${product['product_quantity']} * '),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
          ),
    );
  }
}