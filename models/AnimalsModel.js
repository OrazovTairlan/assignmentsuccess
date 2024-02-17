const mongoose = require('mongoose');

const animalsSchema = new mongoose.Schema({
    name: String,
    taxonomy: {
        kingdom: String,
        phylum: String,
        class: String,
        order: String,
        family: String,
        genus: String,
        scientific_name: String
    },
    locations: [String],
    characteristics: {
        prey: String,
        name_of_young: String,
        group_behavior: String,
        estimated_population_size: String,
        biggest_threat: String,
        most_distinctive_feature: String,
        gestation_period: String,
        habitat: String,
        diet: String,
        average_litter_size: String,
        lifestyle: String,
        common_name: String,
        number_of_species: String,
        location: String,
        slogan: String,
        group: String,
        color: String,
        skin_type: String,
        top_speed: String,
        lifespan: String,
        weight: String,
        height: String,
        age_of_sexual_maturity: String,
        age_of_weaning: String
    }
});

const AnimalsModel = mongoose.model('Animals', animalsSchema);

module.exports = AnimalsModel