import { createStore, Action } from 'redux';
import { subscribeAuction, unsubscribeAuction } from './socket';
import { getFavorites } from "./products";

const USER_KEY: string = 'user';

// Action Types
export const SIGN_IN: string = 'SIGN_IN';
export const SIGN_OUT: string = 'SIGN_OUT';
export const USER_STATUS: string = 'USER_STATUS';
export const PRODUCTS_ADD: string = 'PRODUCTS_ADD';
export const ADD_AUCTION_STARTED: string = 'ADD_AUCTION_STARTED';
export const ADD_TO_CART: string = 'ADD_TO_CART';

export const SUBSCRIBE_AUCTION: string = 'SUBSCRIBE_AUCTION';
export const UNSUBSCRIBE_AUCTION: string = 'UNSUBSCRIBE_AUCTION';

export const NEW_BID_PUSH: string = 'NEW_BID_PUSH';
export const AUCTION_STARTED: string = 'AUCTION_STARTED';
export const AUCTION_ENDED: string = 'AUCTION_ENDED';
export const TOGGLE_FAVORITE: string = 'TOGGLE_FAVORITE';
export const UPDATE_AUCTION_LIST: string = 'UPDATE_AUCTION_LIST';
export const UPDATE_FAVORITES: string = 'UPDATE_FAVORITES';
export const UPDATE_USER_PROFILE: string = 'UPDATE_USER_PROFILE';

// Action creators
export const signIn = (user: any): Action => ({
    type: SIGN_IN,
    payload: user
});
export const signout = (): Action => ({
    type: SIGN_OUT
});
export const productsAdd = (products: any[]): Action => ({
    type: PRODUCTS_ADD,
    payload: products
});
export const addToCart = (product: any): Action => ({
    type: ADD_TO_CART,
    payload: product
});
export const addAuctionStarted = (id: string): Action => ({
    type: ADD_AUCTION_STARTED,
    payload: id
});

export const subscribeAuctionAction = (payload: any): Action => ({
    type: SUBSCRIBE_AUCTION,
    payload
});
export const unsubscribeAuctionAction = (payload: any): Action => ({
    type: UNSUBSCRIBE_AUCTION,
    payload
});

export const newBid = (payload: any): Action => ({
    type: NEW_BID_PUSH,
    payload
});
export const auctionStartedAction = (payload: any): Action => ({
    type: AUCTION_STARTED,
    payload
});
export const auctionEndedAction = (payload: any): Action => ({
    type: AUCTION_ENDED,
    payload
});

export const toggleFavorite = (payload: any): Action => ({
    type: TOGGLE_FAVORITE,
    payload
});

export const updateAuctionListAction = (payload: any): Action => ({
    type: UPDATE_AUCTION_LIST,
    payload
});

export const updateFavorites = (payload: any): Action => ({
    type: UPDATE_FAVORITES,
    payload
});

// reducers
interface State {
    user: any;
    products: any[];
    auctions: any[];
    auctionsStarted: any[];
    cart: any[];
    subscriptions: any[];
    favorites: any[];
    highestBid: any[];
    highestBidder: any[];
    currentBidder: number;
    currentBid: number;
    isLoggedIn: boolean;
    date: number | null;
}

function initializeState(): State {
    let initialState: State = {
        user: {},
        products: [],
        auctions: [],
        auctionsStarted: [],
        cart: [],
        subscriptions: [],
        favorites: [],
        highestBid: [],
        highestBidder: [],
        currentBidder: 0,
        currentBid: 0,
        isLoggedIn: false,
        date: null
    };
    let user = JSON.parse(localStorage.getItem(USER_KEY)) || {};
    if (user.header) {
        initialState.isLoggedIn = true;
    }
    return Object.assign({}, initialState, { user });
}

