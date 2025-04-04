import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/PostProduct/post_edit_product.dart';
import '../Checkout/checkout.dart';
import '../../utils/convert.dart';
import '../Cart/cart.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';

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
  int quantity = 1;
  final TextEditingController _quantityController = TextEditingController(text: '1');

  @override
  void initState() {
    super.initState();
    _quantityController.addListener(() {
      String text = _quantityController.text;
      if (text.isEmpty) {
        return;
      }

      int? newValue = int.tryParse(text);
      if (newValue != null && newValue > 0) {
        setState(() {
          quantity = newValue;
        });
      } else {
        _quantityController.text = '1';
        _quantityController.selection = TextSelection.fromPosition(TextPosition(offset: 1));
      }
    });
  }

  @override
  void dispose() {
    _quantityController.dispose();
    super.dispose();
  }

  Future<List<dynamic>> getCartItemsByUserId(String userId) async {
    try {
      final response = await http.get(Uri.parse('http://$ip:5555/carts/$userId'));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        throw Exception('Failed to load cart items');
      }
    } catch (error) {
      print('Error fetching cart items: $error');
      throw error;
    }
  }

  void addToCart(String ub, String us, String pid, String pn, int quantityMax, int pqs, int pp, String pu) async {
    final productInCart = await getCartItemsByUserId(ub);
    final isProductInCart = productInCart.any((item) => item['product_id'] == pid);

    if (isProductInCart) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Sản phẩm đã có trong giỏ hàng!')),
      );
      return;
    }
  
    if (pqs <= 0 || pqs > quantityMax) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Số lượng nhập không hợp lệ!')),
      );
      return;
    }

    Map<String, dynamic> product = {
      'user_buyer': ub,
      'user_seller': us,
      'product_id': pid,
      'product_name': pn,
      'product_quantity': pqs,
      'product_price': pp,
      'product_imageUrl': pu,
    };

    String jsonProduct = jsonEncode(product);

    try {
      final response = await http.post(
        Uri.parse('http://$ip:5555/carts'),
        headers: {'Content-Type': 'application/json'},
        body: jsonProduct,
      );
      if (response.statusCode == 201) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Sản phẩm đã được thêm vào giỏ hàng thành công!')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Có lỗi khi thêm sản phẩm!')),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Có lỗi khi gửi yêu cầu!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final product = widget.product;
    final loginInfo = Provider.of<LoginInfo>(context);

    return Scaffold(
      appBar: AppBar(
        title: Text(product['name']),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () {
              if (loginInfo.name == null) {
                final snackBar = SnackBar(content: Text('Hãy đăng nhập để có trải nghiệm tốt hơn'));
                ScaffoldMessenger.of(context).showSnackBar(snackBar);
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Cart()),
                );
              }
            },
          ),
        ],
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
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
                        fit: BoxFit.contain,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Text(
                      product['name'],
                      style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Giá: ${formatPrice(product['price'])} đ',
                      style: const TextStyle(fontSize: 20, color: Colors.green),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Còn lại: ${product['quantity']}',
                      style: const TextStyle(fontSize: 16),
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
                    const SizedBox(height: 8), // Giữ khoảng trống cho nút
                    TextField(
                      controller: _quantityController,
                      keyboardType: TextInputType.number,
                      decoration: InputDecoration(
                        border: OutlineInputBorder(),
                        hintText: 'Nhập số lượng',
                      ),
                    ),
                    if(product['user_id'] == loginInfo.id)
                      Column(children: [
                        Center(child: Text('Đây là sản phẩm của bạn')),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceAround,
                          children: [
                          ElevatedButton.icon(onPressed: 
                            () => {
                              Navigator.push(context,
                              MaterialPageRoute(builder: (context) => PostEditProduct(product: product)))
                            }, 
                            label: Text('Chỉnh sửa'),
                            icon: Icon(Icons.edit),
                          ),
                          ElevatedButton.icon(onPressed: 
                            () => {

                            }, 
                            label: Text('Xoá'),
                            icon: Icon(Icons.delete),
                          )
                        ],)
                      ],)
                  ],
                ),
              ),
            ),
          ),
          Container(
            color: Colors.white,
            // padding: const EdgeInsets.all(16.0),
            child: Row(
              // mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: () {
                      if (loginInfo.name == null) {
                        final snackBar = SnackBar(content: Text('Hãy đăng nhập để có trải nghiệm tốt hơn'));
                        ScaffoldMessenger.of(context).showSnackBar(snackBar);
                      } else {
                        addToCart(
                          loginInfo.id ?? '',
                          product['user_id'],
                          product['_id'],
                          product['name'],
                          product['quantity'],
                          quantity,
                          product['price'],
                          product['image_url'],
                        );
                      }
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.green, // Màu 
                      minimumSize: Size(double.infinity, 50),
                      // padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                    ),
                    child: const Text('Thêm vào giỏ hàng', style: TextStyle(color: Colors.white)),
                  ),
                ),
                Expanded(
                  flex: 2,
                  child: ElevatedButton(
                    onPressed: () {
                      List<dynamic> product1 = [{
                        'user_buyer': loginInfo.id ?? '',
                        'user_seller': product['user_id'],
                        'product_id': product['_id'],
                        'product_name': product['name'],
                        'product_quantity': quantity,
                        'product_price': product['price'],
                        'product_imageUrl': product['image_url'],
                      }];                     
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (context) => CheckOut(products: product1)),
                      );
                    },
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.red, // Màu nền
                      // padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 15),
                      minimumSize: Size(double.infinity, 50),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(0),
                      ),
                    ),
                    child: const Text('Đặt hàng', style: TextStyle(color: Colors.white,))
                  ),
                )
              ],
            ),
          ),
        ],
      ),
    );
  }
}