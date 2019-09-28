import { ALL_GAMES, GAMES_BY_MONTH, ALL_GAMES_FEED } from '../config.js';

export const allGames = (data) => {
    return {
        type: ALL_GAMES,
        payload: data
    }
}

export const gamesByMonthAction = (data) => {
    return {
        type: GAMES_BY_MONTH,
        payload: data
    }
}

export const allGamesFeedAction = (data) => {
    return {
        type: ALL_GAMES_FEED,
        payload: data
    }
}