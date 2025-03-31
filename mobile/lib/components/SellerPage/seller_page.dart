import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:mobile/providers/login_info.dart';
import '../../config.dart';
import '../Product/product_list.dart';

class SellerPage extends StatefulWidget{
  const SellerPage({
    super.key,
  });

  @override
  _SellerPageState createState() => _SellerPageState();
}

class _SellerPageState extends State<SellerPage> {
  late LoginInfo loginInfo;
  late List<dynamic> productSeller = [];
  late String url = '';

  @override
  void initState() {
    super.initState();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
    url = 'http://$ip:5555/products/user/${loginInfo.id}';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: loginInfo.name == null
          ? Text('Hãy đăng nhập để có trải nghiệm tốt nhất')
          : NestedScrollView(
            headerSliverBuilder: (BuildContext context, bool innerBoxScrolled) {
              return <Widget>[
                SliverAppBar(
                  flexibleSpace: FlexibleSpaceBar(
                    background: Column(children: [
                      Text('Trang Bán Hàng', ),
                    ],)
                    ,)
                ),
              ];
            },
            body: ProductList(urlBase: url),
          )
    );
  }
}