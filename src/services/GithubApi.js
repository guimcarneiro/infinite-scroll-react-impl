import axios from 'axios';

const API_URL = 'https://api.github.com';

export const getGithubUserFollowersByUsername = (username, per_page, page) => {
    return axios.get(`${API_URL}/users/${username}/followers`, {
        params: {
            'per_page': per_page,
            'page': page
        },
        headers: {
            'accept': 'application/vnd.github.v3+json'
        }
    })
}