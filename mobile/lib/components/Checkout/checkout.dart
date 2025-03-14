import 'package:flutter/material.dart';

class CheckOut extends StatefulWidget{
  final List<dynamic> products;
  const CheckOut({
    super.key,
    required this.products,
  });


  @override
  _CheckOutState createState() => _CheckOutState();
}

class _CheckOutState extends State{

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text("Đặt hàng"),
      ),
      body: SingleChildScrollView(
        
      ),
    );
  }
}