import { useState, useEffect } from "react";
import "./style.css";

const API_KEY = aa97f0e19a0d827615030bf0da1df723;
const BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

function Controls({ onSearch, sortBy, onSortChange }) {
    return (
    <div className="controls">
      <input
        type="text"
        placeholder="Search for a movie..."
        onChange={(e) => onSearch(e.target.value)}
        />{" "}
        <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
            <option value="">Sort By</option>
            <option value="release_asc">Release Date (Asc)</option>
            <option value="release_desc">Release Date (Desc)</option>
            <option value="rating_asc">Rating (Asc)</option>
            <option value="rating_desc">Rating (Desc)</option>
        </select>
    </div>
    );
}

function Pagination({ currentPage, totalPages, onPrev, onNext }) {
    return (
    <div className="pagination">
        <button onClick={onPrev}>Previous</button>
        <span>
            Page {currentPage} of {totalPages}
        </span>
        <button onClick={onNext}>Next</button>
    </div>
    );
}

function App() {
    const [movies, setMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchText, setSearchText] = useState("");
    const [sortBy, setSortBy] = useState("");

    useEffect(() => {
        async function getMovies() {
            let url;
            if (searchText === "") {
                url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`;
            } else {
                url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(searchText)}&page=${currentPage}`;
            }

            try {
                const response = await fetch(url);
                const data = await response.json();
                if (!ignore) {
                    setMovies(data.results || []);
                    setTotalPages(data.total_pages || 1);
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }

        getMovies();

        return () => {
            ignore = true;
        };
    }, [currentPage, searchText]);
}

export default App;