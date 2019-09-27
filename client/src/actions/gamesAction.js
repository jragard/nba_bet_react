import { ALL_GAMES } from '../config.js';

export const allGames = (data) => {
    return {
        type: ALL_GAMES,
        payload: data
    }
}