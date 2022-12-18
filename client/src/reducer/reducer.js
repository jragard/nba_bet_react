import { STORE_WEB_3, HYDRATE_GAMES } from './config.js';

export const reducerState = {
    allGames: null,
    gamesByMonth: null,
    gamesByDate: null,
    web3: null,
    accounts: null,
    contract: null
}

export const reducer = (state = reducerState, action) => {
    
    switch(action.type) {
        case HYDRATE_GAMES:
            return {...state,
                    allGames: action.payload.allGames,
                    gamesByDate: action.payload.gamesByDate,
                    gamesByMonth: action.payload.gamesByMonth
            }
        case STORE_WEB_3:
            return {...state,
                    web3: action.payload.web3,
                    accounts: action.payload.accounts,
                    contract: action.payload.contract
            }
        default:
            return {...state};
    }
}