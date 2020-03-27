/**
 * API for returning categories
 */
//import * as admin from 'firebase-admin';
import { db,  catalog_category } from './../datastore/datastoreinit';



 /** getOneCategory
 * Returns one (the first) record where idName is the parameter
 * called like this http://<hostname>/api/category/orgtype
 * it will return the category orgtype
 */

export async function getOneCategory(idName) {
    return new Promise(async function (resolve, reject) {


      try {
        const catalog_categoriesRef = db.collection(catalog_category);
        console.info('getCategory: idName=', idName);
        const snapshot = await catalog_categoriesRef.where('idName', '==', idName).get();
  
        if (snapshot.empty) {
            const errMsg = 'getCategory: Error No category with idName = ' + idName;
          console.error(errMsg);
          reject(new Error(errMsg));
        } else {
          
          if (snapshot.docs.length > 1) console.error("getCategory: inconsistency in db. More than one category with the same idName. Thre are " + snapshot.docs.length + " that has idName=",idName);
  
          snapshot.forEach(doc => {
            const record = doc.data();
            console.info("getCategory: Found category  displayName= ", record.displayName);            
            resolve(record);
          });
  
        }
      }
      catch (err) {
        console.error('getCategory: Error getting documents', err);
        reject(new Error('getCategory: Error getting documents'));
      }
    })
  }
  

/* end  */




 /** getAllCategories
 * Returns all categories
 * called like this http://<hostname>/api/category
 * 
 */

export async function getAllCategories() {
  return new Promise(async function (resolve, reject) {


    try {
      const catalog_categoriesRef = db.collection(catalog_category);
      console.info('getAllCategories: ');
      const snapshot = await catalog_categoriesRef.get();

      if (snapshot.empty) {
          const errMsg = 'getAllCategories: Error No categories !';
        console.error(errMsg);
        reject(new Error(errMsg));
      } else {
        
        let allCategoriesArray = [] as any;

        snapshot.forEach(doc => {
          allCategoriesArray.push( doc.data());
          //console.info("getCategory: Found category  displayName= ", record.displayName);                      
        });
        resolve(allCategoriesArray);
      }
    }
    catch (err) {
      console.error('getAllCategories: Error getting documents', err);
      reject(new Error('getAllCategories: Error getting documents'));
    }
  })
}


/* end  */