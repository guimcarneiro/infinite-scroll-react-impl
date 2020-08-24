import React from 'react';

import './UserCard.css';

function UserCard(props) {

    const {
        avatar,
        nome,
        url
    } = props;

    return (
        <div className="user-card">
            <div className="user-card__avatar">
                <img alt="#" src={avatar} />
            </div>
            <div>
                <div>
                    <h2>{ nome }</h2>
                </div>
                <div>
                    <a href={ url }>Access</a>
                </div>
            </div>
        </div>
    );
}

export default UserCard;
