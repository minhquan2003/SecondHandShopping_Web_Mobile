import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Order/order_detail.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class PurchaseOrder extends StatefulWidget {
  const PurchaseOrder({super.key});

  _PurchaseOrderState createState() => _PurchaseOrderState();
}

class _PurchaseOrderState extends State<PurchaseOrder> with SingleTickerProviderStateMixin {
  late LoginInfo loginInfo;
  late List<dynamic> purchaseOrder = [];
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


  Future<List<dynamic>> fetchPurchaseOrders() async {
    final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer/${loginInfo.id}'));
    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      List<dynamic> purchaseOrders = result['data'];

      // Using a for loop to process each purchase order
      for (var order in purchaseOrders) {
        final responseOrderDetail = await http.get(Uri.parse('http://$ip:5555/orderDetails/order/${order['_id']}'));

        if (responseOrderDetail.statusCode == 200) {
          final resultOrderDetail = json.decode(responseOrderDetail.body);
          var orderDetail = resultOrderDetail['data'] != null && resultOrderDetail['data'].isNotEmpty
              ? resultOrderDetail['data'][0]
              : null;

          if (orderDetail != null) {
            final responseProduct = await http.get(Uri.parse('http://$ip:5555/products/${orderDetail['product_id']}'));
            if (responseProduct.statusCode == 200) {
              final resultProduct = json.decode(responseProduct.body);

              // Adding orderDetail and product to the order
              order['orderDetail'] = orderDetail;
              order['product'] = resultProduct;
            } else {
              // Handle product fetch error
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

      // Update the state with the modified purchase orders
      setState(() {
        purchaseOrder = purchaseOrders;
      });

      return purchaseOrders; // Return the modified list
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
      return [];
    }
  }
  // Future<void> fetchPurchaseOrders() async {
  //   final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer/${loginInfo.id}'));
  //   if (response.statusCode == 200) {
  //     final result = json.decode(response.body);
  //     setState(() {
  //       purchaseOrder = result['data'];
  //     });
  //   } else {
  //     ScaffoldMessenger.of(context).showSnackBar(
  //       SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
  //     );
  //   }
  // }

  List<dynamic> getFilteredOrders(String status) {
    if (status == "All") {
      return purchaseOrder;
    } else {
      return purchaseOrder.where((order) => order['status_order'] == status).toList();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Đơn mua'),
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
                ? Center(child: CircularProgressIndicator())
                : ListView.builder(
                    itemCount: filteredOrders.length,
                    itemBuilder: (context, index) {
                      final order = filteredOrders[index];
                      return GestureDetector(
                        onTap: () {
                          Navigator.push(context,
                          MaterialPageRoute(builder: (context) => OrderDetail(order: order)));
                          print(order);
                        },
                      child: Row(children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(10),
                          child: Image.network(
                            order['product']['image_url'],
                            width: 70,
                            height: 70,
                            fit: BoxFit.contain,
                          ),
                        ),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          mainAxisAlignment: MainAxisAlignment.start,
                          children: [
                          Text('${order['product']['name']}'),
                          Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}')
                        ],),
                      ],)
                      // ListTile(
                      //   title: Text(order['name'] ?? 'Người mua không xác định'),
                      //   subtitle: Column(
                      //     crossAxisAlignment: CrossAxisAlignment.start,
                      //     mainAxisAlignment: MainAxisAlignment.start,
                      //     children: [
                      //     Text('${order['product']['name']}'),
                      //     Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}')
                      //   ],),
                      // ),
                      );
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