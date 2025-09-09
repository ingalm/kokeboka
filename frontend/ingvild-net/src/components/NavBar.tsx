import React from 'react';
import '../App.css';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className="NavBar">
            <Link className='HeaderLink' to={"/"}>Hjem</Link>
            <Link className='HeaderLink' to={"/recipes"}>Oppskrifter</Link>
            <Link className='HeaderLink' to={"/search"}>Søk</Link>
            <Link className='HeaderLink' to={"/login"}>Logg Inn</Link>
            <Link className='HeaderLink' to={"/create"}>Opprett</Link>
        </div>
    );
}

export default NavBar;
