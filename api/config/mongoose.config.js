const mongoose = require('mongoose');

module.exports = (db_name) => {
    mongoose.connect(`mongodb://127.0.0.1/${db_name}`)
        .then(() => console.log(`✔✔ Established connection to the ${db_name} database`))
        .catch(err => console.log(`❌❌ Cannot connect to ${db_name} database`, err))
}
