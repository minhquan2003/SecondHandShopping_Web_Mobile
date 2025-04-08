import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../UI/menu_item.dart';
import '../../providers/login_info.dart';
import './user_setting.dart';

class MenuProfile extends StatelessWidget {
  final String userAvatarUrl = 'https://example.com/avatar.jpg';

  @override
  Widget build(BuildContext context) {
    final userInfo = Provider.of<LoginInfo>(context);

    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                userInfo.avatarurl != null
                    ? CircleAvatar(
                        radius: 50,
                        backgroundImage: NetworkImage(userInfo.avatarurl!),
                      )
                    : Icon(Icons.person, size: 50),
                Container(
                  margin: const EdgeInsets.only(left: 10),
                  child: Column(
                    children: [
                      Text(userInfo.username ?? 'username',
                          style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: Colors.black)),
                    ],
                  ),
                )
              ],
            ),
            const SizedBox(height: 20),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Quản lý đơn hàng',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Đơn mua',
              backgroundColor: Colors.white,
              icon: Icons.shopping_cart,
              textColor: Colors.black,
              iconBackgroundColor: Colors.blue,
            ),
            MenuProfileItem(
              text: 'Đơn bán',
              backgroundColor: Colors.white,
              icon: Icons.shopping_bag,
              textColor: Colors.black,
              iconBackgroundColor: Colors.green,
            ),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Tiện ích',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Tin đã đăng',
              backgroundColor: Colors.white,
              icon: Icons.post_add,
              textColor: Colors.black,
              iconBackgroundColor: Colors.red,
            ),
            MenuProfileItem(
              text: 'Đánh giá của tôi',
              backgroundColor: Colors.white,
              icon: Icons.feedback,
              textColor: Colors.black,
              iconBackgroundColor: Colors.blue,
            ),
            MenuProfileItem(
              text: 'Đăng ký đối tác',
              backgroundColor: Colors.white,
              icon: Icons.add_business_sharp,
              textColor: Colors.black,
              iconBackgroundColor: Colors.yellow[700],
            ),
            Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 214, 214, 214),
                ),
                child: (Text(
                  'Khác',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.bold,
                    color: const Color.fromARGB(255, 99, 99, 99),
                  ),
                ))),
            MenuProfileItem(
              text: 'Cài đặt tài khoản',
              backgroundColor: Colors.white,
              icon: Icons.settings,
              textColor: Colors.black,
              iconBackgroundColor: Colors.grey,
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (context) => UserInformation(),
                  ),
                );
              },
            ),
            MenuProfileItem(
              text: 'Đóng góp ý kiến',
              backgroundColor: Colors.white,
              icon: Icons.feedback,
              textColor: Colors.black,
              iconBackgroundColor: Colors.grey,
            ),
            MenuProfileItem(
              text: 'Đăng xuất',
              backgroundColor: Colors.white,
              icon: Icons.logout,
              textColor: Colors.red,
              iconBackgroundColor: Colors.red,
            ),
          ],
        ),
      ),
    );
  }
}
