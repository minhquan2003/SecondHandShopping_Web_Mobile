import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';

class Chat extends StatefulWidget {
  final Map<String, dynamic> conversation;
  
  const Chat({
    super.key,
    required this.conversation,
  });

  @override
  _ChatState createState() => _ChatState();
}

class _ChatState extends State<Chat>{
  late Map<String, dynamic> convervation;
  late List<dynamic> messages = [];
  bool isLoading = true;
  late LoginInfo loginInfo;

  late TextEditingController _mess = TextEditingController();

  @override
  void initState() {
    super.initState();
    convervation = widget.conversation;
    fetchMess();
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    loginInfo = Provider.of<LoginInfo>(context);
  }

  Future<void> fetchMess() async {
    try {
      final responseConver = await http.get(Uri.parse('http://$ip:5555/messages/${convervation['_id']}'));
      setState(() {
          messages = json.decode(responseConver.body);
          isLoading = false; // Tắt trạng thái loading
        });
    } catch (e) {
      // Xử lý lỗi tổng quát
      print('Lỗi khi tải cuộc hội thoại: $e');
      setState(() {
        isLoading = false; // Tắt trạng thái loading
      });
    }
  }

  void sendMess() async {
    print(_mess.text);
    final response = await http.post(Uri.parse('http://$ip:5555/messages'), // Thay đổi endpoint nếu cần
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'conversationId': convervation['_id'],
        'content': _mess.text,
        'senderId': loginInfo.id,
        'receiverId': convervation['participant1'] == loginInfo.id ? convervation['participant2'] : convervation['participant1']
      }),);
      if(response.statusCode == 201){
        final responseRead = await http.post(Uri.parse('http://$ip:5555/messages/read/${convervation['_id']}'), // Thay đổi endpoint nếu cần
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'senderId': loginInfo.id,
        }),);
        if(response.statusCode == 200){
          print('Gửi thành công');
        }else{print('Gửi không thành công');}
      }
     _mess.clear();

  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Text('Nhắn tin'),
      ),
      body: Column(
        children: [
          Expanded( // Sử dụng Expanded
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final mess = messages[index];
                return ListTile(
                  title: Text(mess['_id'] ?? 'Người mua không xác định'),
                  subtitle: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisAlignment: MainAxisAlignment.start,
                    children: [
                      Text(mess['conversationId'] ?? 'Không có ID'),
                      Text(mess['content'] ?? 'Không có tin nhắn cuối'),
                      Text(convervation['user']?['name'] ?? 'Không có tên'), // Kiểm tra null trước khi truy cập
                    ],
                  ),
                );
              },
            ),
          ),
          Row(
          children: [
            Expanded(
              child: Padding(
                padding: const EdgeInsets.all(8.0),
                child: TextField(
                  controller: _mess,
                  decoration: InputDecoration(
                    hintText: 'Nhập tin nhắn...',
                    border: OutlineInputBorder(),
                  ),
                ),
              ),
            ),
            ElevatedButton(
              onPressed: () {
                sendMess();
              },
              child: Text('Gửi'),
            ),
          ],
        ),
        ],
      )
    );
  }
}