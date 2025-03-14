import 'package:flutter/material.dart';
import 'package:mobile/providers/login_info.dart';
import 'package:provider/provider.dart';
import '../../screen2.dart';
import 'home.dart';
import '../Login/login.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  _MainScreenState createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _pages = [
    Home(), // Màn hình Home chứa ProductList
    Screen2(productName: 'Sản phẩm'),
    Home(),
    Screen2(productName: 'Sản phẩm'),
    Home(), // Màn hình Screen2
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Product List'),
        backgroundColor: const Color.fromARGB(255, 255, 238, 84),
        
        actions: [
          IconButton(
            icon: const Icon(Icons.login), // Icon hình đăng nhập
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => Login())
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout), // Icon hình đăng nhập
            onPressed: () {
              Provider.of<LoginInfo>(context, listen: false).logout();
            },
          ),
          IconButton(
            icon: const Icon(Icons.person), // Icon hình profile
            onPressed: () {
              showDialog(
                context: context,
                builder: (BuildContext context) {
                  return AlertDialog(
                    title: Text('Profile'),
                    content: Text('one two'),
                    actions: [
                      TextButton(
                        child: Text('Close'),
                        onPressed: () {
                          Navigator.of(context).pop(); // Đóng dialog
                        },
                      ),
                    ],
                  );
                },
              );
            },
          ),
        ],
      ),
      body: _pages[_selectedIndex], // Hiển thị màn hình dựa trên _selectedIndex
      bottomNavigationBar: BottomNavigationBar(
        backgroundColor: const Color.fromARGB(255, 255, 238, 84),
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
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile', // Mục cho Screen2
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
        ],
        unselectedItemColor: Colors.grey,
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.blue,
        onTap: _onItemTapped,
      ),
    );
  }
}