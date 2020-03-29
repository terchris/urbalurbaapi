/**
 * API for returning entry (org or whatever)
 */

import { db,  catalog_entry } from '../datastore/datastoreinit';

import {getAllCategories } from './../category/category';
import {convertCategoryitems2Keys } from './../lib/lib';



 /** getStoredEntry
 * Returns one (the first) record where idName is the parameter
 * called like this http://<hostname>/api/org/abax
 * it will return the stored data of abax
 * 
 */

export async function getStoredEntry(idName) {
    return new Promise(async function (resolve, reject) {


      try {
        const catalog_entryRef = db.collection(catalog_entry);
        console.info('getStoredEntry: idName=', idName);
        const snapshot = await catalog_entryRef.where('idName', '==', idName).get();
  
        if (snapshot.empty) {
            const errMsg = 'getStoredEntry: Error No org with idName = ' + idName;
          console.error(errMsg);
          reject(new Error(errMsg));
        } else {
          
          if (snapshot.docs.length > 1) console.error("getStoredOrg: inconsistency in db. More than one category with the same idName. Thre are " + snapshot.docs.length + " that has idName=",idName);
  
          snapshot.forEach(doc => {
            const record = doc.data();
            console.info("getStoredEntry: Found org  displayName= ", record.displayName);            
            resolve(record);
          });
  
        }
      }
      catch (err) {
        console.error('getStoredEntry: Error getting documents', err);
        reject(new Error('getStoredEntry: Error getting documents'));
      }
    })
  }
  

/* end  */



/** getPopulatedEntry
 * Returns a fully populated entry that can be used to display it. 
 * Uses getStoredEntry to get the stored entry and populateEntryCategories to fill in categories
 * 
 */

export async function getPopulatedEntry(idName) {
  return new Promise(async function (resolve, reject) {


    try {
      const storedEntryRecord = await getStoredEntry(idName);
      //console.info('getPopulatedEntry: stored entry=', JSON.stringify(storedEntryRecord));

      let populatedEntryRecord = await populateEntryCategories(storedEntryRecord);
      //console.info('getPopulatedEntry: populated entry=', JSON.stringify(populatedEntryRecord));
      
//TODO: this should be removed - data validity must be done when putting data , no when reading
      //We are dealing with old datastructure. So we need to add stuff if its not there
      if (typeof populatedEntryRecord.parent === 'undefined' || populatedEntryRecord.parent === null) {     // variable is undefined or null
        console.log("entry/getPopulatedEntry =>  populatedEntryRecord.parent: UNDEFINED");

        // an org does not have a parent. so fill in from the current org
        populatedEntryRecord.parent = {
          "entryType": populatedEntryRecord.categories.organizationType,
          "idName": populatedEntryRecord.idName,
          "displayName": populatedEntryRecord.displayName,
          "insightly_id": populatedEntryRecord.insightly_id,
          "phone": populatedEntryRecord.phone,
          "image": {
            "large": populatedEntryRecord.image.large,
            "medium": populatedEntryRecord.image.medium,
            "small": populatedEntryRecord.image.small
          },
          "url": populatedEntryRecord.url,
          "location": {
            "shippingAddress": populatedEntryRecord.location.shippingAddress,
            "gps": {
              "_latitude": populatedEntryRecord.location.gps._latitude,
              "_longitude": populatedEntryRecord.location.gps._longitude
            }
          }
        };
      }






      resolve(populatedEntryRecord);
    }
    catch (err) {
      console.error('getPopulatedEntry: Error getting documents', err);
      reject(new Error('getPopulatedEntry: Error getting documents'));
    }
  })
}


/* end  */







 /** getAllEntries
 * Returns all Entries
 * called like this http://<hostname>/api/category
 * 
 */

export async function getAllEntries() {
  return new Promise(async function (resolve, reject) {


    try {
      const catalog_entryRef = db.collection(catalog_entry);
      console.info('getAllEntries: ');
      const snapshot = await catalog_entryRef.get();

      if (snapshot.empty) {
          const errMsg = 'getAllEntries: Error No entries !';
        console.error(errMsg);
        reject(new Error(errMsg));
      } else {
        
        let allEntriesArray = [] as any;

        snapshot.forEach(doc => {
          allEntriesArray.push( doc.data());
        });
        resolve(allEntriesArray);
      }
    }
    catch (err) {
      console.error('getAllEntries: Error getting documents', err);
      reject(new Error('getAllEntries: Error getting documents'));
    }
  })
}


/* end  */

 /** getAllCategoryEntries
 * Returns all Entries in a category
 * 
 */

export async function getAllCategoryEntries(category, categoryItem) {
  return new Promise(async function (resolve, reject) {
    const theCategory = "categories." + category;  

    try {
      const catalog_entryRef = db.collection(catalog_entry);
      console.info('getAllCategoryEntries: category=', category, " categoryItem=", categoryItem);

      const snapshot = await catalog_entryRef.where(theCategory, 'array-contains', categoryItem).get();
      if (snapshot.empty) {
          const errMsg = 'getAllCategoryEntries: Error No entries !';
        console.error(errMsg);
        reject(new Error(errMsg));
      } else {
        
        let allEntriesArray = [] as any;

        snapshot.forEach(doc => {
          allEntriesArray.push( doc.data());
        });
        resolve(allEntriesArray);
      }
    }
    catch (err) {
      console.error('getAllCategoryEntries: Error getting documents', err);
      reject(new Error('getAllCategoryEntries: Error getting documents'));
    }
  })
}


/* end  */





