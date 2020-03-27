


/** string2IdKey
* idKey: convert to string if its not
* idKey: set to lowecase
* idKey: starting and tailing space will be removed
* idKey: remove special chars
* idKey: spaces will be replaced with - 
*/
export function string2IdKey(idKey) {
    const orginalidKey = idKey;

    let idKeyStr = String(idKey); // make sue it is a string
/*
//TODO:delete
    if (!typeof idKey === 'string') {
        idKey = String(idKey); //convert to string if its not
    }
*/    
    idKeyStr = idKeyStr.toLowerCase(); //maks sure it is lowercase
    idKeyStr = idKeyStr.trim(); // remove starting and tailing spaces
    //idKey = idKey.replace(/[^\w\s]/gi, ''); //remove any special chars
    idKeyStr = idKeyStr.replace(/\s+/g, '-'); //replace spaces with -
    if (orginalidKey !== idKeyStr) {
        // console.log("LIB/formatIdKey ==> CHANGED orginalidKey -", orginalidKey, "- to -", idKey, "-");
    }

    return idKey
}



/** convertCategoryitems2Keys
 * Takes the categry holding the categoryitems that is saved on the entry
 * and finds its keys by removing blanks etc.
 * The keys can after this be used to look up in the deinition of all categories 
 * @param {*} category 
 */
export function convertCategoryitems2Keys(category) { //eg for segment
    let localCategory;
    let localKey = [] as any;
    let returnCategory = [] as any;
    localCategory = category;
    localCategory.map(currentCategoryKey => {
        localKey = string2IdKey(currentCategoryKey);
        //console.log("LIB/getCatagoryItemAnswerKeys The key is :", localKey);
        returnCategory.push(localKey);
    });
    return returnCategory;
}
