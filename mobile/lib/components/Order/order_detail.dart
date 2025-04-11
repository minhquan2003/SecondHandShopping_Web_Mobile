import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class OrderDetail extends StatefulWidget {
  final Map<String, dynamic> order;
  const OrderDetail({
    super.key,
    required this.order,
  });

  @override
  _OrderDetailState createState() => _OrderDetailState();
}

class _OrderDetailState extends State<OrderDetail> {
  late LoginInfo loginInfo;
  late Map<String, dynamic> ordeR;
  Map<String, dynamic>? orderDetail; // Đổi thành nullable

  @override
  void initState() {
    super.initState();
    ordeR = widget.order;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchOderInfo();
  }

  Future<void> fetchOderInfo() async {
  final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${ordeR['_id']}'));
  if (responseOrderDetail.statusCode == 200) {
    final result = json.decode(responseOrderDetail.body);
    setState(() {
      // Gán giá trị của thuộc tính 'data' vào orderDetail
      orderDetail = result['data'] != null && result['data'].isNotEmpty
          ? result['data'][0] // Lấy phần tử đầu tiên trong danh sách
          : null; // Nếu không có dữ liệu, gán null
    });
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
        title: Text('Chi tiết đơn hàng'),
      ),
      body: Container(
        child: Column(
          children: [
            Text('${ordeR}'),
            orderDetail == null
                ? CircularProgressIndicator() // Hiển thị spinner khi đang tải
                : Text('Chi tiết sản phẩm: ${orderDetail ?? 'Không có thông tin'}'),
            ElevatedButton(
              onPressed: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text('${ordeR['_id']}')),
                );
              },
              child: Text('Xem trước khi lưu'),
            ),
          ],
        ),
      ),
    );
  }
}