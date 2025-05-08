import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/login_info.dart';
import 'package:http/http.dart' as http;
import '../../config.dart';
import '../../utils/convert.dart';
import 'package:intl/intl.dart';

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
        if(responseRead.statusCode == 200){
          print('Gửi thành công');
        }else{print('Gửi không thành công');}
      }
     _mess.clear();

  }

  @override
  Widget build(BuildContext context){
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipOval(
              child: Image.network(
                convervation['user']['avatar_url'] ?? '', // Kiểm tra nếu có URL
                width: 50.0, // Thay đổi kích thước cho phù hợp
                height: 50.0,
                fit: BoxFit.cover,
                errorBuilder: (context, error, stackTrace) {
                  return Container(
                    width: 50.0,
                    height: 50.0,
                    color: Colors.grey, // Màu nền khi lỗi tải hình
                  );
                },
                loadingBuilder: (context, child, loadingProgress) {
                  if (loadingProgress == null) return child; // Hiển thị hình khi tải xong
                  return Container(
                    width: 50.0,
                    height: 50.0,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.grey, // Màu nền khi đang tải
                    ),
                    child: Center(child: CircularProgressIndicator()), // Hiển thị vòng tròn khi tải
                  );
                },
              ),
            ),
            SizedBox(width: 10), // Khoảng cách giữa avatar và tên
            Expanded(
              child: Text(
                convervation['user']?['name'] ?? 'Tên người dùng', // Hiển thị tên người dùng, có giá trị mặc định
                style: TextStyle(
                  fontSize: 18, // Kích thước chữ
                  fontWeight: FontWeight.bold, // Đậm
                ),
                overflow: TextOverflow.ellipsis, // Tránh tràn văn bản
              ),
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded( // Sử dụng Expanded
            child: ListView.builder(
              itemCount: messages.length,
              itemBuilder: (context, index) {
                final mess = messages[index];
                final bool isMe = mess['senderId'] == loginInfo.id; // Kiểm tra xem tin nhắn có phải của mình không

                return Container(
                  padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8), // Thêm padding cho tin nhắn
                  child: Align(
                    alignment: isMe ? Alignment.centerRight : Alignment.centerLeft, // Căn chỉnh tin nhắn
                    child: Container(
                      decoration: BoxDecoration(
                        color: isMe ? Colors.blue[100] : Colors.grey[300], // Màu nền tin nhắn
                        borderRadius: BorderRadius.circular(8), // Bo tròn góc tin nhắn
                      ),
                      padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8), // Thêm padding cho nội dung tin nhắn
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            mess['content'],
                            style: TextStyle(fontSize: 16),
                          ),
                          SizedBox(height: 4), // Khoảng cách giữa nội dung và thời gian
                          Text(
                            // Định dạng thời gian
                            DateFormat('HH:mm dd/MM/yyyy').format(DateTime.parse(mess['createdAt'])),
                            style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            )
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