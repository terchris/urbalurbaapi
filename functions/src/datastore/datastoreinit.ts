/**
 * Init the database connection and global constants
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'


admin.initializeApp(functions.config().firebase);
export const db = admin.firestore();

/** Global constants */
export const catalog_category = 'catalog_category';
export const catalog_entry = 'catalog_entry';

/* delete
export const backend_input = 'backend_input';
export const backend_queue = 'backend_queue';
export const catalog_organizations = 'catalog_organisation';
*/