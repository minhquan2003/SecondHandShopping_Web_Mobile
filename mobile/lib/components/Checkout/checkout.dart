import 'package:flutter/material.dart';
import 'package:mobile/utils/convert.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';

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

  final TextEditingController fullName = TextEditingController();
  final TextEditingController phoneNumber = TextEditingController();
  final TextEditingController address = TextEditingController();
  final TextEditingController email = TextEditingController();
  final TextEditingController note = TextEditingController();
  final String paymentMethod = 'cash';

  @override
  void initState() {
    super.initState();
    productCart = widget.products; // Khởi tạo productCart
    loginInfo = Provider.of<LoginInfo>(context, listen: false);
    if (loginInfo.name != null) {
      fullName.text = loginInfo.name!; // Gán giá trị cho controller
      phoneNumber.text = loginInfo.phone!; // Gán giá trị cho controller
      address.text = loginInfo.address!; // Gán giá trị cho controller
      email.text = loginInfo.email!; // Gán giá trị cho controller
    }
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Đặt hàng"),
      ),
      body: Stack(
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Padding(
                padding: const EdgeInsets.all(16.0),
                child: Text(
                  'Thông tin giao hàng',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(8.0),
                child: Column(children: [
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
                  SizedBox(height: 4.0),
                  TextField(
                    controller: note,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      hintText: 'Nhập ghi chú',
                    ),
                  ),
                ]),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: productCart.length,
                  itemBuilder: (context, index) {
                    return ListTile(
                      title: Text(productCart[index]['product_name']),
                      subtitle: Text('Số lượng: ${productCart[index]['product_quantity']}'),
                    );
                  },
                ),
              ),
            ],
          ),
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
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
                        // Logic thanh toán sẽ được thực hiện ở đây
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
          ),
        ],
      ),
    );
  }
}