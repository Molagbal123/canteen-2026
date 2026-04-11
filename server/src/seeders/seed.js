import dotenv from 'dotenv';
dotenv.config();

import sequelize from '../config/database.js';
import { User, Food } from '../models/index.js';

const foodItems = [
  {
    name: 'Com Tam Suon Bi',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=600&h=400&fit=crop',
    description: 'Cơm tấm ăn kèm sườn nướng, bì heo thái chỉ và đồ chua. Món ăn quen thuộc của miền Nam.',
    category: 'Cơm',
  },
  {
    name: 'Com Ga Xoi Mo',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&h=400&fit=crop',
    description: 'Gà xối mỡ giòn rụm với cơm chiên, nước dưa chuột và nước chấm cay ngọt.',
    category: 'Cơm',
  },
  {
    name: 'Com Chien Duong Chau',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=400&fit=crop',
    description: 'Cơm chiên kiểu Dương Châu với tôm, lạp xưởng, đậu Hà Lan và trứng.',
    category: 'Cơm',
  },
  {
    name: 'Pho Bo Tai',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=400&fit=crop',
    description: 'Phở bò tái truyền thống với nước dùng hầm xương kỹ lưỡng, thơm mùi hoa hồi và quế.',
    category: 'Mì',
  },
  {
    name: 'Bun Bo Hue',
    price: 42000,
    image: 'https://images.unsplash.com/photo-1576577445504-6af96477db52?w=600&h=400&fit=crop',
    description: 'Bún bò cay nồng chuẩn vị xứ Huế với bắp bò, sợi bún to và nước bành sả ớt đậm đà.',
    category: 'Mì',
  },
  {
    name: 'Mi Xao Hai San',
    price: 48000,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=400&fit=crop',
    description: 'Mì xào giòn với tôm, mực và rau củ tươi trong nước sốt dầu hào thơm phức.',
    category: 'Mì',
  },
  {
    name: 'Banh Mi Thit',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1600688640154-9619e002df30?w=600&h=400&fit=crop',
    description: 'Bánh mì giòn rụm kẹp thịt nướng, pate, đồ chua, ngò rí và vài lát ớt chuông.',
    category: 'Ăn Vặt',
  },
  {
    name: 'Goi Cuon Tom Thit',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb44?w=600&h=400&fit=crop',
    description: 'Gỏi cuốn tôm thịt, bún, rau xà lách tươi xanh chấm cùng tương đậu phộng.',
    category: 'Ăn Vặt',
  },
  {
    name: 'Tra Dao Cam Sa',
    price: 22000,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=400&fit=crop',
    description: 'Trà đào cam sả thanh mát, chát nhẹ vị trà và thơm vị sả tươi.',
    category: 'Nước Uống',
  },
  {
    name: 'Ca Phe Sua Da',
    price: 18000,
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefda?w=600&h=400&fit=crop',
    description: 'Cà phê phin truyền thống của Việt Nam đậm đà hòa với sữa đặc có đường siêu đã.',
    category: 'Nước Uống',
  },
  {
    name: 'Che Ba Mau',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&h=400&fit=crop',
    description: 'Chè 3 màu truyền thống với lớp đậu xanh, đậu đỏ, thạch lá dứa và nước cốt dừa.',
    category: 'Tráng Miệng',
  },
  {
    name: 'Banh Flan Caramel',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&h=400&fit=crop',
    description: 'Bánh flan mềm mịn béo ngậy được phủ lên một lớp caramel đặc sánh hấp dẫn.',
    category: 'Tráng Miệng',
  },
];

const seed = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL');

    await sequelize.sync({ force: true });
    console.log('Tables created');

    const admin = await User.create({
      name: 'Admin',
      email: 'admin@cafeteria.com',
      password: 'admin123',
      role: 'admin',
      phone: '0901234567',
      address: 'Room A1-101, Building A',
    });
    console.log('Admin user created:', admin.email);

    const user = await User.create({
      name: 'Nguyen Van Minh',
      email: 'minh@student.edu.vn',
      password: 'user123',
      role: 'user',
      phone: '0912345678',
      address: 'Room B2-305, Building B',
    });
    console.log('Test user created:', user.email);

    await Food.bulkCreate(foodItems);
    console.log(`${foodItems.length} food items seeded`);

    console.log('\nSeed completed successfully!');
    console.log('Admin login: admin@cafeteria.com / admin123');
    console.log('User login: minh@student.edu.vn / user123');

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seed();
