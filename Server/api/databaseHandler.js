const config = require('../config')
const { handleError, ErrorHandler } = require('../helpers/errors')
var mysql = require('mysql')
const util = require('util')
let idInsert;



async function insertImageDetails(fileName,description, type, size){
    const connection = mysql.createConnection(config.dbInfo);
    connection.connect(function(error){
        if (error){
            throw error;
        }
    });
    const queryMaker = util.promisify(connection.query).bind(connection);
    
    var query = "INSERT INTO DatabaseTest.images (imageName,description, fileType, fileSize) VALUES(?,?,?,?);";
    idInsert = await queryMaker(query, [fileName,description,type,size]);
    console.log(type)
    connection.end();


    return {
        success: "Everything is Ultra Fine",
        ID: idInsert['insertId']
    }

}

exports.insertImageDetails = insertImageDetails;