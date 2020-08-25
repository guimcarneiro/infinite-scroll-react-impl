import axios from 'axios';

export const getGithubUserFollowersByUsername = (username, per_page, page) => {
    return axios.get(`https://api.github.com/users/${username}/followers`, {
        params: {
            'per_page': per_page,
            'page': page
        },
        headers: {
            'accept': 'application/vnd.github.v3+json'
        }
    })
}