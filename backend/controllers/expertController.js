const Expert = require('../models/Expert');
const Slot = require('../models/Slot');

// Get all experts with pagination and filter
exports.getExperts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const category = req.query.category;
    const search = req.query.search;
    
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const experts = await Expert.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Expert.countDocuments(query);

    res.status(200).json({
      experts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      totalExperts: total
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching experts', error: error.message });
  }
};

// Get single expert with available slots
exports.getExpertById = async (req, res) => {
  try {
    const expert = await Expert.findById(req.params.id);
    if (!expert) return res.status(404).json({ message: 'Expert not found' });

    // Get available slots for this expert (only future slots in a real app, here we just return all unbooked)
    const availableSlots = await Slot.find({ 
      expertId: expert._id,
      isBooked: false 
    }).sort({ date: 1, time: 1 });

    res.status(200).json({
      expert,
      availableSlots
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expert details', error: error.message });
  }
};

// Admin/Seed route to add an expert
exports.addExpert = async (req, res) => {
  try {
    const expert = new Expert(req.body);
    await expert.save();
    res.status(201).json(expert);
  } catch (error) {
    res.status(400).json({ message: 'Error creating expert', error: error.message });
  }
};

// Admin/Seed route to add slots
exports.addSlots = async (req, res) => {
  try {
    const slots = req.body.slots; // array of slot objects {expertId, date, time}
    const inserted = await Slot.insertMany(slots);
    res.status(201).json(inserted);
  } catch (error) {
    res.status(400).json({ message: 'Error adding slots', error: error.message });
  }
};
