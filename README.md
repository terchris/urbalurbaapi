# urbalurbaapi
api for accessing membership system. (cloud functions)

API for reading data that will be displayed in urbalurba membership catalog (running on firestore)

# will be hosted on firestore and maintained via github
Deploy will be from master branch directly to firestore

# Install and setup
1) npm install -g firebase-tools
2) firebase login
3) firebase init functions
4) uncomment in functions/src/index.ts so that the test can run
5) firebase deploy --only functions
