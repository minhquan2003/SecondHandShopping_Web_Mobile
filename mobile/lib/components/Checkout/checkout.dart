import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:mobile/utils/convert.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../../config.dart';
import 'payment_info.dart';
import '../Home/main_screen.dart';

class CheckOut extends StatefulWidget {
  final List<dynamic> products;
  const CheckOut({
    super.key,
    required this.products,
  });

  @override
  _CheckOutState createState() => _CheckOutState();
}

class _CheckOutState extends State<CheckOut> {
  late LoginInfo loginInfo;
  late List<dynamic> productCart;
  late List<TextEditingController> noteControllers; // Danh sách controller cho lời nhắn

  final TextEditingController fullName = TextEditingController();
  final TextEditingController phoneNumber = TextEditingController();
  final TextEditingController address = TextEditingController();
  final TextEditingController email = TextEditingController();
  String? _paymentMethod;

  @override
  void initState() {
    super.initState();
    productCart = widget.products; // Khởi tạo productCart
    loginInfo = Provider.of<LoginInfo>(context, listen: false);

    // Chỉ khởi tạo noteControllers nếu productCart không rỗng
    if (productCart.isNotEmpty) {
      noteControllers = List.generate(productCart.length, (index) => TextEditingController());
    } else {
      noteControllers = []; // Hoặc khởi tạo với một danh sách trống
    }

    if (loginInfo.name != null) {
      fullName.text = loginInfo.name!;
      phoneNumber.text = loginInfo.phone!;
      address.text = loginInfo.address!;
      email.text = loginInfo.email!;
    }
  }

  List<Map<String, dynamic>> createUpdatedProductList() {
  return List<Map<String, dynamic>>.generate(productCart.length, (index) {
    return {
      ...productCart[index], // Lấy dữ liệu từ sản phẩm hiện tại
      'note': noteControllers[index].text, // Thêm thuộc tính note
    };
  });
}

  String sumPriceAll(List<dynamic> pros) {
    int sumAll = 0;
    for (var pro in pros) {
      int quantity = pro['product_quantity'] as int; 
      int price = pro['product_price'].toInt();
      sumAll += quantity * price;
    }
    return formatPrice(sumAll);
  }

  String priceOfOne(price, quantity){
    final sum = price * quantity;
    return formatPrice(sum);
  }

  Future<dynamic> updateProduct({required String id, required int quantity}) async {
    final String url = 'http://$ip:5555/products/quanlity'; // Thay <IP> bằng địa chỉ IP thực tế
    try {
      final response = await http.put(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'id': id,
          'quanlity': quantity,
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        return data;
      } else {
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to update product');
      }
    } catch (error) {
      print('Error updating product: $error');
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
  }

  Future<dynamic> createOrder(Map<String, dynamic> info) async {
    final String url = 'http://$ip:5555/orders'; // Thay IP bằng địa chỉ IP thực tế

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Nếu yêu cầu thành công, trả về dữ liệu
        final data = jsonDecode(response.body);
        return data;
      } else {
        // Nếu có lỗi từ server
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create order');
      }
    } catch (error) {
      print('Error creating order: $error');
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
  }

