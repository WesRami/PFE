import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:app/models/user_model.dart';
import 'package:app/services/auth_service.dart';
import 'package:app/controllers/auth_controller.dart';

class ActiveMembersSection extends StatefulWidget {
  const ActiveMembersSection({super.key});

  @override
  State<ActiveMembersSection> createState() => _ActiveMembersSectionState();
}

class _ActiveMembersSectionState extends State<ActiveMembersSection> {
  final AuthService _authService = AuthService();
  final AuthController _authController = Get.find<AuthController>();
  static const String defaultProfileImage = 'assets/images/default_profile.png';

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Text(
            'active_collaborators'.tr,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ),
        Obx(() {
          print(
            'ActiveMembersSection: isLoggedIn: ${_authController.isLoggedIn.value}',
          );
          if (!_authController.isLoggedIn.value) {
            return const Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                'Veuillez vous connecter pour voir les collaborateurs actifs',
                style: TextStyle(color: Colors.grey),
              ),
            );
          }

          return FutureBuilder<List<User>>(
            future: _authService.fetchActiveUsers(),
            builder: (context, snapshot) {
              print(
                'FutureBuilder: ConnectionState: ${snapshot.connectionState}',
              );
              if (snapshot.connectionState == ConnectionState.waiting) {
                return const SizedBox(
                  height: 120,
                  child: Center(child: CircularProgressIndicator()),
                );
              } else if (snapshot.hasError) {
                print('FutureBuilder: Error: ${snapshot.error}');
                return SizedBox(
                  height: 120,
                  child: Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Erreur: ${snapshot.error}'),
                        const SizedBox(height: 8),
                        ElevatedButton(
                          onPressed: () {
                            setState(() {}); // Retry
                          },
                          child: const Text('Réessayer'),
                        ),
                      ],
                    ),
                  ),
                );
              } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                print('FutureBuilder: Data: ${snapshot.data}');
                return const SizedBox(
                  height: 120,
                  child: Center(child: Text('Aucun collaborateur trouvé')),
                );
              }

              final users = snapshot.data!;
              print(
                'FutureBuilder: Users fetched: ${users.map((u) => u.toJson()).toList()}',
              );
              return SizedBox(
                height: 120,
                child: ListView.builder(
                  scrollDirection: Axis.horizontal,
                  itemCount: users.length,
                  padding: const EdgeInsets.symmetric(horizontal: 16),
                  itemBuilder: (context, index) {
                    final user = users[index];
                    return Padding(
                      padding: const EdgeInsets.only(right: 16),
                      child: Column(
                        children: [
                          CircleAvatar(
                            radius: 30,
                            backgroundImage:
                                user.image != null
                                    ? NetworkImage(user.image!)
                                    : const AssetImage(defaultProfileImage)
                                        as ImageProvider,
                            backgroundColor: Colors.grey,
                          ),
                          const SizedBox(height: 5),
                          Text(
                            '${user.firstname} ${user.lastname}',
                            style: const TextStyle(fontWeight: FontWeight.w500),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 2),
                          Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(
                                Icons.book_outlined,
                                size: 12,
                                color: Colors.blue,
                              ),
                              const SizedBox(width: 2),
                              Text(
                                '${user.loans}',
                                style: const TextStyle(
                                  color: Colors.blue,
                                  fontSize: 12,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    );
                  },
                ),
              );
            },
          );
        }),
      ],
    );
  }
}