/** populateEntryCategories
 * Takes a entry/org record as parameter and populate the "categories:" with full category info
 * (images and help text) based on the stored values in "categories:"
 * It fetches all categoriy definitions using by accessing the database
 * Returns a populated entry/org
 * @param {*} theEntry 
 */
export async function populateEntryCategories(theEntry) {
  console.log("entry/populateEntryCategories ");

  // first get all categories
  let allCategories = [] as any;
  allCategories = await getAllCategories();
//TODO: check that we get the categories

 // console.log(`entry/populateEntryCategories all categories:`, JSON.stringify(allCategories));


  let theCategoryItem = [] as any;
  var allCategoryEntries = Object.entries(theEntry.categories);
 // console.log("entry/populateEntryCategories allCategoryEntries ", JSON.stringify(allCategoryEntries));

  let newCategoryRecord = [] as any; //decalere it here. 

  for (let [currentCategoryName, categoryItems = [] as any] of allCategoryEntries) {  //loop all categories for the entry
     // console.log(`entry/populateEntryCategories currentCategoryName ${currentCategoryName}: categoryItems=`, JSON.stringify( categoryItems), ": is typeof:", typeof categoryItems);            
     
      let categoryKeys = [] as any; //for storing the keys

      //Tree types of values can be stored. Just an array of strings, key value pairs, tag
      //figure out if the categoryName array of strings like this eg:  "sdg": [ "11","13"]
      //or if it is key value pairs like this eg:  {"expected":"some txt","measured":"Ikke utført ennå."}
      //or if it is a tag - then there are no definition

      if( Array.isArray(categoryItems))
      {
          // it is an array of strings like this eg:  "sdg": [ "11","13"]
          //We must nw verify that all the items in the array are legal keys
         // console.log(`entry/populateEntryCategories isArray categoryItems=`, JSON.stringify( categoryItems));       
          categoryKeys = convertCategoryitems2Keys(theEntry.categories[currentCategoryName]);
      } else
      {   // is key value pairs like this eg:  {"expected":"some txt","measured":"Ikke utført ennå."}
          //console.log(`entry/populateEntryCategories key value pairs categoryItems=`, JSON.stringify( categoryItems));       
          categoryKeys = Object.keys(categoryItems);
      } 
     console.log(`entry/populateEntryCategories categoryKeys= `, JSON.stringify( categoryKeys));                        

          // now lets loop loop the list and find the category record for each stored value
          // but first we need to see if there is a category 
          const categoryRecord = allCategories.find(XcategoryName => XcategoryName.idName == currentCategoryName);
          //categoryRecord contains the category definition with all its possible selections, bacground colors etc.
          //console.log("LIB/populateEntryCategories categoryRecord:",categoryRecord,":");
          //console.log("LIB/populateEntryCategories categoryRecord ", JSON.stringify(categoryRecord));

          if (typeof categoryRecord != "undefined") { //we got a category
              // Make a copy of its properties
              newCategoryRecord = {
                  "displayName": categoryRecord.displayName,
                  "idName": categoryRecord.idName,
                  "categorytype": categoryRecord.categorytype,
                  "categoryItems": [] as any
              };

              console.log("entry/populateEntryCategories newCategoryRecord ", JSON.stringify(newCategoryRecord));
              //so back to looping the stored values



                categoryKeys.map(currentCategoryKey => { //find the record for each key
                    //console.log("LIB/populateEntryCategories currentCategoryKey ", JSON.stringify(currentCategoryKey));
                    //console.log("LIB/populateEntryCategories categoryRecord.categoryItems ", JSON.stringify(categoryRecord.categoryItems));
                    //IF the categorytype is "tag" then there are no definitions for the categoryItems
                    if (newCategoryRecord.categorytype === "tag") { //if it is a "tag" then we will copy the values from the category to category to all categoryItems
                    theCategoryItem = {
                        "sortOrder": 0,
                        "summary": currentCategoryKey,
                        "idName": currentCategoryKey,
                        "displayName": currentCategoryKey,
                        "description": currentCategoryKey,
                        "image": categoryRecord.image,
                        "color": categoryRecord.color
                      };
//TODO:displayName and description can be converted back to the initial tag text eg sace was replaced with _ and å is aa and ø is oe and æ is ae
                      newCategoryRecord.categoryItems.push(theCategoryItem);
                    }
                    else // since it is not a "tag" we can find the definitions and populate 
                    {
                      theCategoryItem = categoryRecord.categoryItems.find(categoryItemName => categoryItemName.idName == currentCategoryKey);
                      //console.log("LIB/populateEntryCategories theCategoryItem ", JSON.stringify(theCategoryItem));
                      if (typeof theCategoryItem != "undefined") { //we got a category

                          // if currentCategoryName is key value pairs
                          if( ! Array.isArray(categoryItems)) {
                              theCategoryItem.value = categoryItems[currentCategoryKey];
                              //console.log("LIB/populateEntryCategories value--> ", theCategoryItem.value);
                          }    
                          // copy the categoryItem to the newCategoryRecord
                          newCategoryRecord.categoryItems.push(theCategoryItem);
                          
                          //console.log("LIB/populateEntryCategories newCategoryRecord ", JSON.stringify(newCategoryRecord));
                      } else
                          console.log("integrety Error! No category item for currentCategoryKey ", currentCategoryKey)
                    }         

                });
            
          } else
              console.log("integrety Error!  No category for currentCategoryName ", currentCategoryName);



          //console.log("LIB/populateEntryCategories newCategoryRecord ", JSON.stringify(newCategoryRecord));
          theEntry.categories[currentCategoryName] = newCategoryRecord;
      // console.log("LIB/populateEntryCategories oneOrg ", JSON.stringify(oneOrg));

  } //end for loop

  return theEntry;
}

