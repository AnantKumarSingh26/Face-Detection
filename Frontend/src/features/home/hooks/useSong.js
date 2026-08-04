import { getSong } from "../services/song.api"
import { useContext } from "react";
import { SongContext } from "../song.context"

export const useSong = () => {
    const context = useContext(SongContext)

    if (!context) {
        throw new Error("useSong must be used within a SongContextProvider");
    }

    const { loading, setLoading, song, setSong, isPlaying, setIsPlaying } = context

    async function handleGetSong({ mood }) {
        setLoading(true)
        try {
            const data = await getSong({ mood })
            if (data?.song) {
                setSong(data.song)
            }
        } catch (err) {
            console.error("Error fetching song:", err)
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        setLoading,
        song,
        setSong,
        isPlaying,
        setIsPlaying,
        handleGetSong
    }
}

export default useSong;