import React from 'react';

function SearchBar(props) {

    const {
        value,
        handleChange,
        handleSubmit
    } = props;

    const onChange = (e) => {
        handleChange(e.target.value);
    }

    return (
        <div className="users-list__search-bar">
            <input
                id="username-input"
                type="text"
                onChange={ onChange }
                value={ value }
            />
            <button
                type="button"
                onClick={ handleSubmit }
            >
                Buscar
            </button>
        </div>
    );
}

export default SearchBar;
