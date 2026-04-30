const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');
const User = require('./User');
const Admin = require('./Admin');
const Driver = require('./Driver');
const Vehicle = require('./Vehicle');
const Destination = require('./Destination');
const Trip = require('./Trip');
const TripDestination = require('./TripDestination');
const Booking = require('./Booking');
const Payment = require('./Payment');
const Review = require('./Review');
const UserFavorite = require('./UserFavorite');
const VerificationCode = require('./VerificationCode');
const Notification = require('./Notification');


// Define Associations

// Driver <-> Vehicle
Driver.hasMany(Vehicle, { foreignKey: 'driver_id', onDelete: 'CASCADE' });
Vehicle.belongsTo(Driver, { foreignKey: 'driver_id' });

// User <-> Trip
User.hasMany(Trip, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Trip.belongsTo(User, { foreignKey: 'user_id' });

// Trip <-> Destination (Through TripDestination)
Trip.belongsToMany(Destination, { through: TripDestination, foreignKey: 'trip_id', otherKey: 'destination_id' });
Destination.belongsToMany(Trip, { through: TripDestination, foreignKey: 'destination_id', otherKey: 'trip_id' });

// Trip <-> Booking
Trip.hasOne(Booking, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
Booking.belongsTo(Trip, { foreignKey: 'trip_id' });

// Driver <-> Booking
Driver.hasMany(Booking, { foreignKey: 'driver_id', onDelete: 'CASCADE' });
Booking.belongsTo(Driver, { foreignKey: 'driver_id' });

// Vehicle <-> Booking
Vehicle.hasMany(Booking, { foreignKey: 'vehicle_id', onDelete: 'CASCADE' });
Booking.belongsTo(Vehicle, { foreignKey: 'vehicle_id' });

// Booking <-> Payment
Booking.hasMany(Payment, { foreignKey: 'booking_id', onDelete: 'CASCADE' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

// Review Associations
User.hasMany(Review, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Driver.hasMany(Review, { foreignKey: 'driver_id', onDelete: 'CASCADE' });
Review.belongsTo(Driver, { foreignKey: 'driver_id' });

Trip.hasOne(Review, { foreignKey: 'trip_id', onDelete: 'CASCADE' });
Review.belongsTo(Trip, { foreignKey: 'trip_id' });

Destination.hasMany(Review, { foreignKey: 'destination_id', onDelete: 'CASCADE' });
Review.belongsTo(Destination, { foreignKey: 'destination_id' });

// User <-> Favorite <-> Destination
User.belongsToMany(Destination, { through: UserFavorite, as: 'FavoriteDestinations', foreignKey: 'user_id', otherKey: 'destination_id' });
Destination.belongsToMany(User, { through: UserFavorite, as: 'FavoritedBy', foreignKey: 'destination_id', otherKey: 'user_id' });
User.hasMany(UserFavorite, { foreignKey: 'user_id', onDelete: 'CASCADE' });
UserFavorite.belongsTo(User, { foreignKey: 'user_id' });
Destination.hasMany(UserFavorite, { foreignKey: 'destination_id', onDelete: 'CASCADE' });
UserFavorite.belongsTo(Destination, { foreignKey: 'destination_id' });

// User <-> Notification
User.hasMany(Notification, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'user_id' });



const syncDB = async () => {
    try {
        // alter: true updates the DB schema to match the models without dropping data
        await sequelize.sync({ alter: true });
        console.log('✅ All models successfully synchronized with MySQL Database.');

        // Database Seeding Logic for initial Admin
        const adminCount = await Admin.count();
        if (adminCount === 0) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            await Admin.create({
                username: 'admin',
                email: 'admin@surangatours.com',
                password: hashedPassword,
                role: 'admin'
            });
            console.log('✅ Default Super Admin Created (Username: admin | Password: admin123)');
        }

    } catch (error) {
        console.error('❌ Error synchronizing database:', error);
    }
};

module.exports = {
    syncDB,
    User,
    Admin,
    Driver,
    Vehicle,
    Destination,
    Trip,
    TripDestination,
    Booking,
    Payment,
    Review,
    UserFavorite,
    VerificationCode,
    Notification,
};

