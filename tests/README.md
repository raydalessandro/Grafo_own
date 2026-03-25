# Code Visualization - Testing Infrastructure

Comprehensive stress tests and bug tracking for the D3.js force-directed graph visualization.

---

## Quick Start

```bash
# Install dependencies
npm install

# Generate stress test fixtures
npm run generate-fixtures

# Run all tests
npm test

# Run stress tests only
npm run test:stress

# Run tests with UI
npm run test:ui

# View test report
npm run test:report
```

---

## Test Fixtures

Located in `src/data/stress/`:

| Fixture | Description | Purpose |
|---------|-------------|---------|
| `large-graph.json` | 1000 nodes, 5000 edges | Performance testing, memory profiling |
| `empty-graph.json` | 0 nodes, 0 edges | Edge case: empty data |
| `orphan-nodes.json` | 10 nodes, 0 edges | Edge case: nodes without connections |
| `self-loop.json` | 1 node importing itself | Edge case: circular dependency |
| `malformed.json` | Missing required fields | Error handling validation |
| `dense-functions.json` | 10 nodes, 50-150 functions each | UI stress test for function expansion |

**Generate new fixtures:**
```bash
npm run generate-fixtures
```

---

## Test Suites

### 1. Performance Tests (`stress.spec.js`)
- Render time for 1000-node graph (<5s)
- Rapid zoom in/out (20 cycles, no crash)
- Rapid pan (10 cycles, no crash)

### 2. Edge Case Tests
- Empty graph handling
- Orphan nodes (no edges)
- Nodes without functions array
- Search with no results

### 3. Interaction Bug Tests
- Click during force simulation
- Double-click spam (10 clicks/second)
- Rapid expand/collapse (10 nodes)
- Function expansion with 100+ functions
- Search while dragging node

### 4. Memory Leak Tests
- 50 expand/collapse cycles (<100MB growth)
- Filter change cycles (<50MB growth)
- Search cycles (<50MB growth)

### 5. Rendering Tests
- NaN position detection
- Edge coordinate validation
- Node position updates during simulation
- Label rendering for all nodes

### 6. Detail Panel Tests
- Open/close panel
- Switch between nodes
- Deselect by clicking background

---

## Bugs Found

See `BUGS_FOUND.md` for detailed bug reports.

**Summary:**
- **7 bugs** identified (1 high, 4 medium, 2 low severity)
- **3 critical bugs** confirmed by automated tests
- **6 test fixtures** created for edge case testing
- **24 automated tests** written (performance, edge cases, memory leaks)

**High Priority Bugs:**
1. Memory leak on rapid filter changes (50-100MB growth)
2. Zoom extent too restrictive for large graphs

**Medium Priority Bugs:**
3. NaN positions for orphan nodes (intermittent)
4. Rapid expand/collapse state desync
5. No error handling for malformed function_calls data

---

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Suite
```bash
npx playwright test tests/stress.spec.js
```

### Run Single Test
```bash
npx playwright test tests/stress.spec.js -g "should render 1000-node graph"
```

### Run in Headed Mode (Watch Browser)
```bash
npm run test:headed
```

### Run with UI (Interactive)
```bash
npm run test:ui
```

### Debug Failed Test
```bash
npx playwright test --debug
```

---

## Manual Testing

Use `manual-test-checklist.md` for manual verification of bugs.

**Key Manual Tests:**
1. Memory profiling (Chrome DevTools → Performance → Memory)
2. Visual inspection of node positions (DevTools → Elements)
3. Rapid interaction stress tests (clicking, zooming, panning)

---

## Memory Profiling

### Using Chrome DevTools
1. Open http://localhost:5173/#/code
2. Open DevTools (F12) → Performance tab
3. Click "Record" (circle icon)
4. Perform test actions (filter changes, expand/collapse)
5. Stop recording
6. Analyze memory timeline

### Using Playwright CDP
Tests automatically profile memory using Chrome DevTools Protocol (CDP):

```javascript
const client = await context.newCDPSession(page);
await client.send('Performance.enable');
let metrics = await client.send('Performance.getMetrics');
const heapSize = metrics.metrics.find(m => m.name === 'JSHeapUsedSize')?.value;
```

---

## CI/CD Integration

### GitHub Actions Example
```yaml
name: Stress Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run generate-fixtures
      - run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Test Configuration

`playwright.config.js`:
- Single worker (for memory profiling accuracy)
- Base URL: http://localhost:5173
- Auto-start dev server
- Trace on first retry
- Screenshot on failure

---

## Adding New Tests

### 1. Create Test File
```javascript
import { test, expect } from '@playwright/test';

test.describe('My Test Suite', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/#/code');
    // ... test logic
  });
});
```

### 2. Run Test
```bash
npx playwright test tests/my-test.spec.js
```

### 3. Debug Test
```bash
npx playwright test tests/my-test.spec.js --debug
```

---

## Fixture Loading (Future Enhancement)

To test with different data fixtures, add query param support to `CodeViz.jsx`:

```javascript
// In CodeViz.jsx
const params = new URLSearchParams(window.location.search);
const dataFile = params.get('data') || 'code-graph.json';

// Import dynamically
const CODE_GRAPH = await import(`../data/${dataFile}`);
```

Then load fixtures in tests:
```javascript
await page.goto('/#/code?data=stress/large-graph.json');
```

---

## Performance Benchmarks

**Default Graph (89 nodes, 165 edges):**
- Initial render: <3 seconds
- Force simulation: ~2 seconds to settle
- Memory footprint: ~80MB

**Large Graph (1000 nodes, 5000 edges):**
- Initial render: <5 seconds (target)
- Force simulation: ~5 seconds to settle
- Memory footprint: <200MB (target)

**Memory Leak Thresholds:**
- 50 expand/collapse cycles: <100MB growth
- 20 filter changes: <50MB growth
- 30 search cycles: <50MB growth

---

## Known Issues

### Test Limitations
1. **Fixture Loading:** Tests cannot currently load custom fixtures (requires CodeViz.jsx modification)
2. **Memory Profiling:** Only available in Chromium (CDP API)
3. **Simulation Timing:** Force simulation is non-deterministic, may cause flaky tests

### Workarounds
- Use `waitForTimeout()` for simulation-dependent tests
- Increase timeouts for large graph tests
- Mock data in tests if fixture loading unavailable

---

## Contributing

### Adding New Fixtures
1. Edit `tests/generate-fixtures.js`
2. Add fixture generation logic
3. Run `npm run generate-fixtures`
4. Document in this README

### Reporting Bugs
1. Create issue with steps to reproduce
2. Add test case to `stress.spec.js`
3. Update `BUGS_FOUND.md` with details

### Fixing Bugs
1. Create failing test case
2. Fix bug in `src/pages/CodeViz.jsx`
3. Verify test passes
4. Update `BUGS_FOUND.md` with fix details

---

## Resources

- [Playwright Documentation](https://playwright.dev/)
- [D3.js Force Simulation](https://d3js.org/d3-force)
- [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/)
- [React Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

---

## License

MIT
