import { WebSocketUrl } from './config';
import Stomp from 'stompjs';
import store, {
    auctionStartedAction,
    newBid,
    auctionEndedAction,
    updateAuctionListAction
} from './store';

let subscriptions: { [key: string]: any } = {};
let futureList: string[] = [];

let wsClient = Stomp.client(WebSocketUrl);

function subscribeFutures(futureList: string[]): void {
    let futures = futureList;
    while (true) {
        if (futures.length === 0) {
            break;
        }
        let item = futures.pop();
        subscribeAuction(item);
    }
}

let connected = (e: any): void => {
    setTimeout(subscribeFutures, 500, futureList);
};

let error = (e: any): void => {
    console.log("error " + e);
};

let headers: { [key: string]: any } = {};

wsClient.connect(headers, connected, error);

export default wsClient;

function auctionCallback(id: string): (e: any) => void {
    return (e: any): void => {
        let msg: string = e.body;
        console.log("auctionCallback", msg);
        if (msg.startsWith("bid")) {
            console.log("GOT ", msg);
            let params: string[] = msg.split(' ');
            auctionBid(id, Number.parseInt(params[2]), Number.parseInt(params[3]));
        } else if (msg.startsWith("end")) {
            auctionEnded(id);
        } else if (msg.startsWith("start")) {
            auctionStarted(id);
        }
    };
}

export function subscribeAuction(id: string): void {
    if (wsClient.connected) {
        let subscription = wsClient.subscribe(`/auction/${id}`, auctionCallback(id));
        console.log("HEY DATA ON SUBSCRIBE", subscription);
        // if(subscriptions[id]){
        //     subscriptions[id].unsubscribe()
        // }
        subscriptions[id] = subscription;
    } else {
        futureList.push(id);
        console.log("FUTURELIST", futureList);
    }
}

export function unsubscribeAuction(id: string): void {
    if (subscriptions[id]) {
        subscriptions[id].unsubscribe();
        subscriptions[id] = null;
    }
}

const auctionStarted = (auctionId: string): void => {
    store.dispatch(auctionStartedAction(auctionId));
};

const auctionEnded = (auctionId: string): void => {
    store.dispatch(auctionEndedAction(auctionId));
};

const auctionBid = (auctionId: string, userId: number, bidAmount: number): void => {
    store.dispatch(newBid({ auctionId, userId, bidAmount }));
};