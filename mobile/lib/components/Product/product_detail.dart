import 'dart:convert';
import 'package:flutter/material.dart';
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
    // Lắng nghe sự thay đổi trong ô nhập liệu
    _quantityController.addListener(() {
      String text = _quantityController.text;
      if (text.isEmpty) {
        // Nếu ô nhập liệu rỗng, không cập nhật quantity
        return;
      }

      int? newValue = int.tryParse(text);
      if (newValue != null && newValue > 0) {
        setState(() {
          quantity = newValue; // Cập nhật giá trị quantity
        });
      } else {
        // Nếu giá trị không hợp lệ, đặt lại ô nhập liệu thành 1
        _quantityController.text = '1'; // Cập nhật lại ô nhập liệu
        _quantityController.selection = TextSelection.fromPosition(TextPosition(offset: 1)); // Đặt con trỏ ở cuối
      }
    });
  }

  @override
  void dispose() {
    _quantityController.dispose(); // Giải phóng controller
    super.dispose();
  }

Future<List<dynamic>> getCartItemsByUserId(String userId) async {
  try {
    final response = await http.get(Uri.parse('http://$ip:5555/carts/$userId'));

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data; // Trả về danh sách sản phẩm trong giỏ hàng
    } else {
      throw Exception('Failed to load cart items');
      
    }
  } catch (error) {
    print('Error fetching cart items: $error');
    throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
  }
}

  void addToCart(String ub, String us, String pid, String pn, int quantityMax, int pqs, int pp, String pu) async {
  // Lấy danh sách sản phẩm trong giỏ hàng
  final productInCart = await getCartItemsByUserId(ub);

  // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
  final isProductInCart = productInCart.any((item) => item['product_id'] == pid);

  if (isProductInCart) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Sản phẩm đã có trong giỏ hàng!')),
    );
    return;
  }

  // Kiểm tra số lượng nhập
  if (pqs <= 0 || pqs > quantityMax) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Số lượng nhập không hợp lệ!')),
    );
    return;
  }

  // Tạo đối tượng sản phẩm
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

  // Gửi yêu cầu thêm sản phẩm vào giỏ hàng
  try {
    final response = await http.post(
      Uri.parse('http://$ip:5555/carts'), // Thay <IP> bằng địa chỉ IP thực tế
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
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('Hãy đăng nhập để có trải nghiệm tốt hơn')),
                );
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
                  const SizedBox(height: 4), // Giữ khoảng trống cho nút
                  TextField(
                    controller: _quantityController,
                    keyboardType: TextInputType.number,
                    decoration: InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Nhập số lượng',
                    ),
                  ),
                  const SizedBox(height: 70),
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
                      addToCart(
                        loginInfo.id ?? '',
                        product['user_id'],
                        product['_id'],
                        product['name'],
                        product['quantity'],
                        quantity, // Sử dụng giá trị quantity từ ô nhập
                        product['price'],
                        product['image_url'],
                      );
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
                      foregroundColor: Colors.white, 
                      backgroundColor: Colors.blue, // Màu chữ
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