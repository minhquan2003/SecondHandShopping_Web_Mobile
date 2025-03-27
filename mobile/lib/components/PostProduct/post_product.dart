import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class PostProduct extends StatefulWidget {
  const PostProduct({super.key});

  @override
  _PostProductState createState() => _PostProductState();
}

class _PostProductState extends State<PostProduct> {
  late LoginInfo loginInfo;
  late List<dynamic> categoriesList = [];
  bool isLoading = true; // Biến theo dõi trạng thái tải

  final TextEditingController imgUrl = TextEditingController();
  final TextEditingController name = TextEditingController();
  final TextEditingController description = TextEditingController();
  final TextEditingController price = TextEditingController();
  final TextEditingController quantity = TextEditingController();
  final TextEditingController brand = TextEditingController();
  final TextEditingController condition = TextEditingController();
  final TextEditingController origin = TextEditingController();
  String? selectedCategoryId;
  String? _imagePath;

  Future<void> _pickImage() async {
    final picker = ImagePicker();
    final pickedFile = await picker.getImage(source: ImageSource.gallery);

    setState(() {
      if (pickedFile != null) {
        _imagePath = pickedFile.path; // Cập nhật đường dẫn hình ảnh
      } else {
        print('Không có hình ảnh được chọn.');
      }
    });
  }

  @override
  void initState() {
    super.initState();
    fetchCategories();
    imgUrl.text = 'https://www.chotot.com/_next/image?url=https%3A%2F%2Fstatic.chotot.com%2Fstorage%2Fchapy-pro%2Fnewcats%2Fv8%2F9000.png&w=256&q=95';
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> fetchCategories() async {
    final response = await http.get(Uri.parse('http://$ip:5555/categories'));
    if (response.statusCode == 200) {
      setState(() {
        categoriesList = jsonDecode(response.body);
        isLoading = false; // Cập nhật trạng thái tải
      });
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Không tải được danh mục sản phẩm!')),
      );
      setState(() {
        isLoading = false; // Cập nhật trạng thái tải
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: loginInfo.name == null
          ? Center(child: Text('Hãy đăng nhập để có trải nghiệm tốt nhất'))
          : isLoading
              ? Center(child: CircularProgressIndicator()) // Hiển thị loader trong khi tải
              : NestedScrollView(
                  headerSliverBuilder: (BuildContext context, bool innerBoxScrolled) {
                    return <Widget>[
                      SliverAppBar(
                        flexibleSpace: FlexibleSpaceBar(
                          background: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                            Text('Đăng tin bán hàng', style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
                            Icon(Icons.edit)
                          ]),
                        ),
                      ),
                    ];
                  },
                  body: SingleChildScrollView(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(horizontal: 10.0),
                      child: Column(
                        children: [
                          Container(
                            height: 220,
                            child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            mainAxisAlignment: MainAxisAlignment.start,
                            children: [
                            Text('Hình ảnh của sản phẩm'),
                            Padding(
                              padding: const EdgeInsets.symmetric(horizontal: 10.0),
                              child: Stack(
                                alignment: Alignment.center, // Căn giữa các widget con
                                children: [
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: _imagePath != null
                                    ? Image.file(
                                        File(_imagePath!), // Hiển thị hình ảnh đã chọn
                                        width: double.infinity,
                                        height: 200,
                                        fit: BoxFit.contain,
                                      )
                                    :Image.network(
                                      imgUrl.text, // Thay thế bằng URL hình ảnh hợp lệ
                                      width: double.infinity,
                                      height: 200,
                                      fit: BoxFit.contain,
                                    ),
                                  ),
                                  Positioned(
                                    child: IconButton(
                                      icon: Icon(Icons.add_a_photo, size: 30, color: Colors.white), // Biểu tượng thêm hình ảnh
                                      onPressed: _pickImage,
                                    ),
                                  ),
                                ],
                              ),
                            )
                          ],),),
                          const SizedBox(height: 8),
                          TextField(
                            controller: name,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Tên sản phẩm',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: description,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Mô tả sản phẩm',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: price,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Đơn giá',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: quantity,
                            keyboardType: TextInputType.number,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Số lượng',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: brand,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Hãng sản xuất',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: condition,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Tình trạng sản phẩm',
                            ),
                          ),
                          const SizedBox(height: 8),
                          TextField(
                            controller: origin,
                            decoration: InputDecoration(
                              border: OutlineInputBorder(),
                              hintText: 'Xuất xứ',
                            ),
                          ),
                          DropdownButton<String>(
                            hint: Text("Chọn danh mục"),
                            value: selectedCategoryId,
                            onChanged: (String? newValue) {
                              setState(() {
                                selectedCategoryId = newValue;
                              });
                            },
                            items: categoriesList.map((category) {
                              return DropdownMenuItem<String>(
                                value: category['_id'],
                                child: Row(
                                  children: [
                                    Image.network(
                                      category['image_url'],
                                      width: 30,
                                      height: 30,
                                      fit: BoxFit.cover,
                                    ),
                                    SizedBox(width: 10),
                                    Text(category['category_name']),
                                  ],
                                ),
                              );
                            }).toList(),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              print('$selectedCategoryId');
                            },
                            child: Text('Đăng sản phẩm'),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
    );
  }
}