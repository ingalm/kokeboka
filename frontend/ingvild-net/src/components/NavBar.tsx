import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className="NavBar">
            <Link to={"/"}>Home</Link>
            <Link to={"/search"}>Search</Link>
            <Link to={"/login"}>Login</Link>
            <Link to={"/create"}>Creator</Link>
        </div>
    );
}

export default NavBar;