  Future<dynamic> createOrderDetail(Map<String, dynamic> info) async {
    final String url = 'http://$ip:5555/orderdetails'; // Thay IP bằng địa chỉ IP thực tế

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(info), // Chuyển đổi thông tin sang định dạng JSON
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Nếu yêu cầu thành công, trả về dữ liệu
        final data = jsonDecode(response.body);
        return data;
      } else {
        // Nếu có lỗi từ server
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create order detail');
      }
    } catch (error) {
      print('Error creating order detail: $error');
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
  }

  Future<dynamic> createNotification(Map<String, dynamic> notification) async {
    final String url = 'http://$ip:5555/notifications'; // Thay IP bằng địa chỉ IP thực tế

    try {
      final response = await http.post(
        Uri.parse(url),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode(notification), // Chuyển đổi thông báo sang định dạng JSON
      );

      if (response.statusCode == 200 || response.statusCode == 201) {
        // Nếu yêu cầu thành công, trả về dữ liệu
        final data = jsonDecode(response.body);
        return data;
      } else {
        // Nếu có lỗi từ server
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to create notification');
      }
    } catch (error) {
      print('Error creating notification: $error');
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
  }

  Future<void> removeFromCart(String id) async {
    final String url = 'http://$ip:5555/carts/$id'; // Thay IP bằng địa chỉ IP thực tế

    try {
      final response = await http.delete(Uri.parse(url));

      if (response.statusCode != 204) {
        // Nếu có lỗi từ server
        print('Error: ${response.statusCode} - ${response.body}');
        throw Exception('Failed to remove item from cart');
      }
    } catch (error) {
      print('Error removing item from cart: $error');
      throw error; // Ném lỗi để có thể xử lý ở nơi gọi hàm này
    }
  }

  Future<void> handleCheckout() async {
    List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
    if (fullName.text.isEmpty || phoneNumber.text.isEmpty || address.text.isEmpty) {
      print("Vui lòng nhập đầy đủ thông tin: Họ tên, Số điện thoại và Địa chỉ.");
      return; // Dừng thực hiện nếu có trường không hợp lệ
    }

    final phonePattern = RegExp(r'^0\d{9}$');
    if (!phonePattern.hasMatch(phoneNumber.text)) {
      print("Số điện thoại phải gồm 10 số và bắt đầu bằng số 0!");
      return; // Dừng thực hiện nếu số điện thoại không hợp lệ
    }

    if (productCart.isEmpty) {
      print("Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.");
      return; // Dừng thực hiện nếu giỏ hàng trống
    }

    for (int index = 0; index < updatedProducts.length; index++) {
      var product = updatedProducts[index];

      if (product['user_seller'] == null || 
          product['product_price'] == null || 
          product['product_quantity'] == null || 
          product.isEmpty) {
        print("Thông tin sản phẩm không hợp lệ. Vui lòng kiểm tra lại.");
        return; // Dừng thực hiện nếu thông tin sản phẩm không hợp lệ
      }

      int quantity = -product['product_quantity'];
      String id = product['product_id'];
      final resultquanli = await updateProduct(id: id, quantity: quantity);

      if (resultquanli['quantity'] < 0 || 
          resultquanli['status'] == false || 
          resultquanli['approve'] == false) {
        print("Sản phẩm của bạn đã không còn hàng. Vui lòng tìm sản phẩm khác.");
        try {
          int qua = product['product_quantity'];
          final result = await updateProduct(id: id, quantity: qua);
          print('Product updated successfully: $result');
          return;
        } catch (e) {
          print('Failed to update product: $e');
        }
      }

      var order = await createOrder({
        'user_id_buyer': product['user_buyer'],
        'user_id_seller': product['user_seller'],
        'name': fullName.text, // Sử dụng fullName.text
        'phone': phoneNumber.text, // Sử dụng phoneNumber.text
        'address': address.text, // Sử dụng address.text
        'total_amount': product['product_price'] * product['product_quantity'], // Tổng tiền
        'note': product['note'],
      });

      await createOrderDetail({
        'order_id': order['data']['_id'],
        'product_id': product['product_id'],
        'quantity': product['product_quantity'],
        'price': product['product_price'],
      });

      if (loginInfo.name != null) {
        await createNotification({
          'user_id_created': loginInfo.id,
          'user_id_receive': loginInfo.id,
          'message': 'Bạn đã đặt thành công đơn hàng ${product['product_name']}: ${order['data']['total_amount']} VNĐ.',
        });
      }

      await createNotification({
        'user_id_created': loginInfo.id,
        'user_id_receive': product['user_seller'],
        'message': 'Có đơn hàng ${product['product_name']} của ${order['data']['name']} số điện thoại ${order['data']['phone']} đang chờ bạn xác nhận.',
      });

      if(product['_id'] != null){
        String idpro = product['_id'];
        print(idpro);
        await removeFromCart(idpro);
      }
      
    }

    if (_paymentMethod == 'onlinepay') {
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => PaymentInfo(products: productCart)),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Hãy thanh toán khi nhận hàng.')),
      );
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => MainScreen()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Đặt hàng"),
      ),
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.all(4.0),
                    child: Text(
                      'Thông tin đơn hàng',
                      style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                    ),
                  ),
                  Container(
                    height: 60,
                    // color: Colors.red,
                    child: GestureDetector(
                      onTap: (){
                        List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
                        print(updatedProducts);
                      },
                      child: Card(
                        color: Colors.amber,
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                            Icon(Icons.map),
                            Column(
                              crossAxisAlignment: CrossAxisAlignment.start, // Căn lề trái
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                              Row(
                                children: [
                                  Text('${fullName.text}  ${phoneNumber.text}')
                                ],
                              ),
                              Text(address.text)
                            ],),
                          ],
                        ),
                      ),
                    )
                  ),
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Column(
                      children: [
                        TextField(
                          controller: fullName,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập họ tên (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: phoneNumber,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập số điện thoại (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: address,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập địa chỉ (Bắt buộc)',
                          ),
                        ),
                        SizedBox(height: 4.0),
                        TextField(
                          controller: email,
                          decoration: const InputDecoration(
                            border: OutlineInputBorder(),
                            hintText: 'Nhập email',
                          ),
                        ),
                        SizedBox(height: 20.0), // Khoảng cách giữa các phần
                        Text('Chọn phương thức thanh toán:'),
                        CupertinoSegmentedControl<String>(
                          children: {
                            'onlinepay': Text('Online Pay'),
                            'cash': Text('Cash'),
                          },
                          onValueChanged: (String value) {
                            setState(() {
                              _paymentMethod = value; // Cập nhật lựa chọn
                            });
                          },
                          groupValue: _paymentMethod,
                        ),
                        SizedBox(height: 10.0),
                        Text(
                          'Phương thức thanh toán đã chọn: ${_paymentMethod ?? "Chưa chọn"}',
                          style: TextStyle(fontSize: 16),
                        ),
                      ],
                    ),
                  ),
                  ListView.builder(
                    shrinkWrap: true, // Cho phép ListView nhỏ lại theo kích thước của nội dung
                    physics: NeverScrollableScrollPhysics(), // Ngăn cuộn của ListView
                    itemCount: productCart.length,
                    itemBuilder: (context, index) {
                      return Card(
                        child: Padding(
                          padding: const EdgeInsets.all(4.0),
                          child: Column(
                            children:[
                              Row(
                                children: [
                                  Container(
                                    width: 70,
                                    height: 70, // Đặt chiều cao cụ thể cho hình ảnh
                                    child: Image.network(
                                      productCart[index]['product_imageUrl'],
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
                                            productCart[index]['product_name'],
                                            style: TextStyle(fontSize: 14),
                                            maxLines: 1,
                                            overflow: TextOverflow.ellipsis,
                                            softWrap: false,
                                          ),
                                        ),
                                        Text(
                                          '${formatPrice(productCart[index]['product_price'])}đ',
                                          style: TextStyle(fontSize: 14),
                                        ),
                                        Text(
                                          'Số lượng: x${productCart[index]['product_quantity']}',
                                          style: TextStyle(fontSize: 14),
                                        ),
                                      ],
                                    ),
                                  ),
                                  Container(
                                    child: Text(
                                      '${priceOfOne(productCart[index]['product_price'], productCart[index]['product_quantity'])}đ',
                                      style: TextStyle(color: Colors.red, fontWeight: FontWeight.bold,), // Sử dụng TextStyle để thiết lập màu sắc
                                    ),
                                  ),
                                ],
                              ),
                              TextField(
                                controller: noteControllers[index],
                                decoration: const InputDecoration(
                                  border: OutlineInputBorder(),
                                  hintText: 'Lời nhắn cho người bán',
                                ),
                              )
                            ]
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
          Container(
            color: Colors.grey[300],
            padding: EdgeInsets.all(0),
            child: Row(
              children: [
                Expanded(
                  flex: 6,
                  child: Container(
                    alignment: Alignment.center,
                    child: Text(
                      'Tổng: ${sumPriceAll(productCart)}đ',
                      style: TextStyle(color: Colors.red, fontSize: 18, fontWeight: FontWeight.bold),
                    ),
                  ),
                ),
                Expanded(
                  flex: 4,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      fixedSize: Size(double.infinity, 50),
                      backgroundColor: Colors.red,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.zero,
                      ),
                    ),
                    onPressed: () {
                      // print('$productCart');
                      // List<Map<String, dynamic>> updatedProducts = createUpdatedProductList();
                      // print('$updatedProducts');
                      handleCheckout();
                    },
                    child: Text(
                      'Thanh Toán',
                      style: TextStyle(color: Colors.white, fontSize: 18),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}