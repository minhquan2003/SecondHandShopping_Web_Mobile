import 'package:flutter/material.dart';
import '../Product/product_list.dart';
import '../Category/category_list.dart';
import '../../config.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Consumer<LoginInfo>(
      builder: (context, loginInfo, child) {
        Widget checkUser() {
          if (loginInfo.name == null || loginInfo.name!.isEmpty) {
            return Text('Hãy đăng nhập để có trải nghiệm tốt hơn');
          } else {
            return Text('Chào mừng ${loginInfo.name}');
          }
        }

        return Scaffold(
          body: NestedScrollView(
            headerSliverBuilder: (BuildContext context, bool innerBoxScrolled) {
              return <Widget>[
                SliverAppBar(
                  expandedHeight: 300,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Column(
                      children: [
                        ClipRRect(
                          borderRadius:
                              BorderRadius.vertical(top: Radius.circular(5)),
                          child: Image.network(
                            'https://tenten.vn/tin-tuc/wp-content/uploads/2022/09/cach-ban-hang-online-hieu-qua.png',
                            width: double.infinity,
                            height: 170,
                            fit: BoxFit.cover,
                          ),
                        ),
                        Container(
                          height: 20, // Chiều cao của Container
                          child: checkUser(),
                        ),
                        Container(
                          height: 110,
                          color: Colors.green, // Màu nền cho danh mục sản phẩm
                          child: CategoryList(
                              urlBase:
                                  'http://$ip:5555/categories/'), // Danh mục sản phẩm
                        ),
                      ],
                    ),
                  ),
                ),
              ];
            }, //http://$ip:5555/products/page?page=$page&limit=20
            body: ProductList(
                urlBase: 'http://$ip:5555/products/'), // Danh sách sản phẩm
          ),
        );
      },
    );
  }
}
