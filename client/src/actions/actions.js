import { STORE_WEB_3, HYDRATE_GAMES } from '../reducer/config.js';

export const storeWeb3 = (data) => {
    return {
        type: STORE_WEB_3,
        payload: data
    }
}

export const hydrateGames = (data) => {
    return {
        type: HYDRATE_GAMES,
        gamesByDate: data.gamesByDate,
        allGames: data.allGames,
    }
}