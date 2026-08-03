const ImageKit = require("@imagekit/nodejs").default || require("@imagekit/nodejs");
// const ImageKit = require("imagekit");

const client = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

async function uploadFile({buffer, filename ,folder=""}) {
    try {
        const file = await client.files.upload({
            file: await ImageKit.toFile(Buffer.from(buffer)),
            fileName: filename,
            folder
        });
        return file.url;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
}

module.exports = {
    uploadFile
}