if(process.env.NODE_ENV == 'production'){
    modeule.exports = {
        mongoURI: 'mongodb://<dbuser>:<dbpassword>@ds131932.mlab.com:31932/mongochat_for_test'
    }
} else{
    module.process = {
        mongoURI: 'mongodb://127.0.0.1/mongochat'
    }
}