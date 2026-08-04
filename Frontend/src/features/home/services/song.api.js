import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/",
    withCredentials: true,
});

const FALLBACK_SONGS = {
    happy: [
        {
            _id: "fallback-happy-1",
            title: "Lady Singham",
            artist: "Moodify Originals",
            url: "https://ik.imagekit.io/hnoglyswo0/cohort-2/moodify/songs/Lady_Singham_gs01DFz-1.mp3",
            posterUrl: "https://ik.imagekit.io/hnoglyswo0/cohort-2/moodify/posters/Lady_Singham_VW8DGJkie.jpeg",
            mood: "happy"
        },
        {
            _id: "fallback-happy-2",
            title: "Sunshine Euphoria",
            artist: "SoundHelix",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop",
            mood: "happy"
        }
    ],
    sad: [
        {
            _id: "fallback-sad-1",
            title: "Melancholic Rain",
            artist: "SoundHelix",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            posterUrl: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?q=80&w=800&auto=format&fit=crop",
            mood: "sad"
        }
    ],
    surprised: [
        {
            _id: "fallback-surprised-1",
            title: "Electric Pulse",
            artist: "SoundHelix",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
            posterUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
            mood: "surprised"
        }
    ],
    neutral: [
        {
            _id: "fallback-neutral-1",
            title: "Midnight Ambient Chill",
            artist: "SoundHelix",
            url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
            posterUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop",
            mood: "neutral"
        }
    ]
};

export async function getSong({ mood }) {
    const cleanMood = (mood || "happy").toLowerCase().replace(/[^a-z]/g, "");
    
    try {
        let response;
        try {
            response = await api.get(`/api/songs?mood=${cleanMood}`);
        } catch {
            response = await api.get(`/api/songs/${cleanMood}`);
        }

        if (response?.data) {
            const rawSong = response.data.song || (Array.isArray(response.data.songs) ? response.data.songs[0] : response.data.songs);
            if (rawSong) {
                return {
                    song: {
                        ...rawSong,
                        posterUrl: rawSong.posterUrl || rawSong.postedUrl || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop",
                        artist: rawSong.artist || "Moodify Artist"
                    }
                };
            }
        }
    } catch (err) {
        console.warn("Backend song endpoint unreachable, using mood preset fallback:", err);
    }

    const pool = FALLBACK_SONGS[cleanMood] || FALLBACK_SONGS.happy;
    const fallbackSong = pool[Math.floor(Math.random() * pool.length)];
    return { song: fallbackSong };
}