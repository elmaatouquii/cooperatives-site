<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class EasySeeder extends Seeder
{
    public function run()
    {
        echo " Ajout des utilisateurs...\n";
        
        // أضف مستخدمين فقط
        DB::table('users')->insert([
            [
                'name' => 'Admin User',
                'email' => 'admin@test.com',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Manager User',
                'email' => 'manager@test.com',
                'password' => Hash::make('manager123'),
                'role' => 'manager',
                'created_at' => date('Y-m-d H:i:s'),
            ],
        ]);
        
        echo "Utilisateurs ajoutés!\n";
        echo "Admin: admin@test.com / admin123\n";
        echo "Manager: manager@test.com / manager123\n";
    }
}