import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';

class PurchaseOrder extends StatefulWidget{
  const PurchaseOrder({
    super.key,
  });

  _PurchaseOrderState createState() => _PurchaseOrderState();
}

class _PurchaseOrderState extends State<PurchaseOrder>{
  late LoginInfo loginInfo;
  late List<dynamic> purchaseOrder = [];

  @override
  void initState() {
    super.initState();
    
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> fetchPurchaseOrders() async {
  final response = await http.get(Uri.parse('http://$ip:5555/orders/buyer/${loginInfo.id}'),);
  if(response.statusCode == 200){
      purchaseOrder = json.decode(response.body);
    }else{
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không thể tải được danh sách sản phẩm!')),
      );
    }
}

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text('Đơn mua'),
      ),
      body: Container(child: 
      Column(children: [
        Text('Danh sách đơn mua')
      ],),),
    );
  }
}