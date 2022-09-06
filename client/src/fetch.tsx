import store from './store';

export function fetchApi(path: string, options: object): Promise<Response> {
    let defaults: object = {
        headers: {
            'Authorization': store.getState().user.header,
        },
        mode: 'cors'
    };
    return fetch(path, Object.assign(defaults, options));
}

export function fetchJSON(path: string, options: object): Promise<any> {
    return fetchApi(path, options).then(res => res.json());
}

export function postForm(url: string, body: FormData): Promise<any> {
    let options: object = {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': store.getState().user.header,
        },
        body,
    };
    return fetchJSON(url, options);
}

export default fetchApi;