import { useQuery, gql, useLazyQuery, useMutation } from '@apollo/client';
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

const CREATE_NEW_USER = gql`
    mutation CreateNewUser($input: CreateUserInput!){
        createUser(input: $input) {
            name
            username
            age
            country
        }
    }
`;

const DisplayData = () => {
    const { data, loading, error, refetch } = useQuery(QUERY_LIST_OF_USERS);
    const { data: movieData } = useQuery(QUERY_LIST_OF_MOVIES);

    //fetch movie on button click
    const [fetchMovie, {
        data: movieSearchData,
    }] = useLazyQuery(GET_MOVIE_DATA);

    //fetch created user on button click
    const [fetchCreatedUser, {
        data: createdUserData
    }] = useMutation(CREATE_NEW_USER);


    const [movieSearched, setMovieSearched] = useState('');
    const [userDetails, setUserDetails] = useState({
        name: '',
        username: '',
        nationality: '',
        age: null
    })
    const handleChange = (e) => {
        setMovieSearched(e.target.value);
    }

    const handleUserInput = (e, prop) => {
        setUserDetails(prev => { return { ...prev, [prop]: e.target.value } })
    }

    if (loading)
        return <h2>Data is loading</h2>

    if (error)
        return <h2>Error occured</h2>
    return <div>
        <div>
            <input type={"text"} placeholder="Name" value={userDetails.name} onChange={(e) => { handleUserInput(e, 'name') }} />
            <input type={"text"} placeholder="Username" value={userDetails.username} onChange={(e) => { handleUserInput(e, 'username') }} />
            <input type={"text"} placeholder="Nationality" value={userDetails.nationality} onChange={(e) => { handleUserInput(e, 'nationality') }} />
            <input type={"number"} placeholder="Age" value={userDetails.age} onChange={(e) => { handleUserInput(e, 'age') }} />
            <button onClick={() => {
                fetchCreatedUser({
                    variables: {
                        input: {
                            name: userDetails.name,
                            age: Number(userDetails.age),
                            country: userDetails.nationality.toUpperCase(),
                            username: userDetails.username
                        }
                    }
                })
                refetch();
            }}>Create User</button>
        </div>
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