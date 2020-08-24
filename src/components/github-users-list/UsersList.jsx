import React, { useEffect } from 'react';

import UserCard from '../github-user-card/UserCard';
import SearchBar from './components/search-bar/SearchBar';

import { getGithubUserFollowersByUsername } from '../../services/GithubApi';

import './UsersList.css';

function UsersList() {

    const USERS_PER_PAGE = 10;

    const [usersList, setUsersList] = React.useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
    const [isLoadingMoreUsers, setIsLoadingMoreUsers] = React.useState(false);

    const [usernameInput, setUsernameInput] = React.useState('guimcarneiro');

    const [totalUsers, setTotalUsers] = React.useState(0);
    const [pageNumber, setPageNumber] = React.useState(1);

    useEffect(() => {
        setIsLoadingUsers(true);
        
        getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, pageNumber)
        .then((res) => {

            setUsersList(res.data);
            setPageNumber(pageNumber + 1);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setIsLoadingUsers(false);
        })

    },[]);

    /*Infinite Scroll*/

    const touchedBottom = (e) => {
        return e.target.scrollHeight <= e.target.offsetHeight + Math.ceil(e.target.scrollTop);
    }

    const handleScroll = (e) => {
        if(touchedBottom(e)){
            setIsLoadingMoreUsers(true);
            getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, pageNumber)
            .then((res) => {
                let newUsers = res.data;
                setUsersList([...usersList, ...newUsers]);

                setPageNumber(pageNumber + 1);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoadingMoreUsers(false);
            })
        }
    }

    const handleSearchByUsername = () => {
        getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, 1)
        .then((res) => {
            setUsersList(res.data);

            setPageNumber(1);
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            setIsLoadingUsers(false);
        })

    }

    const handleUsernameChange = (username) => {
        setUsernameInput(username);
    }

    const loadingMessage = () => {
        return <div style={{display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center' }}
                >
                    <p>Loading...</p>
                </div>
    }

    return (
        <div className="users-list" onScroll={ handleScroll }>
            <SearchBar
                value={ usernameInput }
                handleChange={ handleUsernameChange }
                handleSubmit={ handleSearchByUsername }
            />
            { isLoadingUsers?
                loadingMessage()
                :
                usersList.map((user) => <UserCard
                                            key={ user.login }
                                            nome={ user.login }
                                            url={ user.html_url }
                                            avatar={ user.avatar_url }
                                        />
                )
            }
            { isLoadingMoreUsers? loadingMessage() : null }
        </div>
    );
}

export default UsersList;
