import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class Notifications extends StatefulWidget {
  const Notifications({
    super.key,
  });

  @override
  _NotificationsState createState() => _NotificationsState();
}

class _NotificationsState extends State<Notifications> {

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text("Thông báo"),
      ),
      body: Container(
        child: Column(children: [
          Center(child: Text('Trang thông báo'),)
        ],),
      ),
    );
  }
}