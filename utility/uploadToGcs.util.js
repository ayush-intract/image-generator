
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

const uploadMetadataToGcs = async (metadata, filename) => {
    try {
      const file = bucket.file(filename);
      const metadataString = JSON.stringify(metadata);
      await file.save(metadataString, {
        contentType: 'application/json'
      });
      return file.publicUrl();
    } catch (error) {
      console.error('Error uploading metadata to GCS:', error.message);
      console.error('Error:', error);
      throw error;
    }
}

// async function uploadToGcs(buffer, filename) {
//   const file = bucket.file(filename);
//   await file.save(buffer, {
//     contentType: 'image/png'
//   });
//   return file.publicUrl();
// }

module.exports = {
    uploadToGcs,
    uploadMetadataToGcs
}

