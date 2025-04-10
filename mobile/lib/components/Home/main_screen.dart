import 'package:flutter/material.dart';
import 'package:mobile/components/Order/purchase_order.dart';
import 'package:mobile/components/Order/sale_order.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import 'home.dart';
import '../Login/login.dart';
import '../Cart/cart.dart';
import '../SellerPage/seller_page.dart';
import '../PostProduct/post_edit_product.dart';
import '../Profile/menu_profile.dart';


class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 2;

  final List<Widget> _pages = [
    SellerPage(),
    PostEditProduct(product: {},),
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
    switch (value) {
      case 'Đơn mua':
        Navigator.push(context,
        MaterialPageRoute(builder: (context) => PurchaseOrder()));
        break;
      case 'Đơn bán':
        Navigator.push(context,
        MaterialPageRoute(builder: (context) => SaleOrder()));
        break;
      case 'Ba':
        // Thực hiện hành động cho 'Ba'
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Bạn đã chọn: Ba')),
        );
        break;
      case 'Bốn':
        // Thực hiện hành động cho 'Bốn'
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Bạn đã chọn: Bốn')),
        );
        break;
    }
  },
  itemBuilder: (BuildContext context) {
    return {'Đơn mua', 'Đơn bán', 'Ba', 'Bốn'}.map((String choice) {
      return PopupMenuItem<String>(
        value: choice,
        child: Text(choice),
      );
    }).toList();
  },
)
        ],
      ),
      body: _pages[_selectedIndex], // Hiển thị màn hình dựa trên _selectedIndex
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.assignment),
            label: 'Quản lý tin',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.create),
            label: 'Đăng tin',
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
            label: 'Tài khoản',
          ),
        ],

        selectedItemColor: Colors.blue,
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex, 
        onTap: _onItemTapped,
        selectedLabelStyle: TextStyle(color: Colors.black),
        unselectedLabelStyle: TextStyle(color: Colors.black),
        type: BottomNavigationBarType.fixed,
      ),
    );
  }
}
