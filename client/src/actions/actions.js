import { ALL_GAMES, GAMES_BY_DATE, STORE_WEB_3 } from '../reducer/config.js';

export const gamesByDateAction = (data) => {
    return {
        type: GAMES_BY_DATE,
        payload: data
    }
}

export const allGamesAction = (data) => {
    return {
        type: ALL_GAMES,
        payload: data
    }
}

export const storeWeb3Action = (data) => {
    return {
        type: STORE_WEB_3,
        payload: data
    }
}