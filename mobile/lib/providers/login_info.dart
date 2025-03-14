import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config.dart';

class LoginInfo with ChangeNotifier {
  String? _id;
  String? _name;
  String? _avatarurl;
  String? _role;
  String? _email;

  String? get id => _id;
  String? get name => _name;
  String? get avatarurl => _avatarurl;
  String? get role => _role;
  String? get email => _email;

  Future<bool> login(String email, String password) async {
    try {
      // Gửi yêu cầu đăng nhập đến API
      final response = await http.post(
        Uri.parse('http://$ip:5555/auth/login'), // URL đăng nhập
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email, 'password': password}),
      );

      if (response.statusCode == 200) {
        final user = await http.post(
        Uri.parse('http://$ip:5555/users/email'), // URL đăng nhập
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'email': email}),
      );
        // Xử lý phản hồi đăng nhập
        final Map<String, dynamic> userInfo = json.decode(user.body);

        // Kiểm tra nếu tài khoản bị cấm
        if (userInfo['ban'] == true) {
          throw Exception('Tài khoản của bạn đã bị cấm. Xin hãy liên hệ với hệ thống.');
        }

        // Cập nhật thông tin người dùng
        _id = userInfo['_id'];
        _name = userInfo['name'];
        _avatarurl = userInfo['avatarurl'];
        _role = userInfo['role'];
        _email = email; // Lưu email
        notifyListeners(); // Cập nhật UI
        return true;
      } else {
        return false;        
      }
    } catch (err) {
      throw Exception('Đã xảy ra lỗi trong quá trình đăng nhập.');
    }
  }

  void logout() {
    _email = null;
    _id = null;
    _name = null;
    _avatarurl = null;
    _role = null;
    notifyListeners();
  }
}