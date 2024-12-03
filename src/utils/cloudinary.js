import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    // it is secrete data don'nt need to show 
    api_key : 	639392966878455,
    // api_key: process.env.Cloudinary_ApiKey, 
    api_secret: process.env.CLODINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});

// console.log({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
   
//     // api_key: process.env.Cloudinary_ApiKey, 
//     api_secret: process.env.CLODINARY_API_SECRET
// })

const uploadOnClodinary = async(localFilePath) => {
    try {
        if(!localFilePath) return null
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath,{resource_type : "auto"})
    
       // file has been uploaded successfully
        console.log("file is uploaded on cloudinary : ",response.url);
        fs.unlinkSync(localFilePath) // remove from local
        return response

    } catch (error) {
        
        fs.unlinkSync(localFilePath) // remove the locally saved temporary  file as the upload operation got failed
        return null
     
    }
}

const deleteFromCloudinary = async(ImageUrl)=>{
    return cloudinary.uploader.destroy(ImageUrl);
}

const getPublishIdfromCloudinary=async(url)=>{
     const parts = url.split('/');
     return parts[parts.length-1].split('.')[0]
}

export {uploadOnClodinary,
    deleteFromCloudinary,
    getPublishIdfromCloudinary

}
