#!/usr/bin/env node
/**
 * Generate stress test fixtures for Code Visualization app
 *
 * Creates:
 * - large-graph.json: 1000 nodes, 5000 edges (realistic React/Next.js repo)
 * - empty-graph.json: 0 nodes, 0 edges
 * - orphan-nodes.json: 10 nodes, 0 edges
 * - self-loop.json: 1 node importing itself
 * - malformed.json: missing required fields
 * - dense-functions.json: nodes with 100+ functions each
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LAYERS = ['service', 'ui', 'test', 'infra', 'unknown'];
const ROLES = ['controller', 'component', 'utility', 'test', 'config'];

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNode(id, options = {}) {
  const layer = options.layer || randomChoice(LAYERS);
  const hasFunction = options.hasFunction !== undefined ? options.hasFunction : Math.random() > 0.3;
  const functionCount = options.functionCount || (hasFunction ? randomInt(1, 15) : 0);

  const functions = hasFunction ? Array.from({ length: functionCount }, (_, i) => ({
    name: `${id}.function${i}`,
    params: Array.from({ length: randomInt(0, 4) }, (_, j) => `param${j}`),
    is_async: Math.random() > 0.5,
    is_generator: false,
    line_start: i * 20 + 1,
    line_end: i * 20 + randomInt(5, 20),
    jsdoc: null
  })) : [];

  return {
    id,
    file: `src/${layer}/${id}.js`,
    layer,
    role: randomChoice(ROLES),
    sloc: randomInt(10, 500),
    methods: functionCount,
    imports: randomInt(0, 20),
    fan_in: 0, // Will be calculated from edges
    fan_out: 0, // Will be calculated from edges
    complexity: randomInt(1, 50),
    nesting: randomInt(1, 5),
    commits: randomInt(0, 20),
    authors: randomInt(1, 5),
    bugs: randomInt(0, 3),
    exports: hasFunction ? functions.map(f => f.name.split('.').pop()) : [],
    last_modified: new Date(Date.now() - randomInt(0, 90 * 24 * 60 * 60 * 1000)).toISOString(),
    risk_score: randomInt(0, 100),
    functions,
    function_calls: []
  };
}

function generateEdges(nodes, edgeCount) {
  const edges = [];
  const nodeIds = nodes.map(n => n.id);

  for (let i = 0; i < edgeCount; i++) {
    const source = randomChoice(nodeIds);
    const target = randomChoice(nodeIds);

    // Avoid duplicate edges and self-loops (except for self-loop test)
    if (source !== target && !edges.some(e => e.source === source && e.target === target)) {
      edges.push({ source, target });
    }
  }

  return edges;
}

function calculateFanInOut(nodes, edges) {
  const fanIn = {};
  const fanOut = {};

  nodes.forEach(n => {
    fanIn[n.id] = 0;
    fanOut[n.id] = 0;
  });

  edges.forEach(e => {
    fanOut[e.source] = (fanOut[e.source] || 0) + 1;
    fanIn[e.target] = (fanIn[e.target] || 0) + 1;
  });

  return nodes.map(n => ({
    ...n,
    fan_in: fanIn[n.id] || 0,
    fan_out: fanOut[n.id] || 0
  }));
}

function generateFunctionCalls(nodes, callCount) {
  const calls = [];
  const nodesWithFunctions = nodes.filter(n => n.functions && n.functions.length > 0);

  if (nodesWithFunctions.length < 2) return [];

  for (let i = 0; i < callCount; i++) {
    const sourceNode = randomChoice(nodesWithFunctions);
    const targetNode = randomChoice(nodesWithFunctions);
    const sourceFunc = randomChoice(sourceNode.functions);
    const targetFunc = randomChoice(targetNode.functions);

    calls.push({
      source_file: sourceNode.id,
      source_function: sourceFunc.name,
      target_file: targetNode.id,
      target_function: targetFunc.name,
      line: randomInt(sourceFunc.line_start, sourceFunc.line_end)
    });
  }

  return calls;
}

// 1. Large Graph (1000 nodes, 5000 edges)
console.log('Generating large-graph.json (1000 nodes, 5000 edges)...');
const largeNodes = Array.from({ length: 1000 }, (_, i) => generateNode(`node${i}`));
const largeEdges = generateEdges(largeNodes, 5000);
const largeNodesWithFan = calculateFanInOut(largeNodes, largeEdges);
const largeFunctionCalls = generateFunctionCalls(largeNodesWithFan, 2000);

const largeGraph = {
  name: "stress-large-graph",
  language: "javascript",
  stats: {
    total_nodes: largeNodes.length,
    total_edges: largeEdges.length,
    total_sloc: largeNodes.reduce((sum, n) => sum + n.sloc, 0),
    total_commits: largeNodes.reduce((sum, n) => sum + n.commits, 0),
    total_bugs: largeNodes.reduce((sum, n) => sum + n.bugs, 0),
    total_function_calls: largeFunctionCalls.length
  },
  nodes: largeNodesWithFan,
  edges: largeEdges,
  function_calls: largeFunctionCalls
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/large-graph.json'),
  JSON.stringify(largeGraph, null, 2)
);
console.log('✓ large-graph.json created');

// 2. Empty Graph (0 nodes, 0 edges)
console.log('Generating empty-graph.json...');
const emptyGraph = {
  name: "stress-empty-graph",
  language: "javascript",
  stats: {
    total_nodes: 0,
    total_edges: 0,
    total_sloc: 0,
    total_commits: 0,
    total_bugs: 0,
    total_function_calls: 0
  },
  nodes: [],
  edges: [],
  function_calls: []
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/empty-graph.json'),
  JSON.stringify(emptyGraph, null, 2)
);
console.log('✓ empty-graph.json created');

// 3. Orphan Nodes (10 nodes, 0 edges)
console.log('Generating orphan-nodes.json...');
const orphanNodes = Array.from({ length: 10 }, (_, i) => generateNode(`orphan${i}`));
const orphanGraph = {
  name: "stress-orphan-nodes",
  language: "javascript",
  stats: {
    total_nodes: 10,
    total_edges: 0,
    total_sloc: orphanNodes.reduce((sum, n) => sum + n.sloc, 0),
    total_commits: orphanNodes.reduce((sum, n) => sum + n.commits, 0),
    total_bugs: orphanNodes.reduce((sum, n) => sum + n.bugs, 0),
    total_function_calls: 0
  },
  nodes: orphanNodes,
  edges: [],
  function_calls: []
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/orphan-nodes.json'),
  JSON.stringify(orphanGraph, null, 2)
);
console.log('✓ orphan-nodes.json created');

// 4. Self-Loop (1 node importing itself)
console.log('Generating self-loop.json...');
const selfLoopNode = generateNode('self-loop');
const selfLoopGraph = {
  name: "stress-self-loop",
  language: "javascript",
  stats: {
    total_nodes: 1,
    total_edges: 1,
    total_sloc: selfLoopNode.sloc,
    total_commits: selfLoopNode.commits,
    total_bugs: selfLoopNode.bugs,
    total_function_calls: 0
  },
  nodes: [{ ...selfLoopNode, fan_in: 1, fan_out: 1 }],
  edges: [{ source: 'self-loop', target: 'self-loop' }],
  function_calls: []
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/self-loop.json'),
  JSON.stringify(selfLoopGraph, null, 2)
);
console.log('✓ self-loop.json created');

// 5. Malformed (missing required fields)
console.log('Generating malformed.json...');
const malformedGraph = {
  name: "stress-malformed",
  language: "javascript",
  stats: {
    total_nodes: 3,
    total_edges: 2
    // Missing total_sloc, total_commits, etc.
  },
  nodes: [
    { id: 'node1', file: 'src/node1.js' }, // Missing most fields
    { id: 'node2' }, // Missing file field
    generateNode('node3') // Valid node for comparison
  ],
  edges: [
    { source: 'node1', target: 'node2' },
    { source: 'node2' } // Missing target
  ],
  function_calls: []
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/malformed.json'),
  JSON.stringify(malformedGraph, null, 2)
);
console.log('✓ malformed.json created');

// 6. Dense Functions (nodes with 100+ functions each)
console.log('Generating dense-functions.json...');
const denseFuncNodes = Array.from({ length: 10 }, (_, i) =>
  generateNode(`dense${i}`, { hasFunction: true, functionCount: randomInt(50, 150) })
);
const denseFuncEdges = generateEdges(denseFuncNodes, 20);
const denseFuncNodesWithFan = calculateFanInOut(denseFuncNodes, denseFuncEdges);
const denseFunctionCalls = generateFunctionCalls(denseFuncNodesWithFan, 500);

const denseFuncGraph = {
  name: "stress-dense-functions",
  language: "javascript",
  stats: {
    total_nodes: 10,
    total_edges: 20,
    total_sloc: denseFuncNodes.reduce((sum, n) => sum + n.sloc, 0),
    total_commits: denseFuncNodes.reduce((sum, n) => sum + n.commits, 0),
    total_bugs: denseFuncNodes.reduce((sum, n) => sum + n.bugs, 0),
    total_function_calls: denseFunctionCalls.length
  },
  nodes: denseFuncNodesWithFan,
  edges: denseFuncEdges,
  function_calls: denseFunctionCalls
};

fs.writeFileSync(
  path.join(__dirname, '../src/data/stress/dense-functions.json'),
  JSON.stringify(denseFuncGraph, null, 2)
);
console.log('✓ dense-functions.json created');

console.log('\n✅ All fixtures generated successfully!');
console.log('\nFixtures created:');
console.log('  - large-graph.json (1000 nodes, 5000 edges, ~2000 function calls)');
console.log('  - empty-graph.json (0 nodes, 0 edges)');
console.log('  - orphan-nodes.json (10 nodes, 0 edges)');
console.log('  - self-loop.json (1 node importing itself)');
console.log('  - malformed.json (missing required fields)');
console.log('  - dense-functions.json (10 nodes with 50-150 functions each)');
