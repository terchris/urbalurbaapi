const functions = require('firebase-functions');
const express = require('express');
const api = express();




/** system spessific code */
import * as categoryStuff from './category/category';
export const getOneCategory = categoryStuff.getOneCategory;
export const getAllCategories = categoryStuff.getAllCategories;

import {getStoredEntry, getAllEntries, getPopulatedEntry, getAllCategoryEntries } from './entry/entry';

exports.api = functions.https.onRequest(api);


api.get('/', (req, res) => {

    res.send(`
      <!doctype html>
      <head>
        <title>API for urbalurba</title>
      </head>
      <body>
      <h1>API for urbalurba</h1>
      <p>Running on google functions</p>
      <ul>
            <li>Get all categories /categories</li>
            <li>Get one category /category/<categoryname> eg /category/segment</li>
            <li>Get one raw entry /rawentry/<entryId> eg /rawentry/sintef</li>
            <li>Get all entries /entries/</li>
            <li>Get one entry and populate it /entry/<entryId> eg /entry/sintef</li>
            <li>Get all entries in a category /categoryentries/<caregory>/<categoryItem> eg /categoryentries/sdg/11</li>
      </ul>  

        <p> There are no error checking implemented. So a query for a nonexisting record will crash</p>

      </body>
    </html>`);
  });

// Get all categories
api.get('/categories', (req, res) => {
    const idName = req.params.idName;
    console.info("categories getting all catagories");

  const theRecord = getAllCategories()
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})

// Get one category
api.get('/category/:idName', (req, res) => {
    const idName = req.params.idName;
    console.log("category idName=", idName);
  const theRecord = getOneCategory(idName)
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})


// Get one raw entry
api.get('/rawentry/:idName', (req, res) => {
    const idName = req.params.idName;
    console.log("rawentry idName=", idName);
  const theRecord = getStoredEntry(idName)
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})

// Get all entries
api.get('/entries', (req, res) => {
    console.info("entries getting all entries");

  const theRecord = getAllEntries()
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})



// Get one entry and populate it
api.get('/entry/:idName', (req, res) => {
    const idName = req.params.idName;
    console.log("entry idName=", idName);
  const theRecord = getPopulatedEntry(idName)
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})



// Get all entries in a category
api.get('/categoryentries/:category/:categoryItem', (req, res) => {
    const category = req.params.category;
    const categoryItem = req.params.categoryItem;

    console.info("categoryentries entries in category =", category, " categoryItem=",categoryItem);

  const theRecord = getAllCategoryEntries(category, categoryItem)
  .then (returnedRecord => {
    //console.log(returnedRecord);
    res.status(200).send(returnedRecord);    
  })
  .catch(err => {
//TODO: handle error      
    console.log('Error getting documents', err);
  });
  
})






