import { useState, useEffect, useRef, useMemo } from "react"
import * as d3 from "d3"
import CODE_GRAPH from "../data/code-graph.json"

const LAYER_CONFIG = {
  service: { color: "#10B981", emoji: "⚙️", label: "Service" },
  ui: { color: "#3B82F6", emoji: "🎨", label: "UI" },
  test: { color: "#8B5CF6", emoji: "🧪", label: "Test" },
  infra: { color: "#F59E0B", emoji: "🔧", label: "Infra" },
  unknown: { color: "#6B7280", emoji: "📄", label: "Other" }
}

export default function CodeViz() {
  const svgRef = useRef(null)
  const containerRef = useRef(null)
  const simRef = useRef(null)
  const [selected, setSelected] = useState(null)
  const [selectedFunction, setSelectedFunction] = useState(null) // TIER 2: Function selection
  const [expandedNodes, setExpandedNodes] = useState(new Set()) // TIER 2: Expanded nodes
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
    return CODE_GRAPH.nodes.filter(n => {
      const matchLayer = filter === "all" || n.layer === filter
      const matchSearch = !search ||
        n.file.toLowerCase().includes(search.toLowerCase()) ||
        n.id.toLowerCase().includes(search.toLowerCase())
      return matchLayer && matchSearch
    })
  }, [filter, search])

  const filteredIds = useMemo(() => new Set(filteredNodes.map(n => n.id)), [filteredNodes])

  const filteredEdges = useMemo(() => {
    return CODE_GRAPH.edges.filter(e =>
      filteredIds.has(typeof e.source === "object" ? e.source.id : e.source) &&
      filteredIds.has(typeof e.target === "object" ? e.target.id : e.target)
    )
  }, [filteredIds])

  useEffect(() => {
    if (!svgRef.current || dims.w === 0) return
    const { w, h } = dims

    // Bug #1 fix: Stop existing simulation before creating new one
    if (simRef.current) {
      simRef.current.stop()
      simRef.current = null
    }

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove()

    // Initialize node positions to avoid NaN (Bug #2 fix)
    const nodes = filteredNodes.map(n => ({
      ...n,
      x: n.x || Math.random() * w,
      y: n.y || Math.random() * h
    }))
    const nodeById = Object.fromEntries(nodes.map(n => [n.id, n]))
    const edges = filteredEdges.map(e => ({
      ...e,
      source: nodeById[typeof e.source === "object" ? e.source.id : e.source],
      target: nodeById[typeof e.target === "object" ? e.target.id : e.target],
    })).filter(e => e.source && e.target)

    // Defs
    const defs = svg.append("defs")
    defs.append("marker")
      .attr("id", "arrow-code")
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 28).attr("refY", 0)
      .attr("markerWidth", 5).attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-4L8,0L0,4").attr("fill", "#334155")

    // Background grid
    const pattern = defs.append("pattern")
      .attr("id", "grid-code").attr("width", 40).attr("height", 40)
      .attr("patternUnits", "userSpaceOnUse")
    pattern.append("path")
      .attr("d", "M 40 0 L 0 0 0 40")
      .attr("fill", "none").attr("stroke", "#0f2040").attr("stroke-width", 0.5)

    svg.append("rect").attr("width", w).attr("height", h).attr("fill", "url(#grid-code)")

    // Bug #7 fix: Extend zoom range for large graphs
    const zoom = d3.zoom()
      .scaleExtent([0.05, 8])
      .on("zoom", e => g.attr("transform", e.transform))
    svg.call(zoom)
    svg.on("click.deselect", () => setSelected(null))

    const g = svg.append("g")

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id(d => d.id).distance(100).strength(0.3))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force("collision", d3.forceCollide().radius(28))
      .alphaDecay(0.028)

    simRef.current = simulation

    // Edges (import dependencies)
    const link = g.append("g").attr("class", "links")
      .selectAll("line")
      .data(edges).join("line")
      .attr("stroke", "#3B82F6")
      .attr("stroke-opacity", 0.5)
      .attr("stroke-width", 1.5)
      .attr("marker-end", "url(#arrow-code)")
      .attr("class", d => `link-${d.source.id || d.source} link-${d.target.id || d.target}`)

    // Nodes
    const node = g.append("g").attr("class", "nodes")
      .selectAll("g")
      .data(nodes).join("g")
      .attr("class", d => `node-${d.id}`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        event.stopPropagation()
        setSelected(prev => prev?.id === d.id ? null : CODE_GRAPH.nodes.find(n => n.id === d.id))
        setSelectedFunction(null) // Reset function selection when changing node
      })
      .on("dblclick", (event, d) => {
        event.stopPropagation()
        // Toggle expand state
        setExpandedNodes(prev => {
          const next = new Set(prev)
          if (next.has(d.id)) {
            next.delete(d.id)
          } else {
            next.add(d.id)
          }
          return next
        })
      })
      .on("mouseenter", (event, d) => {
        // Highlight connected edges
        link.attr("stroke-opacity", e => {
          const src = typeof e.source === "object" ? e.source.id : e.source
          const tgt = typeof e.target === "object" ? e.target.id : e.target
          return (src === d.id || tgt === d.id) ? 1 : 0.1
        }).attr("stroke-width", e => {
          const src = typeof e.source === "object" ? e.source.id : e.source
          const tgt = typeof e.target === "object" ? e.target.id : e.target
          return (src === d.id || tgt === d.id) ? 2.5 : 1.5
        })
        // Highlight connected nodes
        node.style("opacity", n => {
          const isConnected = edges.some(e => {
            const src = typeof e.source === "object" ? e.source.id : e.source
            const tgt = typeof e.target === "object" ? e.target.id : e.target
            return (src === d.id && tgt === n.id) || (tgt === d.id && src === n.id)
          })
          return (n.id === d.id || isConnected) ? 1 : 0.3
        })
      })
      .on("mouseleave", () => {
        link.attr("stroke-opacity", 0.5).attr("stroke-width", 1.5)
        node.style("opacity", 1)
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

    const radius = 20

    // Outer ring
    node.append("circle")
      .attr("r", radius + 5)
      .attr("fill", "none")
      .attr("stroke", d => LAYER_CONFIG[d.layer]?.color || "#6B7280")
      .attr("stroke-width", 0.5)
      .attr("stroke-opacity", 0.3)

    // Main circle
    node.append("circle")
      .attr("r", radius)
      .attr("fill", d => (LAYER_CONFIG[d.layer]?.color || "#6B7280") + "18")
      .attr("stroke", d => LAYER_CONFIG[d.layer]?.color || "#6B7280")
      .attr("stroke-width", d => d.commits > 0 ? 2 : 1.5)

    // Emoji or icon (Bug #6 fix: pointer-events none to avoid intercepting clicks)
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("y", -2)
      .attr("font-size", 12)
      .style("pointer-events", "none")
      .text(d => LAYER_CONFIG[d.layer]?.emoji || "📄")

    // Label (filename) (Bug #6 fix: pointer-events none)
    node.append("text")
      .attr("text-anchor", "middle")
      .attr("y", radius + 12)
      .attr("font-size", 9)
      .attr("font-weight", "600")
      .attr("fill", "#cbd5e1")
      .attr("font-family", "'JetBrains Mono', monospace")
      .style("pointer-events", "none")
      .text(d => d.id)

    // Function count badge (if has functions)
    node.filter(d => d.functions && d.functions.length > 0)
      .append("circle")
      .attr("cx", radius - 5)
      .attr("cy", -radius + 5)
      .attr("r", 8)
      .attr("fill", "#3b82f6")
      .attr("stroke", "#060d1a")
      .attr("stroke-width", 1.5)

    node.filter(d => d.functions && d.functions.length > 0)
      .append("text")
      .attr("x", radius - 5)
      .attr("y", -radius + 5)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("font-size", 9)
      .attr("font-weight", "700")
      .attr("fill", "#fff")
      .style("pointer-events", "none")
      .text(d => d.functions.length)

    simulation.on("tick", () => {
      link
        .attr("x1", d => d.source.x).attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x).attr("y2", d => d.target.y)
      node.attr("transform", d => `translate(${d.x},${d.y})`)
    })

    // Mark simulation as stable for tests (Bug #6 additional fix)
    simulation.on("end", () => {
      svg.attr("data-simulation-stable", "true")
    })

    // Bug #1 fix: Proper cleanup to prevent memory leak
    return () => {
      if (simRef.current) {
        simRef.current.stop()
        simRef.current = null
      }
    }
  }, [filteredNodes, filteredEdges, dims])

  const connectedNodes = useMemo(() => {
    if (!selected) return []
    const connected = new Set()
    CODE_GRAPH.edges.forEach(e => {
      const src = typeof e.source === "object" ? e.source.id : e.source
      const tgt = typeof e.target === "object" ? e.target.id : e.target
      if (src === selected.id) connected.add(tgt)
      if (tgt === selected.id) connected.add(src)
    })
    return Array.from(connected).map(id => CODE_GRAPH.nodes.find(n => n.id === id)).filter(Boolean)
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
            <a href="#/" style={{ color: "#A855F7", textDecoration: "none" }}>OWN</a> <span style={{ color: "#10B981" }}>CODE</span>
          </div>
          <div style={{ fontSize: 9, color: "#334155", marginTop: 1 }}>
            {filteredNodes.length} file · {filteredEdges.length} import · {CODE_GRAPH.stats.total_sloc} SLOC · {CODE_GRAPH.stats.total_commits} commit
          </div>
        </div>

        {/* Search */}
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="cerca file..."
          style={{
            background: "#0f172a", border: "1px solid #1e3a5f", borderRadius: 6,
            padding: "6px 12px", color: "#94a3b8", fontSize: 11, outline: "none",
            width: 160, fontFamily: "inherit"
          }}
        />

        {/* Filters */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          <FilterBtn label="tutti" value="all" current={filter} onClick={setFilter} color="#e2e8f0" />
          {Object.entries(LAYER_CONFIG).map(([k, v]) => (
            <FilterBtn key={k} label={`${v.emoji} ${v.label}`} value={k} current={filter} onClick={setFilter} color={v.color} />
          ))}
        </div>

        <div style={{ marginLeft: "auto", fontSize: 9, color: "#1e3a5f" }}>
          scroll zoom · drag · click file
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
            width: 320, background: "#080f1e",
            borderLeft: `2px solid ${LAYER_CONFIG[selected.layer]?.color || "#6B7280"}`,
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
              background: (LAYER_CONFIG[selected.layer]?.color || "#6B7280") + "10"
            }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{LAYER_CONFIG[selected.layer]?.emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", wordBreak: "break-all" }}>{selected.file}</div>
              <div style={{ fontSize: 10, color: LAYER_CONFIG[selected.layer]?.color, marginTop: 2 }}>
                {LAYER_CONFIG[selected.layer]?.label} · {selected.role}
              </div>
              {/* Expand hint */}
              {selected.functions && selected.functions.length > 0 && !expandedNodes.has(selected.id) && (
                <div style={{ fontSize: 8, color: "#64748b", marginTop: 6, fontStyle: "italic" }}>
                  Double-click node to expand functions
                </div>
              )}
              {expandedNodes.has(selected.id) && (
                <div style={{ fontSize: 8, color: "#3b82f6", marginTop: 6, fontWeight: 600 }}>
                  ✓ Expanded mode — showing {selected.functions?.length || 0} functions
                </div>
              )}
            </div>

            {/* Metrics */}
            <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
              {/* Expanded mode: ONLY functions */}
              {expandedNodes.has(selected.id) && selected.functions && selected.functions.length > 0 ? (
                <div>
                  {selected.functions.map((func, i) => {
                    const isSelected = selectedFunction?.name === func.name
                    const callsFrom = (CODE_GRAPH.function_calls || []).filter(c =>
                      c.source_file === selected.id && c.source_function === func.name
                    )
                    const callsTo = (CODE_GRAPH.function_calls || []).filter(c =>
                      c.target_file === selected.id && c.target_function === func.name
                    )

                    return (
                      <div key={i}
                        onClick={() => setSelectedFunction(isSelected ? null : {...func, calls_from: callsFrom, calls_to: callsTo})}
                        style={{
                          padding: "10px 12px", marginBottom: 6,
                          background: isSelected ? "#1e3a5f" : "#0a1628",
                          borderRadius: 6,
                          border: `2px solid ${isSelected ? "#3b82f6" : "#0f2040"}`,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { if (!isSelected) e.target.style.background = "#0f2040" }}
                        onMouseLeave={e => { if (!isSelected) e.target.style.background = "#0a1628" }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 11, color: isSelected ? "#3b82f6" : "#10B981", fontWeight: 700, fontFamily: "monospace" }}>
                            {func.name.split('.').pop()}
                          </span>
                          {func.is_async && (
                            <span style={{ fontSize: 8, color: "#6366f1", background: "#1e1b4b", padding: "2px 5px", borderRadius: 3 }}>
                              async
                            </span>
                          )}
                          {callsFrom.length > 0 && (
                            <span style={{ fontSize: 8, color: "#64748b", marginLeft: "auto" }}>
                              → {callsFrom.length}
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b", fontFamily: "monospace" }}>
                          ({func.params.join(', ')})
                        </div>
                        <div style={{ fontSize: 8, color: "#334155", marginTop: 3 }}>
                          lines {func.line_start}-{func.line_end}
                        </div>

                        {/* Inline call graph when function selected */}
                        {isSelected && (callsFrom.length > 0 || callsTo.length > 0) && (
                          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid #1e3a5f" }}>
                            {callsFrom.length > 0 && (
                              <div style={{ marginBottom: 6 }}>
                                <div style={{ fontSize: 7, color: "#64748b", marginBottom: 3 }}>CALLS:</div>
                                {callsFrom.slice(0, 5).map((call, j) => (
                                  <div key={j} style={{
                                    fontSize: 8, color: "#10B981", fontFamily: "monospace",
                                    padding: "2px 4px", marginBottom: 1
                                  }}>
                                    {call.target_file !== selected.id && `${call.target_file}.`}
                                    {call.target_function.split('.').pop()}
                                  </div>
                                ))}
                                {callsFrom.length > 5 && (
                                  <div style={{ fontSize: 7, color: "#64748b", marginTop: 2 }}>
                                    +{callsFrom.length - 5} more
                                  </div>
                                )}
                              </div>
                            )}
                            {callsTo.length > 0 && (
                              <div>
                                <div style={{ fontSize: 7, color: "#64748b", marginBottom: 3 }}>CALLED BY:</div>
                                {callsTo.slice(0, 3).map((call, j) => (
                                  <div key={j} style={{
                                    fontSize: 8, color: "#6366f1", fontFamily: "monospace",
                                    padding: "2px 4px", marginBottom: 1
                                  }}>
                                    {call.source_file !== selected.id && `${call.source_file}.`}
                                    {call.source_function.split('.').pop()}
                                  </div>
                                ))}
                                {callsTo.length > 3 && (
                                  <div style={{ fontSize: 7, color: "#64748b", marginTop: 2 }}>
                                    +{callsTo.length - 3} more
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                /* Normal mode: all metrics + functions */
                <>
              {/* Last Modified */}
              {selected.last_modified && (
                <div style={{ marginBottom: 14, padding: "8px 10px", background: "#0a1628", borderRadius: 6, border: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em" }}>LAST MODIFIED</div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 3, fontFamily: "monospace" }}>
                    {new Date(selected.last_modified).toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              )}

              {/* Risk Score */}
              {selected.risk_score > 0 && (
                <div style={{ marginBottom: 14, padding: "8px 10px", background: selected.risk_score > 50 ? "#7f1d1d" : "#0a1628", borderRadius: 6, border: `1px solid ${selected.risk_score > 50 ? "#991b1b" : "#0f2040"}` }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em" }}>RISK SCORE</div>
                  <div style={{ fontSize: 14, color: selected.risk_score > 50 ? "#EF4444" : "#F59E0B", marginTop: 3, fontWeight: 700 }}>
                    {selected.risk_score}/100
                  </div>
                  <div style={{ fontSize: 9, color: "#64748b", marginTop: 2 }}>
                    {selected.risk_score > 70 ? "High complexity + churn" : selected.risk_score > 30 ? "Moderate risk" : "Low risk"}
                  </div>
                </div>
              )}

              {/* Exports */}
              {selected.exports && selected.exports.length > 0 && (
                <div style={{ marginBottom: 14, padding: "8px 10px", background: "#0a1628", borderRadius: 6, border: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 6 }}>
                    EXPORTS ({selected.exports.length})
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {selected.exports.map((exp, i) => (
                      <span key={i} style={{
                        fontSize: 10, color: "#10B981", background: "#064e3b",
                        padding: "3px 7px", borderRadius: 4, fontFamily: "monospace", border: "1px solid #065f46"
                      }}>
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <Metric label="SLOC" value={selected.sloc} />
                <Metric label="Methods" value={selected.methods} />
                <Metric label="Imports" value={selected.imports} />
                <Metric label="Complexity" value={selected.complexity} />
                <Metric label="Fan In" value={selected.fan_in} />
                <Metric label="Fan Out" value={selected.fan_out} />
                <Metric label="Commits" value={selected.commits} color={selected.commits > 3 ? "#F59E0B" : null} />
                <Metric label="Bugs" value={selected.bugs} color={selected.bugs > 0 ? "#EF4444" : null} />
              </div>

              {/* Functions (TIER 2) */}
              {selected.functions && selected.functions.length > 0 && (
                <div style={{ marginBottom: 14, paddingTop: 14, borderTop: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                    FUNCTIONS ({selected.functions.length})
                  </div>
                  {selected.functions.map((func, i) => {
                    const isSelected = selectedFunction?.name === func.name
                    // Find calls from this function
                    const callsFrom = (CODE_GRAPH.function_calls || []).filter(c =>
                      c.source_file === selected.id && c.source_function === func.name
                    )
                    const callsTo = (CODE_GRAPH.function_calls || []).filter(c =>
                      c.target_file === selected.id && c.target_function === func.name
                    )

                    return (
                      <div key={i}
                        onClick={() => setSelectedFunction(isSelected ? null : {...func, calls_from: callsFrom, calls_to: callsTo})}
                        style={{
                          padding: "8px 10px", marginBottom: 4,
                          background: isSelected ? "#1e3a5f" : "#0a1628",
                          borderRadius: 6,
                          border: `1px solid ${isSelected ? "#3b82f6" : "#0f2040"}`,
                          cursor: "pointer",
                          transition: "all 0.15s"
                        }}
                        onMouseEnter={e => { if (!isSelected) e.target.style.background = "#0f2040" }}
                        onMouseLeave={e => { if (!isSelected) e.target.style.background = "#0a1628" }}
                      >
                        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 10, color: isSelected ? "#3b82f6" : "#10B981", fontWeight: 600, fontFamily: "monospace" }}>
                            {func.name.split('.').pop()}
                          </span>
                          {func.is_async && (
                            <span style={{ fontSize: 8, color: "#6366f1", background: "#1e1b4b", padding: "1px 4px", borderRadius: 3 }}>
                              async
                            </span>
                          )}
                          {callsFrom.length > 0 && (
                            <span style={{ fontSize: 8, color: "#64748b", marginLeft: "auto" }}>
                              → {callsFrom.length} calls
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 9, color: "#64748b", fontFamily: "monospace" }}>
                          ({func.params.join(', ')})
                        </div>
                        <div style={{ fontSize: 8, color: "#334155", marginTop: 3 }}>
                          lines {func.line_start}-{func.line_end}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Function Call Graph (TIER 2) */}
              {selectedFunction && (
                <div style={{ marginBottom: 14, paddingTop: 14, borderTop: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                    CALL GRAPH: {selectedFunction.name.split('.').pop()}
                  </div>

                  {selectedFunction.calls_from && selectedFunction.calls_from.length > 0 && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 8, color: "#64748b", marginBottom: 4 }}>Calls to:</div>
                      {selectedFunction.calls_from.map((call, i) => (
                        <div key={i} style={{
                          padding: "5px 8px", marginBottom: 2,
                          background: "#064e3b", borderRadius: 4,
                          border: "1px solid #065f46"
                        }}>
                          <span style={{ fontSize: 9, color: "#10B981", fontFamily: "monospace" }}>
                            {call.target_file !== selected.id && `${call.target_file}.`}
                            {call.target_function.split('.').pop()}
                          </span>
                          <span style={{ fontSize: 8, color: "#334155", marginLeft: 4 }}>
                            line {call.line}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedFunction.calls_to && selectedFunction.calls_to.length > 0 && (
                    <div>
                      <div style={{ fontSize: 8, color: "#64748b", marginBottom: 4 }}>Called by:</div>
                      {selectedFunction.calls_to.map((call, i) => (
                        <div key={i} style={{
                          padding: "5px 8px", marginBottom: 2,
                          background: "#1e1b4b", borderRadius: 4,
                          border: "1px solid #312e81"
                        }}>
                          <span style={{ fontSize: 9, color: "#6366f1", fontFamily: "monospace" }}>
                            {call.source_file !== selected.id && `${call.source_file}.`}
                            {call.source_function.split('.').pop()}
                          </span>
                          <span style={{ fontSize: 8, color: "#334155", marginLeft: 4 }}>
                            line {call.line}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!selectedFunction.calls_from || selectedFunction.calls_from.length === 0) &&
                   (!selectedFunction.calls_to || selectedFunction.calls_to.length === 0) && (
                    <div style={{ fontSize: 9, color: "#64748b", fontStyle: "italic" }}>
                      No calls tracked for this function
                    </div>
                  )}
                </div>
              )}

              {/* Connected files */}
              {!expandedNodes.has(selected.id) && connectedNodes.length > 0 && (
                <div style={{ marginTop: 8, paddingTop: 14, borderTop: "1px solid #0f2040" }}>
                  <div style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 8 }}>
                    IMPORT/EXPORT ({connectedNodes.length})
                  </div>
                  {connectedNodes.map((n, i) => (
                    <div key={i} className="conn-row"
                      onClick={() => setSelected(n)}
                      style={{
                        display: "flex", alignItems: "center", gap: 8,
                        padding: "7px 10px", marginBottom: 3,
                        background: "#0a1628", borderRadius: 6, cursor: "pointer",
                        border: "1px solid #0f2040", transition: "background 0.1s"
                      }}>
                      <span style={{ fontSize: 10, color: LAYER_CONFIG[n.layer]?.color, fontWeight: 600 }}>
                        {LAYER_CONFIG[n.layer]?.emoji} {n.id}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              </>
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

      {/* Footer */}
      <div style={{
        padding: "8px 20px", borderTop: "1px solid #0f2040",
        display: "flex", gap: 16, alignItems: "center", flexShrink: 0,
        background: "#080f1e"
      }}>
        {Object.entries(LAYER_CONFIG).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: v.color, opacity: 0.8 }} />
            <span style={{ fontSize: 9, color: "#334155" }}>{v.label}</span>
          </div>
        ))}
        <span style={{ fontSize: 9, color: "#1e3a5f", marginLeft: "auto" }}>
          {CODE_GRAPH.name} · {CODE_GRAPH.language} · {CODE_GRAPH.stats?.total_edges || 0} dependencies
        </span>
      </div>
    </div>
  )
}

function Metric({ label, value, color }) {
  return (
    <div style={{ background: "#0a1628", padding: "8px 10px", borderRadius: 6, border: "1px solid #0f2040" }}>
      <div style={{ fontSize: 8, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: color || "#e2e8f0" }}>{value}</div>
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
