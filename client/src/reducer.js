import { ALL_GAMES, GAMES_BY_MONTH, ALL_GAMES_FEED} from './config.js';

export const reducerState = {
    allGames: null,
    gamesByMonth: null,
    allGamesFeed: null
}

export const reducer = (state = reducerState, action) => {
    
    switch(action.type) {
        case ALL_GAMES:
            return {...state,
                    allGames: action.payload
            }
        case GAMES_BY_MONTH:
            return {...state,
                    gamesByMonth: action.payload
            }
        case ALL_GAMES_FEED:
            return {...state,
                    allGamesFeed: action.payload
            }
        default:
            return {...state};
    }
}