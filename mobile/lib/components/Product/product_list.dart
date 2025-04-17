import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Để chuyển đổi JSON
import 'product_card.dart';

class ProductList extends StatefulWidget {
  final String urlBase;
  const ProductList({
    super.key,
    required this.urlBase,
  });

  @override
  _ProductListState createState() => _ProductListState();
}

class _ProductListState extends State<ProductList> {
  List<dynamic> products = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    fetchProducts();
  }

  Future<void> fetchProducts() async {
    final response = await http.get(Uri.parse(widget.urlBase));
    
    if (response.statusCode == 200) {
      setState(() {
        products = json.decode(response.body);
        isLoading = false;
      });
    } else {
      throw Exception('Failed to load products');
    }
  }

  @override
  Widget build(BuildContext context) {
    return isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Padding(
            padding: const EdgeInsets.all(4.0),
            child: GridView.builder(
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.8,
                crossAxisSpacing: 4,
                mainAxisSpacing: 4,
              ),
              itemCount: products.length,
              // Xóa dòng này để cho phép cuộn
              // physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (context, index) {
                final product = products[index];
                return ProductCard(
                  product: product, // Truyền toàn bộ đối tượng sản phẩm
                );
              },
            ),
          );
  }
}