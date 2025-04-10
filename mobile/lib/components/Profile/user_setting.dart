import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../core/models/user_model.dart';
import '../../providers/userProfile_provider.dart';
import '../../providers/login_info.dart';
import '../UI/edit_text_field.dart';
import '../UI/custom_button.dart';
import 'package:file_picker/file_picker.dart';
import 'dart:io';
import 'package:path/path.dart' as path;

class UserInformation extends StatefulWidget {
  @override
  State<UserInformation> createState() => _UserInformationState();
}

class _UserInformationState extends State<UserInformation> {
  late TextEditingController nameController;
  late TextEditingController usernameController;
  late TextEditingController phoneController;
  late TextEditingController emailController;
  late TextEditingController addressController;
  late TextEditingController avatarUrlController;

  bool isLoading = false;
  bool isEditing = false; // <-- Thêm biến này

  @override
  void initState() {
    super.initState();
    final loginInfo = Provider.of<LoginInfo>(context, listen: false);
    final userId = loginInfo.id;

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final profileProvider =
          Provider.of<UserProfileProvider>(context, listen: false);
      await profileProvider.fetchUser(userId!);

      final user = profileProvider.user!;
      setState(() {
        nameController = TextEditingController(text: user.name);
        usernameController = TextEditingController(text: user.username);
        phoneController = TextEditingController(text: user.phone);
        emailController = TextEditingController(text: user.email);
        addressController = TextEditingController(text: user.address);
        avatarUrlController = TextEditingController(text: user.avatarUrl);
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    final profileProvider = Provider.of<UserProfileProvider>(context);
    final user = profileProvider.user;

    if (user == null) {
      return Scaffold(
        appBar: AppBar(title: Text('Thông tin cá nhân')),
        body: Center(child: CircularProgressIndicator()),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('Thông tin cá nhân')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            GestureDetector(
              onTap: () async {
                FilePickerResult? result = await FilePicker.platform.pickFiles(
                  type: FileType.image,
                );

                if (result != null && result.files.single.path != null) {
                  File imageFile = File(result.files.single.path!);

                  setState(() {
                    isLoading = true;
                  });

                  // Gửi ảnh lên Cloudinary hoặc server
                  final imageUrl =
                      await profileProvider.uploadImageToCloudinary(imageFile);

                  if (imageUrl != null) {
                    setState(() {
                      avatarUrlController.text = imageUrl;
                    });
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Tải ảnh thành công!')),
                    );
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Tải ảnh thất bại!')),
                    );
                  }

                  setState(() {
                    isLoading = false;
                  });
                }
              },
              child: Stack(
                alignment: Alignment.center,
                children: [
                  CircleAvatar(
                    radius: 50,
                    backgroundImage: avatarUrlController.text.isNotEmpty
                        ? NetworkImage(avatarUrlController.text)
                        : AssetImage('assets/images/default_avatar.png')
                            as ImageProvider,
                  ),
                  if (isEditing)
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: CircleAvatar(
                        backgroundColor: Colors.white,
                        radius: 15,
                        child: Icon(Icons.edit, size: 18),
                      ),
                    ),
                ],
              ),
            ),
            EditableTextField(
              label: 'Tên',
              controller: nameController,
              icon: Icons.person,
              isEnabled: isEditing, // <-- Điều chỉnh tại đây
            ),
            EditableTextField(
              label: 'Username',
              controller: usernameController,
              icon: Icons.person_outline,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Số điện thoại',
              controller: phoneController,
              icon: Icons.phone,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Email',
              controller: emailController,
              icon: Icons.email,
              isEnabled: isEditing,
            ),
            EditableTextField(
              label: 'Địa chỉ',
              controller: addressController,
              icon: Icons.home,
              isEnabled: isEditing,
            ),
            const SizedBox(height: 20),
            isLoading
                ? CircularProgressIndicator()
                : CustomButton(
                    text: isEditing ? 'Lưu' : 'Sửa thông tin',
                    onPressed: () async {
                      if (!isEditing) {
                        // Đổi sang chế độ chỉnh sửa
                        setState(() {
                          isEditing = true;
                        });
                      } else {
                        // Đang chỉnh sửa, giờ sẽ lưu
                        setState(() {
                          isLoading = true;
                        });

                        final updatedUser = User(
                          id: user.id,
                          name: nameController.text,
                          username: usernameController.text,
                          phone: phoneController.text,
                          email: emailController.text,
                          address: addressController.text,
                          avatarUrl: avatarUrlController.text,
                          password: user.password,
                        );

                        try {
                          await profileProvider.updateUser(
                              user.id, updatedUser);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Cập nhật thành công')),
                          );
                          setState(() {
                            isEditing = false;
                          });
                        } catch (e) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Cập nhật thất bại')),
                          );
                        }

                        setState(() {
                          isLoading = false;
                        });
                      }
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
