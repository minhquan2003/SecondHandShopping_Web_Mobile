import 'package:flutter/material.dart';
import '../Product/product_list.dart'; // Đảm bảo rằng bạn có file này
import '../Category/category_list.dart';

class Home extends StatelessWidget {
  const Home({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: NestedScrollView(
        headerSliverBuilder: (BuildContext context, bool innerBoxScrolled) {
          return <Widget>[
            SliverAppBar(
              // title: const Text("Quân"), // Tiêu đề
              // pinned: true, // Cố định tiêu đề
              expandedHeight: 280, // Chiều cao tối đa cho tiêu đề
              flexibleSpace: FlexibleSpaceBar(
                background: Column(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.vertical(top: Radius.circular(5)),
                      child: Image.network(
                        'https://tenten.vn/tin-tuc/wp-content/uploads/2022/09/cach-ban-hang-online-hieu-qua.png',
                        width: double.infinity,
                        height: 170,
                        fit: BoxFit.cover,
                      ),
                    ),
                    Container(
                      height: 110,
                      color: Colors.green, // Màu nền cho danh mục sản phẩm
                      child: CategoryList(urlBase: 'http://192.168.1.248:5555/categories/'), // Danh mục sản phẩm
                    ),
                  ],
                ),
              ),
            ),
          ];
        },
        body: ProductList(urlBase: 'http://192.168.1.248:5555/products/'), // Danh sách sản phẩm
      ),
    );
  }
}