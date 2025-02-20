const Joi = require('joi');

const validateInput = (schema, data) => {
    return schema.validate(data, { abortEarly: false }); // Retourne toutes les erreurs
};

module.exports = validateInput;
