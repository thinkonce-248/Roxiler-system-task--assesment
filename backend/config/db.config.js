const mongoose = require('mongoose');

const connection = () => {

    return (
        mongoose.connect('mongodb+srv://Prathamesh1176:Hanuman%40001@cluster0.j7zg5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/transaction')
            .then(() => {
                console.log('MongoDB Connected')
            }).catch((error) => {
                console.log('Error');
            })
    )
}

module.exports = connection;