const express = require('express');
const app = express();
const config = require('./config.js');
const { handleError, ErrorHandler } = require('./helpers/errors')
const {createQueryEs} = require('./helpers/esQueryConstructor')

//Elastic Search Declaration:
var elasticSearch = require('elasticsearch');
let client = new elasticSearch.Client({
    host: config.elasticSearchPort
});

//Callback functions:

const handleSingleImage = require('./helpers/fileHandler').uploadSingleImage;

//endpoints:
const ImageUploader = require('./api/ImageLoader.js');
app.post('/api/uploadImage', handleSingleImage, ImageUploader.uploadImageJS);

//Gets:

app.get('/api/search/',function(req, res, next){
  const query = createQueryEs(req.query)
  //Endpoint part:

  client.search({
    index:'images',
    body:{
      "query":query
    }
    
  }, function(err, resp, status){
    if(err){
      res.status(500).send(err)
      //throw new ErrorHandler(500, "f")
    }else{
      let hits = resp.hits.hits
      if (hits.length){
        res.status(200).send(hits)
      }
      else{
        res.status(204).send()
      }
    }
  })

  
})

// Error handling:
app.use((err, req, res, next) => {
  handleError(err, res);
});

app.use((req, res, next) => {
  throw new ErrorHandler(500, "unexpected");
});

app.get('/error', (req, res) => {
    throw new ErrorHandler(500, 'internal server error');
})

//Listen to server:
app.listen(config.port, () => console.log(`Listening at port: ${config.port}`));