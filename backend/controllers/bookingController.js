const Booking = require('../models/Booking');
const Slot = require('../models/Slot');

// Create a booking
exports.createBooking = async (req, res) => {
  const io = req.app.get('io');
  const { expertId, slotId, customerName, email, phone, date, timeSlot, notes } = req.body;

  try {
    // 1. Prevent Double Booking Race Condition using Atomic Update
    // findOneAndUpdate with isBooked: false ensures only one concurrent request can book this slot
    const updatedSlot = await Slot.findOneAndUpdate(
      { _id: slotId, isBooked: false },
      { $set: { isBooked: true } },
      { new: true }
    );

    if (!updatedSlot) {
      return res.status(409).json({ message: 'Sorry, this slot has just been booked by someone else.' });
    }

    // 2. Create the booking
    const booking = new Booking({
      expertId,
      slotId,
      customerName,
      email,
      phone,
      date,
      timeSlot,
      notes,
      status: 'Confirmed' // Or Pending, depending on business logic
    });

    await booking.save();

    // 3. Emit real-time event to clients to update the UI
    io.emit('slot_booked', { expertId, slotId, date, time: timeSlot });

    res.status(201).json({ message: 'Booking successful', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If cancelled, free up the slot
    if (status === 'Cancelled') {
      await Slot.findByIdAndUpdate(booking.slotId, { isBooked: false });
      const io = req.app.get('io');
      io.emit('slot_freed', { expertId: booking.expertId, slotId: booking.slotId, date: booking.date, time: booking.timeSlot });
    }

    res.status(200).json({ message: 'Status updated', booking });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};

// Get bookings by email
exports.getBookings = async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ message: 'Email query parameter is required' });
    }

    const bookings = await Booking.find({ email })
      .populate('expertId', 'name category imageUrl')
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
};
