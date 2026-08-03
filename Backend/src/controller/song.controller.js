const songModel = require("../models/song.model");
const id3 = require("node-id3");
const storageService = require("../services/storage.services");

async function uploadSong(req, res) {


    try {

        if (!req.file) {
            return res.status(400).json({ message: "Bhai, file kahan hai? Please ek gaana attach karo!" });
        }

        const songBuffer = req.file.buffer;
        const { mood } = req.body;

        const tags = id3.read(songBuffer);

        // Agar gaane me title na ho toh ek default naam de do
        const songTitle = tags.title || `song_${Date.now()}`;

        // 1. Dono promises ko define karein (par yahan 'await' mat lagayein)
        const songPromise = storageService.uploadFile({
            buffer: songBuffer,
            filename: songTitle + ".mp3",
            folder: "/cohort2/moodify/songs"
        });

        // 2. Poster promise me condition lagayein: 
        // Agar image hai toh upload karein, warna turant default URL resolve kar dein
        const posterPromise = (tags.image && tags.image.imageBuffer)
            ? storageService.uploadFile({
                buffer: tags.image.imageBuffer,
                filename: songTitle + ".jpg",
                folder: "/cohort2/moodify/posters"
            })
            : Promise.resolve("https://example.com/default-cover.jpg");

        // 3. Promise.all ka use karke dono ko ek sath run karein aur results nikal lein
        const [songFileUrl, posterFileUrl] = await Promise.all([songPromise, posterPromise]);


        // 3. Database me save karo (Schema ke exact naamo ke sath!)
        const song = await songModel.create({
            title: songTitle,
            url: songFileUrl,           // ✅ Schema ka 'url'
            postedUrl: posterFileUrl,   // ✅ Schema ka 'postedUrl'
            mood: mood
        });

        console.log("Database me save ho gaya:", song);

        res.status(201).json({
            message: "Song uploaded successfully",
            song
        });

    } catch (error) {
        console.error("Upload Error:", error);
        res.status(500).json({ message: error.message });
    }
}


async function getSongs(req, res) {
    try {
        const { mood } = req.query;
        let songs;

        // Agar URL me mood aaya hai (jaise: /songs?mood=happy)
        if (mood) {
            // .toLowerCase() use kiya taaki 'Happy' ya 'HAPPY' hamesha 'happy' ban jaye
            songs = await songModel.findOne({ mood: mood.toLowerCase() });
        } 
        // Agar URL me mood nahi aaya hai (jaise: /songs)
        else {
            songs = await songModel.find(); // Saare gaane nikal lo
        }

        // Agar database empty hai ya us mood ka koi gaana nahi hai
        if (!songs || songs.length === 0) {
            return res.status(404).json({ message: "Koi gaana nahi mila!" });
        }

        res.status(200).json({
            message: "Songs fetched successfully",
            count: songs.length,
            songs
        });

    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: "Server error while fetching songs" });
    }
}

module.exports = {
    uploadSong,
    getSongs
}