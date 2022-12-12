import { useQuery, gql, useLazyQuery } from '@apollo/client';
import { useState } from 'react';

const QUERY_LIST_OF_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            username
            age
        }

    }
`;

const QUERY_LIST_OF_MOVIES = gql`
    query GetAllMovies {
        movies {
            id
            name
            yearOfRelease
            isInTheater
        }
    }
`;

const GET_MOVIE_DATA = gql`
    query GetMovieByName($name: String!){
        movie(name:$name) {
            name
            yearOfRelease
        }
    }
`;
const DisplayData = () => {
    const { data, loading, error } = useQuery(QUERY_LIST_OF_USERS);
    const { data: movieData } = useQuery(QUERY_LIST_OF_MOVIES);
    const [fetchMovie, {
        data: movieSearchData,
    }] = useLazyQuery(GET_MOVIE_DATA);
    const [movieSearched, setMovieSearched] = useState('');

    const handleChange = (e) => {
        setMovieSearched(e.target.value);
    }

    if (loading)
        return <h2>Data is loading</h2>

    if (error)
        return <h2>Error occured</h2>
    return <div>
        {
            data && data.users.map(user => {
                return <div>
                    <h1>Name: {user.name}</h1>
                    <h1>Username: {user.username}</h1>
                    <h1>Age: {user.age}</h1>
                </div>
            })
        }
        {
            movieData && movieData.movies.map(movie => {
                return <div>
                    <h1>Movie name: {movie.name} </h1>
                </div>
            })
        }
        <div>
            <input type="text" placeholder='Interstellar...' onChange={handleChange} />
            <button onClick={() => fetchMovie({
                variables: {
                    name: movieSearched
                }
            })}>Submit</button>
            <div>
                {movieSearchData && <div>
                    <h1>Name: {movieSearchData.movie.name}</h1>
                    <h1>Release Year: {movieSearchData.movie.yearOfRelease}</h1>
                </div>}
            </div>
        </div>
    </div>
};

export default DisplayData;