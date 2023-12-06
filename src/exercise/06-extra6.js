// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import { ErrorBoundary } from "react-error-boundary"
import { PokemonForm, fetchPokemon,PokemonInfoFallback, PokemonDataView } from '../pokemon'

const STATUS = {
  IDLE: 'dle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

function fallbackRender({ error }) {

  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre style={{ color: "red" }}>{error.message}</pre>
    </div>
  );
}

function PokemonInfo({pokemonName}) {

  const [{status, pokemon, error}, setState] = React.useState({
    status: STATUS.IDLE,
    pokemon: null,
  })

  React.useEffect(()=> {
    if(!pokemonName){
      return
    }

    setState((prevState) => ({
      ...prevState,
      status: STATUS.PENDING,
    }))

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState((prevState) => ({
          ...prevState,
          status: STATUS.RESOLVED,
          pokemon
        }));
      },
      error => {
        setState((prevState) => ({
          ...prevState,
          status: STATUS.REJECTED,
          error
        }));
      },
    )

  },[pokemonName])

  if(status === STATUS.REJECTED){
    // lets ErrorBoundary deal with the error
    throw error
  }

  if(status === STATUS.IDLE) {
    return 'Submit a pokemon'
  }

  if(status === STATUS.PENDING){
    return <PokemonInfoFallback name={pokemonName} />
  }
  return <PokemonDataView pokemon={pokemon} />
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        {/*by adding a key prop, we allow the ErrorBoundary's state to reset, so that on pokemonName change the error becomes null again, rerender is triggered*/}
        <ErrorBoundary key={pokemonName} fallbackRender={fallbackRender} >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
