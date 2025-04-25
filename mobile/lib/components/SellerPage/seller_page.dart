import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import 'package:mobile/providers/login_info.dart';
import '../../config.dart';
import '../Product/product_list.dart';

class SellerPage extends StatefulWidget {
  final String idSeller;
  const SellerPage({
    super.key,
    required this.idSeller,
  });

  @override
  _SellerPageState createState() => _SellerPageState();
}

class _SellerPageState extends State<SellerPage> {
  late Map<String, dynamic> sellerInfo;
  late List<dynamic> productsSeller = [];
  late String idSeller = widget.idSeller;

  @override
  void initState(){
    super.initState();

  }

  Future<void> fetchSellerInfo() async {
    final response = await http.get(Uri.parse('http://$ip:5555/users/$idSeller'));
  
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Trang người bán"),
      ),
      body: Container(child: Column(children: [
        Row(children: [

        ],),
        Center(child: Text("Trang người bán"),)
      ],),)
    );
  }
}