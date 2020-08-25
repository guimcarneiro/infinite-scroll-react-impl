import React, { useEffect } from 'react';

import UserCard from '../github-user-card/UserCard';
import SearchBar from './components/search-bar/SearchBar';

import { getGithubUserFollowersByUsername } from '../../services/GithubApi';

import './UsersList.css';

function UsersList() {

    const NOT_FOUND_MESSAGE_FROM_GITHUB_API = "Request failed with status code 404";
    const USERS_PER_PAGE = 10;

    const [usersList, setUsersList] = React.useState([]);
    const [isLoadingUsers, setIsLoadingUsers] = React.useState(false);
    const [isLoadingMoreUsers, setIsLoadingMoreUsers] = React.useState(false);

    const [usernameInput, setUsernameInput] = React.useState('guimcarneiro');

    const [pageNumber, setPageNumber] = React.useState(1);
    const [gotAllUsers, setGotAllUsers] = React.useState(false);

    const [usernameNotFound, setUsernameNotFound] = React.useState(false);

    /* First Request */

    useEffect(() => {
        setIsLoadingUsers(true);
        
        getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, pageNumber)
        .then((res) => {

            console.log(res);

            setUsersList(res.data);
            setPageNumber(pageNumber + 1);
        })
        .catch((err) => {
            console.log(err);

            handleUsernameNotFound(err);
        })
        .finally(() => {
            setIsLoadingUsers(false);
        })

    },[]);
    
    const resetList = () => {
        setGotAllUsers(false);
        setPageNumber(1);
        setUsersList([]);
    }

    /*Infinite Scroll*/

    const touchedBottom = (e) => {
        return e.target.scrollHeight <= e.target.offsetHeight + Math.ceil(e.target.scrollTop);
    }

    /* Handlers */

    const handleScroll = (e) => {
        if(touchedBottom(e) && !gotAllUsers){
            setIsLoadingMoreUsers(true);
            getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, pageNumber)
            .then((res) => {
                let newUsers = res.data;

                if(newUsers.length === 0){
                    setGotAllUsers(true);
                } else {
                    setUsersList([...usersList, ...newUsers]);
                }

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
        setUsernameNotFound(false);
        getGithubUserFollowersByUsername(usernameInput, USERS_PER_PAGE, 1)
        .then((res) => {
            let newUsers = res.data;

            setUsersList(newUsers);

            if(newUsers.length === 0){
                setGotAllUsers(true);
            }

            setPageNumber(pageNumber+1);
        })
        .catch((err) => {
            console.log(err);
            handleUsernameNotFound(err);
        })
        .finally(() => {
            setIsLoadingUsers(false);
        })

    }

    const handleUsernameNotFound = (err) => {
        if(err.message === NOT_FOUND_MESSAGE_FROM_GITHUB_API){
            setUsernameNotFound(true);

            resetList();
        }
    }

    const handleUsernameChange = (username) => {
        setUsernameInput(username);
    }

    /* Messages */

    const loadingMessage = () => {
        return <div style={{width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center' }}
                >
                    <p>Loading...</p>
                </div>
    }

    const noItemsMessage = () => {
        return <div style={{width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center' }}
                >
                    <p>No Followers Found</p>
                </div>
    }

    const usernameNotFoundMessage = () => {
        return <div style={{width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center' }}
                >
                    <p>Username Doesn't Exist</p>
                </div>
    }

    /* Dynamic Rendering */

    const listUserCards = () => {
        return usersList.map((user) => <UserCard
                                            key={ user.login }
                                            nome={ user.login }
                                            url={ user.html_url }
                                            avatar={ user.avatar_url }
                                        />)
    }

    const showUsers = () => {
        return usersList.length === 0? noItemsMessage() : listUserCards();
    }

    const showResult = () => {
        return usernameNotFound? usernameNotFoundMessage() : showUsers();
    }

    return (
        <div className="users-list" onScroll={ handleScroll }>
            <SearchBar
                value={ usernameInput }
                handleChange={ handleUsernameChange }
                handleSubmit={ handleSearchByUsername }
            />
            <div className="users-list__container">
                { isLoadingUsers? loadingMessage() : showResult() }
                { isLoadingMoreUsers? loadingMessage() : null }
            </div>
        </div>
    );
}

export default UsersList;
