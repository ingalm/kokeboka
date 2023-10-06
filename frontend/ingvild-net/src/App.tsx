import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";
import MainPage from './pages/MainPage';
import RecipePage from './pages/RecipePage';
import SearchPage from './pages/SearchPage';
import AdminLogin from './pages/AdminLogin';
import RecipeCreator from './pages/RecipeCreator';

function App() {
    return (
        <Router>
            <Routes>
                <Route
                path='/'
                element={<MainPage/>}
                />
                <Route
                path='/recipes/:id'
                element={<RecipePage />}
                />
                <Route
                path='/search'
                element={<SearchPage/>}
                />
                <Route
                path='/login'
                element={<AdminLogin/>}
                />
                <Route
                path='/create'
                element={<RecipeCreator/>}
                />
            </Routes>
        </Router>
    );
}

export default App;
