import { useState, useEffect } from "react";
import "./style.css";

const API_KEY = "aa97f0e19a0d827615030bf0da1df723";
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

function MovieCard({ movie }) {
  return (
  <div className="movie-card">
      <img src={IMAGE_URL + movie.poster_path} alt={movie.title} />
      <h2>{movie.title}</h2>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
  </div>
  );
}

function MovieList({ movies }) {
  return (
  <div className="movie-grid">
      {movies.map((movie) => (
      <MovieCard key={movie.id} movie={movie} />
      ))}
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
    let ignore = false;
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

  function handleSearch(text) {
    setSearchText(text.trim());
    setCurrentPage(1);
  }

  function handlePrev() {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }

  function handleNext() {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }

  const sortedMovies = [...movies];
  if (sortBy === "release_asc") {
    sortedMovies.sort((a, b) => (a.release_date || "").localeCompare(b.release_date || ""));
  } else if (sortBy === "release_desc") {
    sortedMovies.sort((a, b) => (b.release_date || "").localeCompare(a.release_date || ""));
  } else if (sortBy === "rating_asc") {
    sortedMovies.sort((a, b) => a.vote_average - b.vote_average);
  } else if (sortBy === "rating_desc") {
    sortedMovies.sort((a, b) => b.vote_average - a.vote_average);
  }

  return (
    <div>
      <header>
        <h1>Movie Explorer</h1>
      </header>

      <Controls onSearch={handleSearch} sortBy={sortBy} onSortChange={setSortBy} />

      <MovieList movies={sortedMovies} />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </div>
  );
}

export default App;