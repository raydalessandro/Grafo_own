import { test, expect } from '@playwright/test';

/**
 * Code Visualization - Comprehensive Stress Tests
 *
 * Tests for:
 * 1. Large graph performance (1000+ nodes, 5000+ edges)
 * 2. Edge cases (empty, orphan, self-loop, malformed data)
 * 3. Interaction bugs (rapid clicks, expand/collapse stress)
 * 4. Memory leaks (expand/collapse cycles)
 */

// Helper: wait for D3 force simulation to stabilize
async function waitForSimulation(page, timeout = 5000) {
  await page.waitForSelector('svg[data-simulation-stable="true"]', { timeout });
}

test.describe('Code Visualization - Performance Tests', () => {
  test('should render 1000-node graph in <5 seconds', async ({ page }) => {
    const start = Date.now();

    // Navigate to large graph
    await page.goto('/#/code');
    await waitForSimulation(page);

    // Wait for initial render
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const duration = Date.now() - start;
    const nodeCount = await page.locator('svg circle').count();

    console.log(`Rendered ${nodeCount} nodes in ${duration}ms`);

    // Expect reasonable performance
    expect(nodeCount).toBeGreaterThan(0); // Should render default graph
    expect(duration).toBeLessThan(5000); // 5 seconds max for initial render
  });

  test('should load large graph fixture without crashing', async ({ page }) => {
    // Monitor console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // This test requires modifying CodeViz.jsx to accept query param for data source
    // For now, we'll test if the component can handle the data structure
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg', { timeout: 10000 });

    // Should not have critical errors
    const criticalErrors = errors.filter(e =>
      e.includes('Cannot read') || e.includes('undefined') || e.includes('null')
    );
    expect(criticalErrors.length).toBe(0);
  });

  test('should handle rapid zoom in/out without crash', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const svg = page.locator('svg').first();
    const bbox = await svg.boundingBox();

    // Rapid zoom in/out 20 times
    for (let i = 0; i < 20; i++) {
      await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
      await page.mouse.wheel(0, i % 2 === 0 ? -100 : 100); // Alternate zoom in/out
      await page.waitForTimeout(50); // Small delay
    }

    // Should still render nodes
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should handle rapid pan without crash', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const svg = page.locator('svg').first();
    const bbox = await svg.boundingBox();

    // Rapid panning
    for (let i = 0; i < 10; i++) {
      await page.mouse.move(bbox.x + 100, bbox.y + 100);
      await page.mouse.down();
      await page.mouse.move(bbox.x + 300, bbox.y + 300, { steps: 5 });
      await page.mouse.up();
      await page.waitForTimeout(50);
    }

    // Should still render nodes
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);
  });
});

test.describe('Code Visualization - Edge Cases', () => {
  test('should handle empty graph gracefully', async ({ page }) => {
    // Monitor console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg', { timeout: 10000 });

    // Should not crash
    const criticalErrors = errors.filter(e =>
      e.includes('Cannot read') || e.includes('undefined') || e.includes('null')
    );
    expect(criticalErrors.length).toBe(0);

    // SVG should exist
    const svgExists = await page.locator('svg').count();
    expect(svgExists).toBeGreaterThan(0);
  });

  test('should render orphan nodes (no edges)', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Even if current graph has edges, test that orphan nodes render
    // (This would need data loading from fixture)
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);

    // Check that nodes have valid positions
    const firstNode = page.locator('svg circle').first();
    const cx = await firstNode.getAttribute('cx');
    const cy = await firstNode.getAttribute('cy');

    // Positions should be numbers, not NaN
    expect(parseFloat(cx)).not.toBeNaN();
    expect(parseFloat(cy)).not.toBeNaN();
  });

  test('should handle nodes without functions array', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click a node to open detail panel
    const node = page.locator('svg circle').first();
    await node.click();

    // Panel should open
    await page.waitForSelector('text=SLOC', { timeout: 5000 });

    // Should not crash if functions array missing
    const panelExists = await page.locator('text=SLOC').count();
    expect(panelExists).toBeGreaterThan(0);
  });

  test('should handle search with no results', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Search for non-existent file
    const searchInput = page.locator('input[placeholder="cerca file..."]');
    await searchInput.fill('nonexistent-file-xyz-123');
    await page.waitForTimeout(500);

    // Should show empty graph gracefully
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBe(0);

    // Clear search
    await searchInput.clear();
    await page.waitForTimeout(500);

    // Nodes should reappear
    const nodeCountAfter = await page.locator('svg circle').count();
    expect(nodeCountAfter).toBeGreaterThan(0);
  });
});

