const mongoose = require('mongoose');

const thesaurusSchema = new mongoose.Schema({
    word: String,
    synonyms: [String],
    antonyms: [String]
});

const HistoryModel = mongoose.model("Thesaurus", thesaurusSchema);

module.exports = HistoryModel;