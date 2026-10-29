require('dotenv').config({ quiet: true });

const mongoose = require('mongoose');
const { connectDB } = require('./db');
const Food = require('./models/Food');

const foods = [
  {
    foodId: 'F001',
    name: 'Phở bò',
    category: 'Món nước',
    cuisine: 'Miền Bắc',
    ingredients: ['Bánh phở', 'Thịt bò', 'Xương bò', 'Hành lá'],
    price: 55000,
    quantity: 20,
    description: 'Phở bò truyền thống với nước dùng ninh từ xương bò.',
  },
  {
    foodId: 'F002',
    name: 'Bún bò Huế',
    category: 'Món nước',
    cuisine: 'Miền Trung',
    ingredients: ['Bún', 'Thịt bò', 'Giò heo', 'Sả', 'Mắm ruốc'],
    price: 60000,
    quantity: 15,
    description: 'Bún bò đậm đà, cay thơm theo phong cách Huế.',
  },
  {
    foodId: 'F003',
    name: 'Cơm tấm sườn',
    category: 'Món cơm',
    cuisine: 'Miền Nam',
    ingredients: ['Cơm tấm', 'Sườn heo', 'Nước mắm', 'Đồ chua'],
    price: 50000,
    quantity: 18,
    description: 'Cơm tấm dùng cùng sườn nướng và nước mắm chua ngọt.',
  },
  {
    foodId: 'F004',
    name: 'Bánh xèo',
    category: 'Món ăn vặt',
    cuisine: 'Miền Nam',
    ingredients: ['Bột gạo', 'Tôm', 'Thịt heo', 'Giá đỗ', 'Rau sống'],
    price: 45000,
    quantity: 12,
    description: 'Bánh xèo vàng giòn, dùng kèm rau sống và nước chấm.',
  },
  {
    foodId: 'F005',
    name: 'Gỏi cuốn tôm thịt',
    category: 'Món cuốn',
    cuisine: 'Miền Nam',
    ingredients: ['Bánh tráng', 'Tôm', 'Thịt heo', 'Bún', 'Hẹ'],
    price: 40000,
    quantity: 25,
    description: 'Gỏi cuốn tươi mát với tôm thịt và nước chấm đậu phộng.',
  },
];

async function seed() {
  try {
    await connectDB();
    await Food.init();
    await Food.bulkWrite(
      foods.map((food) => ({
        updateOne: {
          filter: { foodId: food.foodId },
          update: { $set: food },
          upsert: true,
        },
      }))
    );
    console.log(`Seeded ${foods.length} foods in database ${mongoose.connection.name}`);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seed();
