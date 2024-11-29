const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: 'your-minio-endpoint',
  port: 5000,
  useSSL: false,
  accessKey: 'your-access-key',
  secretKey: 'your-secret-key'
});

const bucketName = 'student-images';

// Ensure bucket exists
minioClient.bucketExists(bucketName, (err, exists) => {
  if (err) {
    return console.log('Error checking bucket:', err);
  }
  if (!exists) {
    minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
      if (err) return console.log('Error creating bucket:', err);
      console.log(`Bucket ${bucketName} created successfully`);
    });
  }
});

module.exports = {
  uploadToMalta: (file) => {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}-${file.originalname}`;
      
      minioClient.putObject(bucketName, fileName, file.buffer, (err, etag) => {
        if (err) return reject(err);
        
        const fileUrl = `${minioClient.protocol}//${minioClient.host}:${minioClient.port}/${bucketName}/${fileName}`;
        resolve({ fileName, fileUrl });
      });
    });
  },
  
  deleteFromMalta: (fileName) => {
    return new Promise((resolve, reject) => {
      minioClient.removeObject(bucketName, fileName, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  }
};