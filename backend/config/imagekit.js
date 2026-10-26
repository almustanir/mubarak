import ImageKit from '@imagekit/nodejs'
import fs from 'fs'
import { url } from 'inspector';

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

//to upload image
export const uploadToImageKit = async (fileInput, fileName) => {
    try {
        let fileToUpload;
        if(Buffer.isBuffer(fileInput)) {
            fileToUpload = fileInput.toString('base64')
        }else {
            fileToUpload = fs.createReadStream(fileInput);
        }

        const result = await imagekit.files.upload({
            file: fileToUpload,
            fileName: fileName,
            folder: '/employee_profiles'
        });
        return result;

    } 
    
    catch (error) {
        throw new Error(`imagekit upload failed: ${error.message}`);
    }
};

//to delete an image from the image kit 
export const deleteFromImageKit = async (url) => {
    try {
        if(url || typeof url !== 'string' || !url.includes('ik.imagekit.io')) {
            
        }
    } catch (error) {
        
    }
}
