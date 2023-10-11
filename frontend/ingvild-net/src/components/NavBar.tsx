import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className="NavBar">
            <Link className='HeaderLink' to={"/"}>Home</Link>
            <Link className='HeaderLink' to={"/search"}>Search</Link>
            <Link className='HeaderLink' to={"/login"}>Login</Link>
            <Link className='HeaderLink' to={"/create"}>Creator</Link>
        </div>
    );
}

export default NavBar;
