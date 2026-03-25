import { useState, useEffect } from "react"
import Home from "./pages/Home.jsx"
import CodeViz from "./pages/CodeViz.jsx"

export default function App() {
  const [route, setRoute] = useState(window.location.hash.slice(1) || "/")

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash.slice(1) || "/")
    }
    window.addEventListener("hashchange", handleHashChange)
    return () => window.removeEventListener("hashchange", handleHashChange)
  }, [])

  if (route === "/code") {
    return <CodeViz />
  }

  return <Home />
}
