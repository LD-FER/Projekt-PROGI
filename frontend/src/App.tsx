import { useEffect } from 'react'

function App() {
  useEffect(() => {
    fetch('/actuator/health')
      .then(async (response) => {
        if (!response.ok) {
          console.error(`Backend health: HTTP ${response.status}`)
          return
        }
        const health: { status: string } = await response.json()
        console.log(`Backend health: ${health.status}`)
      })
      .catch((error) => console.error('Backend nije dostupan', error))
  }, [])

  return <h1>Hello World</h1>
}

export default App
