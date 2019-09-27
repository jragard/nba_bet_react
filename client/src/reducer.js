import { ALL_GAMES } from './config.js';

export const reducerState = {
    allGames: null
}

export const reducer = (state = reducerState, action) => {
    
    switch(action.type) {
        case ALL_GAMES:
            return {...state,
                    allGames: action.payload
            }
        default:
            return {...state};
    }
}