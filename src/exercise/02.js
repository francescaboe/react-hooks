// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

// 1
/*function useLocalStorageState(valueName, defaultValue){
  const [state, setState] = React.useState(()=> window.localStorage.getItem(valueName) || defaultValue)

  React.useEffect(()=> {
    window.localStorage.setItem(valueName, state)
  },[state, valueName])
  return [state, setState]
}*/

// 2
function useLocalStorageState(key, defaultValue){
  const fromStorage = window.localStorage.getItem(key)
  const storageValue = Boolean(fromStorage) ? JSON.parse(fromStorage) : undefined

  const [state, setState] = React.useState(() => storageValue || defaultValue)

  React.useEffect(()=> {
    window.localStorage.setItem(key, JSON.stringify(state))
  },[state, key])

  return [state, setState]
}

function Greeting({initialName = ''}) {
  // 🐨 initialize the state to the value from localStorage
  // 💰 window.localStorage.getItem('name') ?? initialName

  const [name, setName] = useLocalStorageState('name', initialName)
  // Make the `React.useState` call use lazy initialization to avoid a performance
  // bottleneck of reading into localStorage on every render.
  // // const [name, setName] = React.useState(()=> window.localStorage.getItem('name') ?? initialName)


  // 🐨 Here's where you'll use `React.useEffect`.
  // The callback should set the `name` in localStorage.
  // 💰 window.localStorage.setItem('name', name)
  // called every time the component re-renders, which is, among other things, every time we setName
  // no need to add name as a dependency
  /* React.useEffect(()=> {
    window.localStorage.setItem('name', name)
    // only call it when name changes
  },[name]) */

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting initialName="initial name.." />
}

export default App