const reducer = (state: State = initializeState(), action: Action): State => {
    switch (action.type) {
        case SIGN_IN:
            let user = action.payload;
            user.header = user.userPassword;
            let date = Date.now();
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            return Object.assign({}, state, { user, isLoggedIn: true, date });
        case SIGN_OUT:
            localStorage.removeItem(USER_KEY);
            return Object.assign({}, state, { user: {}, isLoggedIn: false, date: null });
        case PRODUCTS_ADD:
            return { ...state, products: action.payload };
        case ADD_AUCTION_STARTED:
            let withNewAuction = state.auctionsStarted;
            withNewAuction.push(action.payload);
            return { ...state, products: withNewAuction };
        case UPDATE_FAVORITES:
            let { favorites } = action.payload;
            return { ...state, favorites: favorites };
        case ADD_TO_CART:
            let newCartWithProduct = state.cart;
            return { ...state, cart: newCartWithProduct };
        case SUBSCRIBE_AUCTION:
            let auctionId = action.payload;
            subscribeAuction(auctionId);
            let subscriptions = Object.assign({}, state.subscriptions);
            return Object.assign({}, state, { subscriptions: [...subscriptions, auctionId] });
        case UNSUBSCRIBE_AUCTION: {
            unsubscribeAuction(action.payload);
            let subscriptions = state.subscriptions;
            let index = subscriptions.findIndex(el => el === action.payload);
            if (index > -1) {
                subscriptions = subscriptions.splice(index, 1);
                return Object.assign({}, state, { subscriptions });
            }
            return state;
        }
        case AUCTION_STARTED: {
            let id = action.payload;
            let auctions = state.auctions;
            let index = auctions.findIndex(el => el.auctionId === id);
            let auction = auctions[index];
            if (index === -1) {
                return state;
            }
            auctions[index].state = 'LIVE';
            let { auctionsStarted } = state;
            return { ...state, auctions, auctionsStarted: [...auctionsStarted, auctions[index]] };
        }
        case UPDATE_USER_PROFILE: {

        }
        case AUCTION_ENDED: {
            let { id } = action.payload;
            let auctions = state.auctions;
            let index = auctions.findIndex(el => el.auctionId === id);
            if (index === -1) {
                return state;
            }
            let auction = auctions[index];
            auctions = auctions.splice(index, 1);
            auction.state = 'ENDED';
            return Object.assign({}, state, { auctions: [...auctions, auction] });
        }
        case NEW_BID_PUSH: {
            let { auctionId, userId, bidAmount } = action.payload;
            let auctions = state.auctions;
            let bid = {};
            let maximum = 0;
            let maxBidder = "";
            auctions.map((auction) => {
                if (auction.auctionId === auctionId) {
                    auction.bids.map((bid, key) => {
                        if (bid.bidAmount > maximum) {
                            maximum = bid.bidAmount;
                            maxBidder = bid.userId;
                        }
                    });
                }
            });
            if (bidAmount > maximum) {
                maximum = bidAmount;
                maxBidder = userId;
            }
            let index = auctions.findIndex(el => el.auctionId === auctionId);
            if (index === -1) {
                let newAuction = true;
                state.highestBid.map((auction, key) => {
                    if (auction.auctionId === auctionId) {
                        newAuction = false;
                        let temp = state.highestBid;
                        temp[key] = {
                            auctionId: auctionId,
                            maximumBid: maximum,
                            maximumBidder: maxBidder
                        };
                        return { ...state, highestBid: temp, currentBidder: userId, currentBid: bidAmount };
                    }
                });
                if (newAuction) {
                    return { ...state, currentBidder: userId, currentBid: bidAmount, highestBid: [...state.highestBid, { auctionId: auctionId, maximumBid: maximum, maximumBidder: maxBidder }] };
                }
                else {
                    return state;
                }
            }
            let auction = auctions[index];
            auctions = auctions.splice(index, 1);
            auction.bids.push({
                userId,
                bidAmount,
                auctionId
            });
            let newUser = true;
            state.highestBid.map((auction, key) => {
                if (auction.auctionId === auctionId) {
                    newUser = false;
                    let temp = state.highestBid;
                    temp[key] = {
                        auctionId: auctionId,
                        maximumBid: maximum,
                        maximumBidder: maxBidder
                    };
                    Object.assign({}, state, { currentBid: bidAmount, auctions: [...auctions, auction], highestBid: temp, currentBidder: userId });
                }
            });
            if (newUser) {
                return Object.assign({}, state, { currentBid: bidAmount, currentBidder: userId, auctions: [...auctions, auction], highestBid: [...state.highestBid, { auctionId: auctionId, maximumBid: maximum, maximumBidder: maxBidder }] });
            }
            else {
                return state;
            }
        }
        case UPDATE_AUCTION_LIST: {
            let current = state.auctions;
            current.push(action.payload);
            return { ...state, auctions: current };
        }
        case TOGGLE_FAVORITE: {
            let auctionId = action.payload;
            let favorites = state.favorites;
            let index = favorites.indexOf(auctionId);
            if (index > -1) {
                favorites.splice(index, 1);
                return Object.assign({}, state, { favorites });
            }
            else {
                return Object.assign({}, state, { favorites: [...favorites, auctionId] });
            }
        }
        case USER_STATUS:
        default:
            return state;
    }
};

let store = createStore(reducer);

// Containers
export function getUser(state: State): any {
    return state.user;
}

export function getUserToken(state: State): string {
    return state.user.header;
}

export function isUserOnline(state: State): boolean {
    return state.isLoggedIn;
}
export function getHighestBid(auctionId: string, state: State): number {
    let auctions = state.auctions;
    let bid = {};
    let maximum = 0;
    auctions.map((auction) => {
        if (auction.auctionId === auctionId) {
            auction.bids.map((bid, key) => {
                if (bid.bidAmount > maximum) {
                    maximum = bid.bidAmount;
                }
            });
        }
    });
    return maximum;
}

export function getProducts(state: State): any[] {
    return state.products;
}

const mapStateToProps = (state: State) => ({
    user: getUser(state),
    token: getUserToken(state),
    isOnline: isUserOnline(state),
    products: getProducts(state)
});

const mapDispatchToProps = (dispatch: any) => ({
    signin: (data: any) => dispatch(signIn(data)),
    signout: (data: any) => dispatch(signout(data)),
    addProducts: (data: any) => dispatch(productsAdd(data))
});

export default store;