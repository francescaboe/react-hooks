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

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (<div role="alert">
        There was an error: <pre style={{whiteSpace: 'normal'}}>{this.state.errorMessage}</pre>
      </div>)
    }

    return this.props.children;
  }
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
        <ErrorBoundary key={pokemonName}>
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
