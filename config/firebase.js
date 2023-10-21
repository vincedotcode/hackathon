const admin = require('firebase-admin');
const serviceAccount = require('./zapcom.json');

console.log("Before Firebase Initialization");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "zapcom-a80cb.appspot.com"
});

console.log("After Firebase Initialization");

const bucket = admin.storage().bucket();


const uploadToFirebase = async (fileBuffer, fileName) => {
  try {
    const file = bucket.file(fileName);
    await file.save(fileBuffer, {
      metadata: {
        contentType: 'image/png', 
        cacheControl: 'public, max-age=31536000',
      },
    });

    const signedUrl = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    });
    
    console.log(`${fileName} uploaded to Firebase successfully.`);
    return { success: true, message: `${fileName} uploaded successfully.`, url: signedUrl[0] };
  } catch (error) {
    console.error('Error uploading file to Firebase:', error);
    return { success: false, message: 'Error uploading to Firebase', error };
  }
};

module.exports = {admin, uploadToFirebase};
