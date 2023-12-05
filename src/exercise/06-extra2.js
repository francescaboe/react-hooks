// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, fetchPokemon,PokemonInfoFallback, PokemonDataView } from '../pokemon'

const STATUS = {
  IDLE: 'dle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected'
}

function PokemonInfo({pokemonName}) {

  const [pokemon, setPokemon] = React.useState(null)
  const [error, setError] = React.useState(null)
  const [status, setStatus] = React.useState(STATUS.IDLE)

  React.useEffect(()=>{
    if(!pokemonName){
      return
    }
    // no need to reset error and pokemon as the return is handled through status
    setStatus(STATUS.PENDING)
    fetchPokemon(pokemonName).then(
      pokemon => {
        setPokemon(pokemon)
        setStatus(STATUS.RESOLVED)
      },
      error => {
        setError(error)
        setStatus(STATUS.REJECTED)
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