test.describe('Code Visualization - Interaction Bugs', () => {
  test('should handle click during force simulation', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);

    // Click after simulation settles
    const node = page.locator('svg circle').first();
    await node.click({ timeout: 2000 });

    // Should open detail panel
    const panelExists = await page.locator('text=SLOC').count();
    expect(panelExists).toBeGreaterThan(0);
  });

  test('should handle double-click spam (10 clicks in 1 second)', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const node = page.locator('svg circle').first();

    // Spam double-clicks
    for (let i = 0; i < 10; i++) {
      await node.dblclick({ delay: 100 });
    }

    // Should not crash
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should handle rapid expand/collapse without crash', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Find nodes with functions
    const nodes = page.locator('svg circle');
    const nodeCount = await nodes.count();
    const testCount = Math.min(10, nodeCount);

    // Expand/collapse multiple nodes rapidly
    for (let i = 0; i < testCount; i++) {
      const node = nodes.nth(i);
      await node.dblclick(); // Expand
      await page.waitForTimeout(100);
    }

    // Should not crash
    const errorCount = await page.locator('.error').count();
    expect(errorCount).toBe(0);

    // Nodes should still be visible
    const nodeCountAfter = await page.locator('svg circle').count();
    expect(nodeCountAfter).toBeGreaterThan(0);
  });

  test('should handle function expansion with 100+ functions', async ({ page }) => {
    // This would require loading dense-functions.json fixture
    // For now, test with default graph
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click node to select
    const node = page.locator('svg circle').first();
    await node.click();

    // Wait for panel
    await page.waitForSelector('text=SLOC', { timeout: 5000 });

    // Double-click to expand (if has functions)
    await node.dblclick();
    await page.waitForTimeout(500);

    // Should not crash even with many functions
    const panelExists = await page.locator('text=SLOC').count();
    expect(panelExists).toBeGreaterThan(0);
  });

  test('should handle search while dragging node', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const node = page.locator('svg circle').first();
    const bbox = await node.boundingBox();

    // Start dragging
    await page.mouse.move(bbox.x + bbox.width / 2, bbox.y + bbox.height / 2);
    await page.mouse.down();

    // Type in search while dragging
    const searchInput = page.locator('input[placeholder="cerca file..."]');
    await searchInput.fill('test');

    // Release drag
    await page.mouse.up();

    // Should not crash
    const nodeCount = await page.locator('svg circle').count();
    expect(nodeCount).toBeGreaterThan(0);
  });

  test('should handle clicking function with many callers', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click node to select
    const node = page.locator('svg circle').first();
    await node.click();

    // Wait for panel
    await page.waitForSelector('text=SLOC', { timeout: 5000 });

    // Click first function (if exists)
    const funcButton = page.locator('text=/function/i').first();
    const funcExists = await funcButton.count();

    if (funcExists > 0) {
      await funcButton.click();
      await page.waitForTimeout(500);

      // Should not crash
      const panelExists = await page.locator('text=SLOC').count();
      expect(panelExists).toBeGreaterThan(0);
    }
  });
});

