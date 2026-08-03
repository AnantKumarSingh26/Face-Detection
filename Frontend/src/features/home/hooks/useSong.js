import { getSong } from "../services/song.api"
import { useContext } from "react";
import { SongContext } from "../song.context"

const useSong = ({ children }) => {
    const context = useContext(SongContext)

    const { loading, setLoading, song, setSong } = context

    async function handleGetSong({mood}) {
        setLoading(true)
        const data = await getSong({mood})
        setSong(data.song)
        setLoading(false)

    }
    return ({
        loading,
        song,
        handleGetSong
    })
}