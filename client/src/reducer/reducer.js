import { ALL_GAMES, GAMES_BY_DATE, STORE_WEB_3 } from './config.js';

export const reducerState = {
    allGames: null,
    // gamesByMonth: null,
    // allGamesFeed: null,
    gamesByDate: null,
    web3: null,
    accounts: null,
    contract: null
}

export const reducer = (state = reducerState, action) => {
    
    switch(action.type) {
        case ALL_GAMES:
            return {...state,
                    allGames: action.payload
            }
        case STORE_WEB_3:
            return {...state,
                    web3: action.payload.web3,
                    accounts: action.payload.accounts,
                    contract: action.payload.contract
            }
        // case GAMES_BY_MONTH:
        //     return {...state,
        //             gamesByMonth: action.payload
        //     }
        // case ALL_GAMES_FEED:
        //     return {...state,
        //             allGamesFeed: action.payload
        //     }
        case GAMES_BY_DATE:
            return {...state,
                    gamesByDate: action.payload
            }
        default:
            return {...state};
    }
}