let siteUrl: string = window.location.host;	// localhost:3000 or sankalpa.org
let apiBase: string = `localhost:8080`;

let wsBaseUrl: string = `ws://${siteUrl}`;

export const baseUrl: string = `/`;
export const apiUrl: string = `/api`;
export const WebSocketUrl: string = `${wsBaseUrl}/api/live/auction`;
export const WebsiteName: string = "Bidsteller.com";