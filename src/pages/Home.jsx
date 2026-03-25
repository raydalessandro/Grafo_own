import { useState, useEffect, useRef, useMemo } from "react"
import * as d3 from "d3"
import { GRAPH_DATA, TYPE_CONFIG } from "../data.js"

export default function App() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const simRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [dims, setDims] = useState({ w: 900, h: 600 })

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect
      setDims({ w: width, h: height })
    })
    ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const filteredNodes = useMemo(() => {
    return GRAPH_DATA.nodes.filter(n => {
      const matchType = filter === "all" || n.type === filter
      const matchSearch = !search ||
        n.label.toLowerCase().includes(search.toLowerCase()) ||
        n.sub.toLowerCase().includes(search.toLowerCase())
      return matchType && matchSearch
    })
  }, [filter, search])

  const filteredIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  const filteredEdges = useMemo(() => {
    return GRAPH_DATA.edges.filter(e =>
      filteredIds.has(typeof e.source === "object" ? e.source.id : e.source) &&
      filteredIds.has(typeof e.target === "object" ? e.target.id : e.target)
    )
  }, [filteredIds])

  useEffect(() => {
    if (!svgRef.current || dims.w === 0) return
    const { w, h } = dims

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Deep clone nodes to avoid mutation across renders
    const nodes = filteredNodes.map(n => ({ ...n }))
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
    const edges = filteredEdges.map(e => ({
      ...e,
      source: nodeById[typeof e.source === "object" ? e.source.id : e.source],
      target: nodeById[typeof e.target === "object" ? e.target.id : e.target],
    })).filter(e => e.source && e.target)

    // Defs
    const defs = svg.append("defs")
    defs.append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 30).attr("refY", 0)
      .attr("markerWidth", 5).attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-4L8,0L0,4").attr("fill", "#334155")

    // Background grid
    const pattern = defs.append("pattern")
      .attr("id", "grid").attr("width", 40).attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse")
    pattern.append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none").attr("stroke", "#0f2040").attr("stroke-width", 0.5)

    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#grid)")

    const zoom = d3.zoom()
      .scaleExtent([0.2, 4])
      .on("zoom", e => g.attr("transform", e.transform))
    svg.call(zoom)
    svg.on("click.deselect", () => setSelected(null))

    const g = svg.append("g")

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(d => {
        // Longer distances for visione connections
        if (d.source.id === "Visione_5_Anni" || d.target.id === "Visione_5_Anni") return 200
        return 110
      }).strength(0.4))
      .force("charge", d3.forceManyBody().strength(-350))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(d => d.type === "persona" ? 40 : 32))
      .alphaDecay(0.028)

    simRef.current = simulation

    // Edges
    const link = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(edges).join("line")
      .attr("stroke", d => {
        if (d.source.id === "Visione_5_Anni" || d.target.id === "Visione_5_Anni")
          return "#F59E0B"
        return "#1e3a5f"
      })
      .attr("stroke-opacity", d =>
        d.source.id === "Visione_5_Anni" || d.target.id === "Visione_5_Anni" ? 0.35 : 0.5
      )
      .attr("stroke-width", d =>
        d.source.id === "Visione_5_Anni" || d.target.id === "Visione_5_Anni" ? 1 : 1.5
      )
      .attr("stroke-dasharray", d =>
        d.source.id === "Visione_5_Anni" || d.target.id === "Visione_5_Anni" ? "4 4" : null
      )
      .attr("marker-end", "url(#arrow)")

    const linkLabel = g.append("g").attr("class", "link-labels")
      .selectAll("text")
      .data(edges).join("text")
      .attr("font-size", 8)
      .attr("fill", "#334155")
      .attr("text-anchor", "middle")
      .attr("font-family", "'JetBrains Mono', monospace")
      .text(d => d.label)

    // Nodes
    const node = g.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(nodes).join("g")
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation()
        setSelected(prev => prev?.id === d.id ? null : GRAPH_DATA.nodes.find(n => n.id === d.id))
      })
      .call(d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart()
          d.fx = d.x; d.fy = d.y
        })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0)
          d.fx = null; d.fy = null
        })
      )

    const radius = d => {
      if (d.type === "persona") return 26
      if (d.type === "visione") return 30
      if (d.type === "agente") return 22
      return 18
    }

    // Glow filter per visione
    const glow = defs.append("filter").attr("id", "glow")
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "coloredBlur")
    const feMerge = glow.append("feMerge")
    feMerge.append("feMergeNode").attr("in", "coloredBlur")
    feMerge.append("feMergeNode").attr("in", "SourceGraphic")

    // Outer ring
    node.append("circle")
      .attr("r", d => radius(d) + 6)
      .attr("fill", "none")
      .attr("stroke", d => TYPE_CONFIG[d.type].color)
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.3)

    // Main circle
    node.append("circle")
      .attr("r", radius)
      .attr("fill", d => TYPE_CONFIG[d.type].color + "18")
      .attr("stroke", d => TYPE_CONFIG[d.type].color)
      .attr("stroke-width", d => d.type === "visione" ? 2 : 1.5)
      .attr("filter", d => d.type === "visione" ? "url(#glow)" : null)

    // Emoji
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("y", -3)
      .attr("font-size", d => d.type === "persona" ? 14 : d.type === "visione" ? 16 : 12)
      .text(d => TYPE_CONFIG[d.type].emoji)

    // Label
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", d => radius(d) + 14)
      .attr("font-size", d => d.type === "persona" ? 11 : 10)
      .attr("font-weight", "600")
      .attr("fill", "#cbd5e1")
      .attr("font-family", "'JetBrains Mono', monospace")
      .text(d => d.label)

    // Sublabel
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", d => radius(d) + 26)
      .attr("font-size", 8)
      .attr("fill", "#475569")
      .attr("font-family", "'JetBrains Mono', monospace")
      .text(d => d.sub)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y)
      linkLabel
        .attr("x", d => (d.source.x + d.target.x) / 2)
        .attr("y", d => (d.source.y + d.target.y) / 2 - 4)
      node.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    return () => simulation.stop()
  }, [filteredNodes, filteredEdges, dims])

  const connectedEdges = useMemo(() => {
    if (!selected) return []
    return GRAPH_DATA.edges.filter(e => {
      const src = typeof e.source === "object" ? e.source.id : e.source
      const tgt = typeof e.target === "object" ? e.target.id : e.target
      return src === selected.id || tgt === selected.id
    })
  }, [selected])

  return (
    <div style={{
      width: "100%", height: "100vh", display: "flex", flexDirection: "column",
      background: "#060d1a", fontFamily: "'JetBrains Mono', monospace", overflow: "hidden"
    }}>
      {/* Header */}
      <div style={{
        padding: "12px 20px", borderBottom: "1px solid #0f2040",
        display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
        background: "#080f1e"
      }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0", letterSpacing: "0.08em" }}>
            OWN <span style={{ color: "#A855F7" }}>GRAFO</span>
          </div>
          <div style={{ fontSize: 9, color: "#334155", marginTop: 1 }}>
            {filteredNodes.length} nodi · {filteredEdges.length} archi
          </div>
        </div>

        {/* Navigation */}
        <a href="#/code" style={{
          padding: "6px 14px", borderRadius: 20, fontSize: 10,
          border: "1px solid #10B981", background: "#10B98118",
          color: "#10B981", textDecoration: "none",
          fontFamily: "inherit", transition: "all 0.15s",
          display: "inline-block"
        }}>
          🧬 Code
        </a>

        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="cerca nodo..."
          style={{
            background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 6,
            padding: "6px 12px", color: "#94a3b8", fontSize: 11, outline: "none",
            width: 160, fontFamily: "inherit"
          }}
        />

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FilterBtn label="tutti" value="all" current={filter} onClick={setFilter} color="#e2e8f0" />
          {Object.entries(TYPE_CONFIG).map(([k, v]) => (
            <FilterBtn key={k} label={`${v.emoji} ${v.label}`} value={k} current={filter} onClick={setFilter} color={v.color} />
          ))}
        </div>

        <div style={{ marginLeft: "auto", fontSize: 9, color: "#1e3a5f" }}>
          scroll zoom · drag · click nodo
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div ref={containerRef} style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <svg ref={svgRef} style={{ width: "100%", height: "100%", display: "block" }} />
        </div>

        {/* Detail panel */}
        {selected && (
          <div style={{
            width: 300, background: "#080f1e",
            borderLeft: `2px solid ${TYPE_CONFIG[selected.type]?.color || "#334155"}`,
            display: "flex", flexDirection: "column", flexShrink: 0,
            animation: "slideIn 0.18s ease"
          }}>
            <style>{`
              @keyframes slideIn { from { opacity:0; transform:translateX(12px); } to { opacity:1; transform:translateX(0); } }
              .conn-row:hover { background: #0f172a !important; }
              ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; }
              ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
            `}</style>

            {/* Panel header */}
            <div style={{
              padding: "16px", borderBottom: "1px solid #0f2040", flexShrink: 0,
              background: (TYPE_CONFIG[selected.type]?.color || "#334155") + "10"
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{TYPE_CONFIG[selected.type]?.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{selected.label}</div>
              <div style={{ fontSize: 10, color: TYPE_CONFIG[selected.type]?.color, marginTop: 2 }}>
                {TYPE_CONFIG[selected.type]?.label} · {selected.sub}
              </div>
            </div>

            {/* Details */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
              {Object.entries(selected.details || {}).map(([k, v]) => (
                <div key={k} style={{ marginBottom: 14 }}>
                  <div style={{
                    fontSize: 9, color: "#334155", textTransform: "uppercase",
                    letterSpacing: "0.12em", marginBottom: 4
                  }}>{k.replace(/_/g, " ")}</div>
                  <div style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.65 }}>{v}</div>
                </div>
              ))}

              {/* Connections */}
              {connectedEdges.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 14, borderTop: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                    CONNESSIONI ({connectedEdges.length})
                  </div>
                  {connectedEdges.map((e, i) => {
                    const srcId = typeof e.source === "object" ? e.source.id : e.source
                    const tgtId = typeof e.target === "object" ? e.target.id : e.target
                    const isSource = srcId === selected.id
                    const otherId = isSource ? tgtId : srcId
                    const other = GRAPH_DATA.nodes.find(n => n.id === otherId)
                    if (!other) return null
                    return (
                      <div key={i} className="conn-row"
                        onClick={() => setSelected(other)}
                        style={{
                          display: "flex", alignItems: "center", gap: 8,
                          padding: "7px 10px", marginBottom: 3,
                          background: "#0a1628", borderRadius: 6, cursor: "pointer",
                          border: "1px solid #0f2040", transition: "background 0.1s"
                        }}>
                        <span style={{ fontSize: 9, color: "#334155", width: 12 }}>
                          {isSource ? "→" : "←"}
                        </span>
                        <span style={{ fontSize: 9, color: "#475569", flex: 1 }}>{e.label}</span>
                        <span style={{ fontSize: 10, color: TYPE_CONFIG[other.type]?.color, fontWeight: 600 }}>
                          {TYPE_CONFIG[other.type]?.emoji} {other.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Close */}
            <button onClick={() => setSelected(null)} style={{
              margin: "12px 16px", padding: "8px", background: "transparent",
              border: "1px solid #0f2040", borderRadius: 6, color: "#334155",
              cursor: "pointer", fontSize: 10, fontFamily: "inherit",
              transition: "all 0.15s"
            }}
              onMouseEnter={e => { e.target.style.borderColor = "#1e3a5f"; e.target.style.color = "#64748b" }}
              onMouseLeave={e => { e.target.style.borderColor = "#0f2040"; e.target.style.color = "#334155" }}
            >
              chiudi
            </button>
          </div>
        )}
      </div>

      {/* Footer legend */}
      <div style={{
        padding: "8px 20px", borderTop: "1px solid #0f2040",
        display: "flex", gap: 16, alignItems: "center", flexShrink: 0,
        background: "#080f1e"
      }}>
        {Object.entries(TYPE_CONFIG).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, opacity: 0.8 }} />
            <span style={{ fontSize: 9, color: "#334155" }}>{v.label}</span>
          </div>
        ))}
        <span style={{ fontSize: 9, color: "#1e3a5f", marginLeft: "auto" }}>
          OWN — Open Wearable Network · by EAR Lab
        </span>
      </div>
    </div>
  )
}

function FilterBtn({ label, value, current, onClick, color }) {
  const active = current === value
  return (
    <button onClick={() => onClick(value)} style={{
      padding: "4px 10px", borderRadius: 20, fontSize: 10,
      border: `1px solid ${active ? color : "#0f2040"}`,
      background: active ? color + "18" : "transparent",
      color: active ? color : "#334155",
      cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s"
    }}>{label}</button>
  )
}
