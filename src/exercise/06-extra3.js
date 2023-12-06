// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js
import * as React from 'react'
import { PokemonForm, fetchPokemon,PokemonInfoFallback, PokemonDataView } from '../pokemon'

const STATUS = {
  IDLE: 'dle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

function PokemonInfo({pokemonName}) {

  const [{status, pokemon, error}, setState] = React.useState({
    status: STATUS.IDLE,
    pokemon: null,
    error: null
  })

  React.useEffect(()=> {
    if(!pokemonName){
      return
    }

    setState((prevState) => ({
      ...prevState,
      status: STATUS.PENDING,
    }))
    // we could also update the state as setState(status: STATUS.PENDING)
    // this would get rid of pokemon and error fields in the state object
    // but since we are not using the rest of the state when status is pending,
    // this is not a problem.
    // Same things can b done for when we update pokemon or error

    fetchPokemon(pokemonName).then(
      pokemon => {
        setState((prevState) => ({
          ...prevState,
          status: STATUS.RESOLVED,
          pokemon
        }));
        // or setState(status: STATUS.RESOLVED, pokemon) -> console.log {status: 'resolved', pokemon: .. all pokemon props}, no error
      },
      error => {
        setState((prevState) => ({
          ...prevState,
          status: STATUS.REJECTED,
          error
        }));
        // or setState(status: STATUS.REJECTED, error)
      },
    )

  },[pokemonName])

  if(status === STATUS.REJECTED){
    return (<div role="alert">
      There was an error: <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
    </div>)
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
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
