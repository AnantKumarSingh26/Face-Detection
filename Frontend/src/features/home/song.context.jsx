import {createContext} from "react";
import { useState } from "react";

export const SongContext = createContext()

export const SongContextProvider = ({children}) => {
    const [ song, setSong ] = useState({
        "url": "https://ik.imagekit.io/hnoglyswo0/cohort-2/moodify/songs/Lady_Singham_gs01DFz-1.mp3",
        "posterUrl": "https://ik.imagekit.io/hnoglyswo0/cohort-2/moodify/posters/Lady_Singham_VW8DGJkie.jpeg",
        "title": "Lady Singham",
        "mood": "happy",
    })

    const [loading, setLoading] = useState(false)

    return (
        <SongContext.Provider value={{song, setSong, loading, setLoading}}>
            {children}
        </SongContext.Provider>
    )
}
