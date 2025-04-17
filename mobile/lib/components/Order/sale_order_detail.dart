import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Product/product_list.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class SaleOrderDetail extends StatefulWidget {
  final Map<String, dynamic> order;
  const SaleOrderDetail({
    super.key,
    required this.order,
  });

  @override
  _SaleOrderDetailState createState() => _SaleOrderDetailState();
}

class _SaleOrderDetailState extends State<SaleOrderDetail> {
  late LoginInfo loginInfo;
  late Map<String, dynamic> ordeR;
  Map<String, dynamic>? orderDetail; // Đổi thành nullable
  Map<String, dynamic>? product;

  @override
  void initState() {
    super.initState();
    ordeR = widget.order;
    fetchOderInfo();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> fetchOderInfo() async {
    final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${ordeR['_id']}'));
    
    if (responseOrderDetail.statusCode == 200) {
      final resultOrderDetail = json.decode(responseOrderDetail.body);
      setState(() {
        // Gán giá trị của thuộc tính 'data' vào orderDetail
        orderDetail = resultOrderDetail['data'] != null && resultOrderDetail['data'].isNotEmpty
            ? resultOrderDetail['data'][0] // Lấy phần tử đầu tiên trong danh sách
            : null; // Nếu không có dữ liệu, gán null
      });

      if (orderDetail != null) {
        final responProduct = await http.get(Uri.parse('http://$ip:5555/products/${orderDetail!['product_id']}'));
        if (responProduct.statusCode == 200) {
          final resultProduct = json.decode(responProduct.body); // Lấy body để giải mã
          setState(() {
            product = resultProduct;
          });
        } else {
          // Xử lý trường hợp không lấy được sản phẩm
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Không thể tải thông tin sản phẩm!')),
          );
        }
      }
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: loginInfo.id == ordeR['user_id_seller'] 
            ? Text('Chi tiết đơn bán') 
            : Text('Chi tiết đơn mua'),
      ),
      body: product == null 
          ? Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              child: Container(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Container(
                      width: double.infinity,
                      color: Colors.orange,
                      padding: EdgeInsets.all(8.0),
                      child: Center(child: Text('${ordeR['status_order']}', style: TextStyle(fontSize: 18))),
                    ),
                    SizedBox(height: 16),
                    Text('Thông tin sản phẩm', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Container(
                      height: 60,
                      child: GestureDetector(
                        onTap: () {
                          // Xử lý khi nhấn vào
                        },
                        child: Card(
                          color: Colors.amber,
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                              Icon(Icons.map),
                              SizedBox(width: 8), 
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text('${ordeR['name']}  ${ordeR['phone']}'),
                                  Text(ordeR['address']),
                                ],
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(10),
                      child: Image.network(
                        product?['image_url'] ?? '',
                        width: double.infinity,
                        height: 220,
                        fit: BoxFit.contain,
                      ),
                    ),
                    SizedBox(height: 8),
                    Text('${product?['name']}'),
                    Text('Đơn giá: ${formatPrice(product?['price'])} x${product?['quantity']}'),
                    Text('Thành tiền: ${formatPrice(ordeR['total_amount'])}'),
                    
                    ElevatedButton(
                      onPressed: () {
                        print('đơn hàng: $ordeR ======= \n chi tiết: $orderDetail ======= \n sản phẩm: $product');
                      },
                      child: Text('Xem trước khi lưu'),
                    ),
                    SizedBox(height: 16),
                    Text('Các sản phẩm tương tự', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
                    Container(
                      height: 400, // Đặt chiều cao cho ProductList
                      child: Expanded(child: 
                      ProductList(
                        urlBase: 'http://$ip:5555/products/category/${product!['category_id']}',
                      ),)
                    ),
                  ],
                ),
              ),
            ),
    );
  }
}