const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Expert = require('./models/Expert');
const Slot = require('./models/Slot');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  console.log('MongoDB connected. Seeding database...');
  
  // Clear existing
  await Expert.deleteMany({});
  await Slot.deleteMany({});

  const experts = [
    {
      name: 'Sarah Jenkins',
      category: 'Product Design',
      experience: '8+ years',
      rating: 4.9,
      reviewCount: 128,
      bio: 'Helping SaaS startups scale through strategic design systems and intuitive UX.',
      basePrice: 150
    },
    {
      name: 'Marcus Chen',
      category: 'Engineering',
      experience: '10+ years',
      rating: 5.0,
      reviewCount: 89,
      bio: 'Full-stack architecture and technical leadership for high-growth teams.',
      basePrice: 200
    }
  ];

  const createdExperts = await Expert.insertMany(experts);

  const slots = [];
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  for (let expert of createdExperts) {
    slots.push({ expertId: expert._id, date: dateStr, time: '10:00 AM', isBooked: false });
    slots.push({ expertId: expert._id, date: dateStr, time: '02:30 PM', isBooked: false });
    slots.push({ expertId: expert._id, date: tomorrowStr, time: '09:00 AM', isBooked: false });
    slots.push({ expertId: expert._id, date: tomorrowStr, time: '11:30 AM', isBooked: false });
  }

  await Slot.insertMany(slots);

  console.log('Database seeded successfully!');
  process.exit();
})
.catch((err) => {
  console.error(err);
  process.exit(1);
});
