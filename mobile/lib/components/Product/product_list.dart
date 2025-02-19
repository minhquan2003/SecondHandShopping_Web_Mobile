import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert'; // Để chuyển đổi JSON
import 'product_card.dart';

class ProductList extends StatefulWidget {
  const ProductList({super.key});

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
    final response = await http.get(Uri.parse('http://192.168.1.76:5555/products/'));
    
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
    return Scaffold(
      // appBar: AppBar(
      //   title: const Text('Product List'),
      // ),
      body: isLoading 
          ? const Center(child: CircularProgressIndicator()) 
          : Padding(
              padding: const EdgeInsets.all(16.0),
              child: GridView.builder(
                gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 2,
                  childAspectRatio: 0.8,
                  crossAxisSpacing: 16,
                  mainAxisSpacing: 16,
                ),
                itemCount: products.length,
                itemBuilder: (context, index) {
                  final product = products[index];
                  return ProductCard(
                    name: product['name'],
                    price: '${product['price']} VNĐ',
                    imageUrl: product['image_url'],
                  );
                },
              ),
            ),
    );
  }
}