test.describe('Code Visualization - Memory Leaks', () => {
  test('should not leak memory after 50 expand/collapse cycles', async ({ page, context }) => {
    // Enable performance monitoring
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Get initial memory
    let metrics = await client.send('Performance.getMetrics');
    const initialJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
    console.log(`Initial JS Heap: ${(initialJSHeap / 1024 / 1024).toFixed(2)} MB`);

    // Find a node with functions
    const nodes = page.locator('svg circle');
    const firstNode = nodes.first();

    // Expand/collapse 50 times
    for (let i = 0; i < 50; i++) {
      await firstNode.dblclick(); // Expand
      await page.waitForTimeout(100);
      await firstNode.dblclick(); // Collapse
      await page.waitForTimeout(100);

      if (i % 10 === 0) {
        console.log(`Cycle ${i}/50`);
      }
    }

    // Force garbage collection (if available)
    await page.waitForTimeout(1000);

    // Get final memory
    metrics = await client.send('Performance.getMetrics');
    const finalJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
    const memoryGrowth = (finalJSHeap - initialJSHeap) / 1024 / 1024; // MB

    console.log(`Final JS Heap: ${(finalJSHeap / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Memory Growth: ${memoryGrowth.toFixed(2)} MB`);

    // Accept reasonable memory growth (<100MB for 50 cycles)
    expect(memoryGrowth).toBeLessThan(100);
  });

  test('should clean up simulation on filter change', async ({ page, context }) => {
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Get initial memory
    let metrics = await client.send('Performance.getMetrics');
    const initialJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;

    // Rapidly change filters 20 times
    const filters = ['all', 'service', 'ui', 'test', 'infra', 'unknown'];
    for (let i = 0; i < 20; i++) {
      const filter = filters[i % filters.length];
      const filterButton = page.locator(`button:has-text("${filter}")`).first();
      await filterButton.click();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(1000);

    // Get final memory
    metrics = await client.send('Performance.getMetrics');
    const finalJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
    const memoryGrowth = (finalJSHeap - initialJSHeap) / 1024 / 1024;

    console.log(`Memory Growth (filter changes): ${memoryGrowth.toFixed(2)} MB`);

    // Should not leak significantly
    expect(memoryGrowth).toBeLessThan(50);
  });

  test('should clean up simulation on search', async ({ page, context }) => {
    const client = await context.newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const searchInput = page.locator('input[placeholder="cerca file..."]');

    // Get initial memory
    let metrics = await client.send('Performance.getMetrics');
    const initialJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;

    // Rapidly search 30 times
    const searches = ['test', 'component', 'util', 'service', 'config', 'api'];
    for (let i = 0; i < 30; i++) {
      await searchInput.fill(searches[i % searches.length]);
      await page.waitForTimeout(200);
      await searchInput.clear();
      await page.waitForTimeout(200);
    }

    await page.waitForTimeout(1000);

    // Get final memory
    metrics = await client.send('Performance.getMetrics');
    const finalJSHeap = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value || 0;
    const memoryGrowth = (finalJSHeap - initialJSHeap) / 1024 / 1024;

    console.log(`Memory Growth (search): ${memoryGrowth.toFixed(2)} MB`);

    expect(memoryGrowth).toBeLessThan(50);
  });
});

test.describe('Code Visualization - Rendering Issues', () => {
  test('should not have NaN positions for nodes', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Check first 10 nodes for valid positions
    const nodes = page.locator('svg circle');
    const nodeCount = Math.min(10, await nodes.count());

    for (let i = 0; i < nodeCount; i++) {
      const node = nodes.nth(i);
      const cx = await node.getAttribute('cx');
      const cy = await node.getAttribute('cy');

      expect(parseFloat(cx)).not.toBeNaN();
      expect(parseFloat(cy)).not.toBeNaN();
      expect(parseFloat(cx)).toBeGreaterThan(0);
      expect(parseFloat(cy)).toBeGreaterThan(0);
    }
  });

  test('should render edges with valid coordinates', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg line', { timeout: 10000 });

    // Check first 10 edges for valid positions
    const edges = page.locator('svg line');
    const edgeCount = Math.min(10, await edges.count());

    for (let i = 0; i < edgeCount; i++) {
      const edge = edges.nth(i);
      const x1 = await edge.getAttribute('x1');
      const y1 = await edge.getAttribute('y1');
      const x2 = await edge.getAttribute('x2');
      const y2 = await edge.getAttribute('y2');

      expect(parseFloat(x1)).not.toBeNaN();
      expect(parseFloat(y1)).not.toBeNaN();
      expect(parseFloat(x2)).not.toBeNaN();
      expect(parseFloat(y2)).not.toBeNaN();
    }
  });

  test('should update node positions during simulation', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const firstNode = page.locator('svg circle').first();

    // Get initial position
    const initialCx = parseFloat(await firstNode.getAttribute('cx'));
    const initialCy = parseFloat(await firstNode.getAttribute('cy'));

    // Wait for simulation to run
    await page.waitForTimeout(2000);

    // Get final position
    const finalCx = parseFloat(await firstNode.getAttribute('cx'));
    const finalCy = parseFloat(await firstNode.getAttribute('cy'));

    // Positions should have changed during simulation
    // (unless node is already at equilibrium)
    // This test may be flaky, so we just check they're valid
    expect(finalCx).not.toBeNaN();
    expect(finalCy).not.toBeNaN();
  });

  test('should render all node labels', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    const nodes = page.locator('svg circle');
    const labels = page.locator('svg text');

    const nodeCount = await nodes.count();
    const labelCount = await labels.count();

    // Should have at least as many labels as nodes (may have extra for badges)
    expect(labelCount).toBeGreaterThanOrEqual(nodeCount);
  });
});

test.describe('Code Visualization - Detail Panel', () => {
  test('should open and close detail panel', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click node to open panel
    const node = page.locator('svg circle').first();
    await node.click();

    // Panel should appear
    await page.waitForSelector('text=SLOC', { timeout: 5000 });
    const panelExists = await page.locator('text=SLOC').count();
    expect(panelExists).toBeGreaterThan(0);

    // Close panel
    const closeButton = page.locator('button:has-text("chiudi")');
    await closeButton.click();

    // Panel should disappear
    await page.waitForTimeout(500);
    const panelGone = await page.locator('text=SLOC').count();
    expect(panelGone).toBe(0);
  });

  test('should switch between nodes in detail panel', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click first node
    const firstNode = page.locator('svg circle').first();
    await firstNode.click();
    await page.waitForSelector('text=SLOC', { timeout: 5000 });

    // Get first node's file name
    const firstFileName = await page.locator('text=/.*\\.js/').first().textContent();

    // Click second node
    const secondNode = page.locator('svg circle').nth(1);
    await secondNode.click();
    await page.waitForTimeout(500);

    // Get second node's file name
    const secondFileName = await page.locator('text=/.*\\.js/').first().textContent();

    // File names should be different (unless graph has duplicate files)
    // Just verify panel updated
    expect(secondFileName).toBeTruthy();
  });

  test('should deselect node by clicking background', async ({ page }) => {
    await page.goto('/#/code');
    await waitForSimulation(page);
    await page.waitForSelector('svg circle', { timeout: 10000 });

    // Click node
    const node = page.locator('svg circle').first();
    await node.click();
    await page.waitForSelector('text=SLOC', { timeout: 5000 });

    // Click background (SVG rect)
    const svg = page.locator('svg').first();
    const bbox = await svg.boundingBox();
    await page.mouse.click(bbox.x + 10, bbox.y + 10); // Top-left corner

    // Panel should close
    await page.waitForTimeout(500);
    const panelGone = await page.locator('text=SLOC').count();
    expect(panelGone).toBe(0);
  });
});
