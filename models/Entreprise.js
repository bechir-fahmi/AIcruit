const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const EntrepriseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    companyName: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Hash du mot de passe avant sauvegarde
EntrepriseSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Vérification du mot de passe
EntrepriseSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Entreprise', EntrepriseSchema);    