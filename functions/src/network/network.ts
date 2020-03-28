/**
 * API for returning networks
 */

import { db,  catalog_network } from './../datastore/datastoreinit';



 /** getOneNetwork
 * Returns one (the first) record where idName is the parameter
 * called like this http://<hostname>/api/network/sbn
 * it will return the network sbn
 */

export async function getOneNetwork(idName) {
    return new Promise(async function (resolve, reject) {


      try {
        const catalog_networksRef = db.collection(catalog_network);
        console.info('getOneNetwork: idName=', idName);
        const snapshot = await catalog_networksRef.where('idName', '==', idName).get();
  
        if (snapshot.empty) {
            const errMsg = 'getOneNetwork: Error No network with idName = ' + idName;
          console.error(errMsg);
          reject(new Error(errMsg));
        } else {
          
          if (snapshot.docs.length > 1) console.error("getOneNetwork: inconsistency in db. More than one network with the same idName. Thre are " + snapshot.docs.length + " that has idName=",idName);
  
          snapshot.forEach(doc => {
            const record = doc.data();
            console.info("getOneNetwork: Found category  displayName= ", record.displayName);            
            resolve(record);
          });
  
        }
      }
      catch (err) {
        console.error('getOneNetwork: Error getting documents', err);
        reject(new Error('getOneNetwork: Error getting documents'));
      }
    })
  }
  

/* end  */




 /** getAllNetworks
 * Returns all networks
 * called like this http://<hostname>/api/networks
 * 
 */

export async function getAllNetworks() {
  return new Promise(async function (resolve, reject) {


    try {
      const catalog_networksRef = db.collection(catalog_network);
      console.info('getAllNetworks: ');
      const snapshot = await catalog_networksRef.get();

      if (snapshot.empty) {
          const errMsg = 'getAllNetworks: Error No networks !';
        console.error(errMsg);
        reject(new Error(errMsg));
      } else {
        
        let allNetworksArray = [] as any;

        snapshot.forEach(doc => {
          allNetworksArray.push( doc.data());
          //console.info("getAllNetworks: Found network  displayName= ", record.displayName);                      
        });
        resolve(allNetworksArray);
      }
    }
    catch (err) {
      console.error('getAllNetworks: Error getting documents', err);
      reject(new Error('getAllNetworks: Error getting documents'));
    }
  })
}


/* end  */