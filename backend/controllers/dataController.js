const { BRANCHES, CAR_MODELS, CARS } = require('../constants');
const User = require('../models/User');

exports.getBranches = (req, res) => {
    res.json(BRANCHES);
};

exports.getCarModels = (req, res) => {
    res.json(CAR_MODELS);
};

exports.getFleet = (req, res) => {
    const carModelsMap = new Map(CAR_MODELS.map(m => [m.key, m]));
    const fullCarDetails = CARS.map(car => {
        const model = carModelsMap.get(car.modelKey);
        if (!model) return null;
        return {
            ...car,
            make: model.make,
            model: model.model,
            year: model.year,
            category: model.category,
            daily_price: model.daily_price,
            weekly_price: model.weekly_price,
            monthly_price: model.monthly_price,
            images: model.images,
        };
    }).filter(c => c !== null);
    res.json(fullCarDetails);
};

// Example for fetching a single car, useful for details pages
exports.getFleetCarById = (req, res) => {
    const { id } = req.params;
    const car = CARS.find(c => c.id === id);
    if (!car) return res.status(404).json({ msg: 'Car not found' });
    const model = CAR_MODELS.find(m => m.key === car.modelKey);
    if (!model) return res.status(404).json({ msg: 'Car model not found' });
    res.json({ ...car, ...model });
};

// Example for fetching users for admin panels
exports.getUsers = async (req, res) => {
    // In a real app, you'd add role checks from auth middleware
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if(!user) return res.status(404).json({ msg: 'User not found' });
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
