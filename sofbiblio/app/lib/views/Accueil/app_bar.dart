import 'package:app/views/profile/profile.dart';
import 'package:flutter/material.dart';
import 'package:get/get.dart';

class AccueilAppBar extends StatelessWidget {
  const AccueilAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Image.asset('assets/images/logo.png', height: 40),
          Row(
            children: [
              const SizedBox(width: 10),
              GestureDetector(
                onTap: () {
                  Get.to(() => ProfilePage());
                }, // Navigation vers profil
                child: const CircleAvatar(
                  radius: 20,
                  backgroundImage: AssetImage(
                    'assets/images/default_profile.png',
                  ),
                  backgroundColor: Colors.grey,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
