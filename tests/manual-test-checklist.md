# Manual Test Checklist for Code Visualization

## Pre-Test Setup
- [ ] Start dev server: `npm run dev`
- [ ] Open Chrome DevTools (F12)
- [ ] Navigate to Performance tab for memory monitoring
- [ ] Open Console tab to watch for errors

---

## Test 1: Memory Leak on Rapid Filter Changes (Bug #1)

**Goal:** Confirm memory grows when rapidly changing filters

**Steps:**
1. Open http://localhost:5173/#/code
2. Open Chrome DevTools → Performance → Memory
3. Take heap snapshot (Snapshot 1)
4. Rapidly click filters: all → service → ui → test → infra → unknown
5. Repeat 20 times (click as fast as possible)
6. Wait 2 seconds
7. Take heap snapshot (Snapshot 2)
8. Compare heap sizes

**Expected:** Memory growth >50MB = BUG CONFIRMED
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 2: NaN Positions for Orphan Nodes (Bug #2)

**Goal:** Check if orphan nodes render correctly

**Steps:**
1. Load default graph (or orphan-nodes.json if fixture loading works)
2. Open DevTools → Elements
3. Inspect SVG → Find `<circle>` elements
4. Check `cx` and `cy` attributes
5. Look for `cx="NaN"` or `cy="NaN"`

**Expected:** All nodes have valid numeric positions
**Status:** ⬜ PASS ⬜ FAIL

**Notes:**
- This bug is intermittent
- May need to reload page multiple times
- More likely with large graphs or rapid filter changes

---

## Test 3: Expand State Lost on Filter Change (Bug #3)

**Goal:** Verify expanded state is cleared on filter change

**Steps:**
1. Open http://localhost:5173/#/code
2. Click a node with functions (look for blue badge with number)
3. Double-click to expand (should see "Expanded mode" text)
4. Note which node is expanded
5. Change filter (e.g., all → service)
6. Check if expanded state persists

**Expected:** Expanded state is cleared (current behavior)
**Status:** ⬜ WORKING AS DESIGNED ⬜ UX ISSUE

---

## Test 4: Function Call Graph Display (Bug #4)

**Goal:** Verify cross-file function calls are displayed

**Steps:**
1. Open http://localhost:5173/#/code
2. Click a node with functions
3. Click a function that has calls
4. Check "CALL GRAPH" section
5. Look for cross-file calls (should show `otherFile.functionName`)

**Expected:** Cross-file calls appear with file prefix
**Status:** ⬜ PASS ⬜ FAIL

**Notes:**
- Need to find a function that calls across files
- May need to inspect code-graph.json to find example

---

## Test 5: Malformed Data Error Handling (Bug #5)

**Goal:** Check if app handles missing function_call fields

**Steps:**
1. Modify CodeViz.jsx to load malformed.json (if fixture loading works)
2. OR: Manually edit code-graph.json to add malformed function_calls
3. Reload page
4. Check console for errors
5. Click nodes and functions

**Expected:** No crashes, graceful handling
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 6: Rapid Expand/Collapse State Desync (Bug #6)

**Goal:** Cause state desync by rapid double-clicking

**Steps:**
1. Open http://localhost:5173/#/code
2. Click a node with functions (select it)
3. Rapidly double-click the node 10+ times in 1 second
4. Check detail panel:
   - Does it say "Expanded mode"?
   - Does it show functions only, or all metrics?
5. Look for mismatch

**Expected:** State may desync (expanded text but normal metrics shown)
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 7: Zoom Extent Too Restrictive (Bug #7)

**Goal:** Verify zoom limit is too restrictive for large graphs

**Steps:**
1. Open http://localhost:5173/#/code
2. Use mouse wheel to zoom out as far as possible
3. Check if entire graph is visible
4. Count visible nodes vs total nodes (header shows total)

**Expected:** Cannot zoom out enough to see full graph (if >100 nodes)
**Status:** ⬜ PASS ⬜ FAIL

**Notes:**
- Default graph has 89 nodes, may be visible at 0.2x zoom
- Would be more obvious with 500+ node graph

---

## Test 8: Performance - Large Graph Render Time

**Goal:** Measure render time for default graph

**Steps:**
1. Open Chrome DevTools → Performance tab
2. Click Record
3. Navigate to http://localhost:5173/#/code
4. Wait for graph to render (simulation settles)
5. Stop recording
6. Check timeline for render duration

**Expected:** <3 seconds for 89 nodes, <5 seconds for 1000 nodes
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 9: Rapid Zoom In/Out

**Goal:** Ensure zoom doesn't crash or cause visual glitches

**Steps:**
1. Open http://localhost:5173/#/code
2. Position mouse over graph
3. Rapidly scroll mouse wheel up and down
4. Do this for 10 seconds
5. Check for:
   - Console errors
   - Visual glitches (nodes disappearing, edges detached)
   - Browser responsiveness

**Expected:** No crashes, smooth zoom
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 10: Rapid Pan

**Goal:** Ensure panning doesn't cause issues

**Steps:**
1. Open http://localhost:5173/#/code
2. Click and drag graph rapidly
3. Pan in all directions
4. Do this for 10 seconds
5. Check for:
   - Console errors
   - Visual glitches
   - Browser responsiveness

**Expected:** No crashes, smooth pan
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 11: Search While Dragging

**Goal:** Test concurrent interactions

**Steps:**
1. Open http://localhost:5173/#/code
2. Click and hold a node (start dragging)
3. While holding, type in search box
4. Release drag
5. Check for crashes or errors

**Expected:** No crashes, both interactions work
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 12: Empty Search Results

**Goal:** Ensure empty filter results don't crash

**Steps:**
1. Open http://localhost:5173/#/code
2. Type nonsense in search: "zzzzzzzzzzz"
3. Check graph area
4. Check console for errors

**Expected:** Empty graph, no errors
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 13: Click During Force Simulation

**Goal:** Test clicking before graph settles

**Steps:**
1. Refresh page
2. IMMEDIATELY click a node (within 1 second)
3. Check if detail panel opens
4. Check for errors

**Expected:** Detail panel opens correctly
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 14: Double-Click Spam

**Goal:** Stress-test double-click handler

**Steps:**
1. Open http://localhost:5173/#/code
2. Find a node with functions
3. Double-click it 10 times rapidly (as fast as possible)
4. Check for:
   - Console errors
   - Panel state (expanded/collapsed)
   - Browser responsiveness

**Expected:** May cause state desync (Bug #6)
**Status:** ⬜ PASS ⬜ FAIL

---

## Test 15: Function Expansion with Many Functions

**Goal:** Test performance with dense function lists

**Steps:**
1. Find a node with many functions (>10)
2. Double-click to expand
3. Check if panel scrolls smoothly
4. Click through functions
5. Check for lag or errors

**Expected:** Smooth rendering even with many functions
**Status:** ⬜ PASS ⬜ FAIL

---

## Summary

**Tests Passed:** _____ / 15
**Bugs Confirmed:** _____
**New Bugs Found:** _____

**Critical Issues:**
-
-

**Notes:**
-
-
