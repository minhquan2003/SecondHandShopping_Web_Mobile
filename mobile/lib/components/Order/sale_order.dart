import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Order/order_detail.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class SaleOrder extends StatefulWidget {
  const SaleOrder({super.key});

  @override
  _SaleOrderState createState() => _SaleOrderState();
}

class _SaleOrderState extends State<SaleOrder> with SingleTickerProviderStateMixin {
  late LoginInfo loginInfo;
  late List<dynamic> saleOrder = [];
  late TabController _tabController;

  final List<String> statuses = [
    "All",
    "Pending",
    "Confirmed",
    "Packaged",
    "Shipping",
    "Success",
    "Request Cancel",
    "Cancelled",
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: statuses.length, vsync: this);
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    fetchPurchaseOrders();
  }

  Future<void> fetchPurchaseOrders() async {
    final response = await http.get(Uri.parse('http://$ip:5555/orders/seller/${loginInfo.id}'));
    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      setState(() {
        saleOrder = result['data'];
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }
  }

  List<dynamic> getFilteredOrders(String status) {
    if (status == "All") {
      return saleOrder;
    } else {
      return saleOrder.where((order) => order['status_order'] == status).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Đơn bán'),
        bottom: TabBar(
          controller: _tabController,
          isScrollable: true,
          tabs: statuses.map((status) => Tab(text: status)).toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: statuses.map((status) {
          final filteredOrders = getFilteredOrders(status);
          return Container(
            child: filteredOrders.isEmpty
                ? Center(child: Text('Không có đơn bán nào.'))
                : ListView.builder(
                    itemCount: filteredOrders.length,
                    itemBuilder: (context, index) {
                      final order = filteredOrders[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                          MaterialPageRoute(builder: (context) => OrderDetail(order: order)));
                        },
                      child: ListTile(
                        title: Text(order['name'] ?? 'Người mua không xác định'),
                        subtitle: Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}'),
                      ));
                    },
                  ),
          );
        }).toList(),
      ),
    );
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }
}