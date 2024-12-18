
const {Storage} = require('@google-cloud/storage');
// import {Storage} from '@google-cloud/storage';

// Initialize GCP Storage
const storage = new Storage({
  keyFilename: 'cloud.json',
  projectId: 'intract-cloud'
});

// const bucketName = 'static.highongrowth.xyz';
const bucketName = process.env.GCS_BUCKET_NAME || 'static.highongrowth.xyz';
const bucket = storage.bucket(bucketName);

const uploadToGcs = async (buffer, filename) => {
    const file = bucket.file(filename);
    await file.save(buffer, {
      contentType: 'image/png'
    });
    return file.publicUrl();
}


// async function uploadToGcs(buffer, filename) {
//   const file = bucket.file(filename);
//   await file.save(buffer, {
//     contentType: 'image/png'
//   });
//   return file.publicUrl();
// }

module.exports = {
    uploadToGcs
}

