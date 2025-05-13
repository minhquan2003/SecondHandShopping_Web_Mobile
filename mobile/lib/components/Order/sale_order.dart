import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:mobile/components/Order/sale_order_detail.dart';
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

  int currentPage = 1; // Biến để theo dõi trang hiện tại
  bool isLoading = false; // Biến để theo dõi trạng thái tải
  bool isLoadingMore = false; // Biến để theo dõi trạng thái tải thêm dữ liệu

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
    if (isLoading) return; // Ngăn tải lại khi đang tải dữ liệu
    isLoading = true;

    final response = await http.get(Uri.parse('http://$ip:5555/orders/seller1/page?page=$currentPage&limit=10&userId=${loginInfo.id}'));
    if (response.statusCode == 200) {
      final result = json.decode(response.body);
      List<dynamic> fetchedSaleOrder = result['data']; // Đổi tên

      for (var order in fetchedSaleOrder) {
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
              order['orderDetail'] = orderDetail;
              order['product'] = resultProduct;
            }
          }
        }
      }

      setState(() {
        saleOrder.addAll(fetchedSaleOrder); // Cập nhật danh sách
        currentPage++; // Tăng trang hiện tại
        isLoadingMore = false; // Kết thúc trạng thái tải thêm
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }

    isLoading = false; // Kết thúc trạng thái tải
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
          return NotificationListener<ScrollNotification>(
            onNotification: (ScrollNotification scrollInfo) {
              if (!isLoading && scrollInfo.metrics.pixels == scrollInfo.metrics.maxScrollExtent) {
                isLoadingMore = true; // Bắt đầu tải thêm dữ liệu
                fetchPurchaseOrders(); // Tải thêm dữ liệu khi cuộn đến cuối
              }
              return false;
            },
            child: Container(
              child: Column(
                children: [
                  Expanded(
                    child: filteredOrders.isEmpty
                        ? Center(child: CircularProgressIndicator())
                        : ListView.builder(
                            itemCount: filteredOrders.length,
                            itemBuilder: (context, index) {
                              final order = filteredOrders[index];
                              return GestureDetector(
                                onTap: () {
                                  Navigator.push(context,
                                  MaterialPageRoute(builder: (context) => SaleOrderDetail(order: order)));
                                },
                                child: ListTile(
                                  title: Text(order['name'] ?? 'Người mua không xác định'),
                                  subtitle: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(order['_id']),
                                      Text(order['product']?['name'] ?? 'Tên sản phẩm không xác định'),
                                      Text('Tổng tiền: ${formatPrice(order['total_amount'])} đ\nTrạng thái: ${order['status_order']}'),
                                    ],
                                  ),
                                ),
                              );
                            },
                          ),
                  ),
                  if (isLoadingMore) // Hiển thị vòng tròn loading khi tải thêm
                    Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Center(child: CircularProgressIndicator()),
                    ),
                ],
              ),
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