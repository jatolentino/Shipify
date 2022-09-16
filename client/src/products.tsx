import fetch, {postForm, fetchJSON} from './fetch'
import store from './store'
import {apiUrl} from './config'
import axios from 'axios'

export const baseFavoritesUrl: string = `${apiUrl}/items`
export const baseProductUrl: string = `${apiUrl}/items`
export const categoriesUrl: string = `${apiUrl}/categories`
export const auctionUrl: string = `${apiUrl}/auctions/`
export const profileUser: string = `${apiUrl}/user/me`

export function fetchProducts(): Promise<any> {
    return fetchJSON(baseProductUrl)
}

export function fetchFavorites(): Promise<any> {
    return fetchJSON(baseFavoritesUrl)
}

export function fetchItemsFromCategory(id: string): Promise<any> {
    return fetchJSON(`${apiUrl}/categories/${id}/items`)
}

export function fetchItemDetails(id: string): Promise<any> {
    return fetchJSON(`${apiUrl}/items/${id}`)
}

export function fetchProduct(id: string): Promise<any> {
    return fetchJSON(`${baseProductUrl}/${id}`)
}

export function fetchEach(items: any[]): Promise<any> {
    console.log("ITEMS",items)
    return Promise.all(items.map(fetchProduct))
}

export function getCategories(): Promise<any> {
    return fetchJSON(categoriesUrl)
}

export function addNewCategory(categoryName: string): Promise<any> {
    return axios.post({
        data: {categoryName},
        url: `${apiUrl}/categories`,
        headers: {
            'Authorization': store.getState().user.header
        },
        cors: true
    })
}

export function getSearched(search: string): Promise<any> {
    return fetchJSON(`${apiUrl}/search/${search}`)
}

export function getFavorites(): Promise<any> {
    return fetchJSON(`${apiUrl}/users/${store.getState().user.userId}/favorites`)
}

export function favorite(auctionId: string): Promise<any> {
    return participateInAuction(auctionId)
}

export function getRating(itemId: string): Promise<any> {
    return fetchJSON(`${apiUrl}/getUsers/item/${itemId}`)
}

export function Rate(itemId: string, rating: number): Promise<any> {
    return fetchJSON(`${apiUrl}/rate/user/${store.getState().user.userId}/item/${itemId}/${rating}`)
}

export function updateRate(itemId: string, rating: number): Promise<any> {
    return fetchJSON(`${apiUrl}/updateRating/user/${store.getState().user.userId}/item/${itemId}/${rating}`)
}

export function unfavorite(auctionId: string): Promise<any> {
    let url: string = `${apiUrl}/auctions/${auctionId}/unfavorite`
    return fetch(url)    
}

export function participateInAuction(auctionId: string): Promise<any> {
    let url: string = `${apiUrl}/auctions/${auctionId}/participate`
    return fetch(url)
}

export function uploadFile(body: any): Promise<any> {
    return fetchJSON(`${apiUrl}/uploadFile`, {method: 'POST', body})
}

export function getAuctionDetails(auctionId: string): Promise<any> {
    let url: string = `${apiUrl}/auctions/${auctionId}`
    return fetchJSON(url)
}

export function setBid(bidObject: any): Promise<any> {
    let url: string = `${apiUrl}/bids/saveBid`
    return fetchJSON(url,{method: 'POST',body:JSON.stringify(bidObject)})
}

export function getBidDetails(bidId: string): Promise<any> {
    let url: string = `${apiUrl}/bids/${bidId}`
    return fetchJSON(url)
}

export function getUserDetails(): Promise<any> {
    return fetchJSON(profileUser)
}

export function login(body: any): Promise<any> {
    return fetchJSON(`${apiUrl}/login`, {method:'POST', body:JSON.stringify(body), mode:'cors'})
}

export function newToday(): Promise<any> {
    return fetchJSON(`${apiUrl}/end-today`)
}

export function endToday(): Promise<any> {
    return fetchJSON(`${apiUrl}/new-today`)
}

export function userProfile(userId: string): Promise<any> {
    return fetchJSON(`${apiUrl}/users/${userId}`)
}

export function signup(body: any): Promise<any> {
    return fetchJSON(`${apiUrl}/users/sign-up`, {method:'POST', body:JSON.stringify(body), mode:'cors', headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
    },})
}

export function createAuction(body: any): Promise<any> {
    return fetchJSON(`${apiUrl}/auctions/createAuction`, {method: 'POST', body: JSON.stringify(body)})
}