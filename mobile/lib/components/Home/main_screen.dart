import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import '../../screen2.dart';
import 'home.dart';
import '../Login/login.dart';
import '../Cart/cart.dart';
import '../Profile/menu_profile.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 2;

  final List<Widget> _pages = [
    Home(), // Màn hình Home chứa ProductList
    Screen2(productName: 'Sản phẩm'),
    Home(),
    Home(), // Màn hình Screen2
    MenuProfile(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    final loginInfo =
        Provider.of<LoginInfo>(context); // Lấy thông tin đăng nhập

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Image.network(
              'https://res.cloudinary.com/dd6pnq2is/image/upload/v1741941433/logo_w30ahh.png',
              height: 40, // Điều chỉnh chiều cao hình ảnh
            ),
            SizedBox(width: 8), // Khoảng cách giữa logo và văn bản
          ],
        ),
        backgroundColor: const Color.fromARGB(255, 255, 238, 84),
        actions: [
          IconButton(
            icon: Icon(Icons.shopping_cart),
            onPressed: () {
              if (loginInfo.name == null) {
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(
                      content: Text('Hãy đăng nhập để có trải nghiệm tốt hơn')),
                );
              } else {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Cart()),
                );
              }
            },
          ),
          IconButton(
            icon: Icon(loginInfo.name == null
                ? Icons.login
                : Icons.logout), // Thay đổi icon theo trạng thái đăng nhập
            onPressed: () {
              if (loginInfo.name == null) {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => Login()),
                );
              } else {
                Provider.of<LoginInfo>(context, listen: false).logout();
              }
            },
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu), // Icon menu
            onSelected: (String value) {
              // Xử lý lựa chọn menu ở đây
              ScaffoldMessenger.of(context)
                  .showSnackBar(SnackBar(content: Text('Bạn đã chọn: $value')));
            },
            itemBuilder: (BuildContext context) {
              return {'Một', 'Hai', 'Ba', 'Bốn'}.map((String choice) {
                return PopupMenuItem<String>(
                  value: choice,
                  child: Text(choice),
                );
              }).toList();
            },
          ),
        ],
      ),
      body: _pages[_selectedIndex], // Hiển thị màn hình dựa trên _selectedIndex
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile', // Mục cho Screen2
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Trang chủ',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Tài khoản', // Mục cho Screen2
          ),
        ],
        selectedItemColor: Colors.blue, // Màu sắc icon đã chọn
        unselectedItemColor: Colors.grey, // Màu sắc icon chưa chọn
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        selectedLabelStyle:
            TextStyle(color: Colors.black), // Màu sắc chữ cho mục đã chọn
        unselectedLabelStyle:
            TextStyle(color: Colors.black), // Màu sắc chữ cho mục chưa chọn
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
