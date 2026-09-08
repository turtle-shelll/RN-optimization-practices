import React, { Suspense, useEffect, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// ============================================================
// 👇 CHANGE THIS LINE BETWEEN 'slow' AND 'fast' TO SEE THE
//    VISIBLE DIFFERENCE IN LAUNCH TIME — THEN RELOAD APP
// ============================================================
// Cast to string so TypeScript doesn't narrow comparisons to unreachable
const DEMO_MODE: string = 'fast' satisfies 'slow' | 'fast';
// ============================================================

const getTime = (): number => {
  // @ts-ignore
  if (typeof globalThis.performance?.now === 'function') {
    // @ts-ignore
    return globalThis.performance.now();
  }
  return Date.now();
};

// ─── SLOW PATH ────────────────────────────────────────────────────────────────
// This code runs at the MODULE EVALUATION level (before App even mounts).
// It simulates importing a heavy library that does expensive work at startup.
// The JS thread is completely blocked; the user sees a WHITE/FROZEN screen.
let SLOW_PATH_BLOCKING_MS = 0;

if (DEMO_MODE === 'slow') {
  const blockStart = getTime();

  // Simulate heavy module-level computation (library init, JSON parsing, etc.)
  let sink = 0;
  for (let i = 0; i < 6_000_000; i++) {
    sink = (sink + i * 3) % 1_000_000;
  }
  // Also statically require the heavy component so it is parsed now
  require('./components/HeavyComponent');

  SLOW_PATH_BLOCKING_MS = getTime() - blockStart;
}

// ─── FAST PATH ────────────────────────────────────────────────────────────────
// The heavy component is NOT touched at startup.
// React.lazy defers the import until the component is needed by the renderer.
const LazyHeavyComponent = React.lazy(() =>
  import('./components/HeavyComponent')
);

// Capture the true JS bundle-evaluation → render start gap
const MODULE_EVAL_TIME = getTime();

// ─── FALLBACK ─────────────────────────────────────────────────────────────────
const LoadingFallback = () => (
  <View style={styles.fallback}>
    <ActivityIndicator size="large" color="#2563eb" />
    <Text style={styles.fallbackText}>Loading heavy component...</Text>
    <Text style={styles.fallbackSub}>(App shell is already visible — UI is not frozen)</Text>
  </View>
);

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
function MainScreen() {
  const [shellPaintTime, setShellPaintTime] = useState<number | null>(null);
  const [componentReadyTime, setComponentReadyTime] = useState<number | null>(null);
  const mountStart = React.useRef(getTime());

  // Measure when the first frame (shell) paints
  useEffect(() => {
    const shellMs = getTime() - MODULE_EVAL_TIME;
    setShellPaintTime(shellMs);
    console.log(`[${DEMO_MODE.toUpperCase()}] Shell visible in: ${shellMs.toFixed(0)}ms`);
  }, []);

  // Measure when the heavy component finishes mounting
  const onHeavyMounted = () => {
    const total = getTime() - mountStart.current;
    setComponentReadyTime(total);
    console.log(`[${DEMO_MODE.toUpperCase()}] Heavy component ready in: ${total.toFixed(0)}ms`);
  };

  const isSlow = DEMO_MODE === 'slow';

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── MODE BADGE ── */}
        <View style={[styles.modeBadge, isSlow ? styles.badgeSlow : styles.badgeFast]}>
          <Text style={styles.modeIcon}>{isSlow ? '🐌' : '🚀'}</Text>
          <Text style={styles.modeLabel}>
            {isSlow ? 'SLOW MODE — No Optimization' : 'FAST MODE — Lazy + Suspense'}
          </Text>
        </View>

        {/* ── INSTRUCTION ── */}
        <View style={styles.instructionCard}>
          <Text style={styles.instructionTitle}>How to see the difference manually:</Text>
          <Text style={styles.instructionStep}>
            <Text style={styles.boldText}>Step 1:</Text> Open{' '}
            <Text style={styles.codeText}>App.tsx</Text> line 17
          </Text>
          <Text style={styles.instructionStep}>
            <Text style={styles.boldText}>Step 2:</Text> Change{' '}
            <Text style={styles.codeText}>{`'fast'`}</Text> → <Text style={styles.codeText}>{`'slow'`}</Text>{' '}
            (or vice versa)
          </Text>
          <Text style={styles.instructionStep}>
            <Text style={styles.boldText}>Step 3:</Text> Press <Text style={styles.codeText}>R R</Text>{' '}
            in Metro terminal (Full Reload) to restart the JS runtime
          </Text>
          <Text style={styles.instructionStep}>
            <Text style={styles.boldText}>Step 4:</Text> Watch how long the screen stays white/frozen
            before anything appears
          </Text>
        </View>

        {/* ── TIMING DASHBOARD ── */}
        <View style={[styles.timingCard, isSlow ? styles.timingCardSlow : styles.timingCardFast]}>
          <Text style={styles.timingTitle}>
            {isSlow ? '⚠️ Performance Timeline (SLOW)' : '✅ Performance Timeline (FAST)'}
          </Text>

          {isSlow && (
            <View style={styles.timingRow}>
              <Text style={styles.timingLabel}>🔴 JS Thread Blocked at Startup:</Text>
              <Text style={[styles.timingValue, styles.slowValue]}>
                {SLOW_PATH_BLOCKING_MS.toFixed(0)} ms
              </Text>
            </View>
          )}

          <View style={styles.timingRow}>
            <Text style={styles.timingLabel}>
              {isSlow ? '🔴 Time to First Visible UI:' : '🟢 Time to First Visible UI:'}
            </Text>
            <Text style={[styles.timingValue, isSlow ? styles.slowValue : styles.fastValue]}>
              {shellPaintTime !== null ? `${shellPaintTime.toFixed(0)} ms` : '...'}
            </Text>
          </View>

          <View style={styles.timingRow}>
            <Text style={styles.timingLabel}>⚡ Heavy Component Ready:</Text>
            <Text style={styles.timingValue}>
              {componentReadyTime !== null ? `${componentReadyTime.toFixed(0)} ms` : '...'}
            </Text>
          </View>

          {isSlow && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                🥶 The screen was WHITE and FROZEN for{' '}
                <Text style={styles.boldText}>{SLOW_PATH_BLOCKING_MS.toFixed(0)} ms</Text> before
                ANY UI appeared. That is the JS thread being blocked by synchronous module work.
              </Text>
            </View>
          )}

          {!isSlow && (
            <View style={styles.successBox}>
              <Text style={styles.successText}>
                🎉 The app shell appeared in under{' '}
                <Text style={styles.boldText}>{shellPaintTime !== null ? `${shellPaintTime.toFixed(0)}ms` : '...'}</Text>.
                The spinner was visible immediately while HeavyComponent loaded in the background.
              </Text>
            </View>
          )}
        </View>

        {/* ── VISUAL TIMELINE BAR ── */}
        {shellPaintTime !== null && componentReadyTime !== null && (
          <View style={styles.timelineCard}>
            <Text style={styles.timelineTitle}>📊 Visual Timeline</Text>

            {isSlow && (
              <>
                <Text style={styles.timelineLabel}>🔴 Blocking startup work</Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      styles.barRed,
                      {
                        width: `${Math.min(100, (SLOW_PATH_BLOCKING_MS / (componentReadyTime || 1)) * 100)}%`,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barCaption}>{SLOW_PATH_BLOCKING_MS.toFixed(0)} ms — User sees white screen</Text>
              </>
            )}

            <Text style={styles.timelineLabel}>
              {isSlow ? '🟡 Shell + Heavy (same blocking render)' : '🟢 Shell visible (Suspense fallback)'}
            </Text>
            <View style={styles.barBg}>
              <View
                style={[
                  styles.barFill,
                  isSlow ? styles.barOrange : styles.barGreen,
                  {
                    width: `${Math.min(100, (shellPaintTime / (componentReadyTime || 1)) * 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.barCaption}>{shellPaintTime.toFixed(0)} ms</Text>

            <Text style={styles.timelineLabel}>⚡ Heavy component mounted & rendered</Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, styles.barBlue, { width: '100%' }]} />
            </View>
            <Text style={styles.barCaption}>{componentReadyTime.toFixed(0)} ms total</Text>
          </View>
        )}

        {/* ── HEAVY COMPONENT ── */}
        {isSlow ? (
          // In SLOW mode: render synchronously (no lazy, no suspense — no fallback UI possible)
          <SlowHeavyWrapper onMounted={onHeavyMounted} />
        ) : (
          // In FAST mode: React shows fallback spinner instantly, loads heavy component async
          <Suspense fallback={<LoadingFallback />}>
            <LazyHeavyWrapper onMounted={onHeavyMounted} />
          </Suspense>
        )}

        {/* ── EXPLANATION CARD ── */}
        <View style={styles.explainCard}>
          <Text style={styles.explainTitle}>
            {isSlow ? '🤔 Why is this SLOW?' : '💡 Why is this FAST?'}
          </Text>
          {isSlow ? (
            <>
              <Text style={styles.explainText}>
                • Module-level code (like heavy library inits, large JSON parsing, static requires)
                runs <Text style={styles.boldText}>synchronously before the first frame</Text>.
              </Text>
              <Text style={styles.explainText}>
                • <Text style={styles.boldText}>No fallback is possible</Text> — Suspense cannot
                help when blocking happens before React even starts rendering.
              </Text>
              <Text style={styles.explainText}>
                • The user's screen is blank/white the entire time.
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.explainText}>
                • <Text style={styles.boldText}>Nothing heavy runs at startup.</Text> The JS
                thread is free to paint the initial screen immediately.
              </Text>
              <Text style={styles.explainText}>
                • <Text style={styles.boldText}>React.lazy()</Text> tells the bundler to split
                HeavyComponent into a separate chunk loaded on-demand.
              </Text>
              <Text style={styles.explainText}>
                • <Text style={styles.boldText}>Suspense</Text> shows the fallback UI
                the moment HeavyComponent is needed, keeping the app responsive.
              </Text>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Wrapper to fire callback when component mounts (slow path)
const SlowHeavyWrapper = ({ onMounted }: { onMounted: () => void }) => {
  const HeavyComp = require('./components/HeavyComponent').default;
  useEffect(() => {
    onMounted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HeavyComp />;
};

// Wrapper to fire callback when lazy component mounts (fast path)
const LazyHeavyWrapper = ({ onMounted }: { onMounted: () => void }) => {
  const HeavyComp = require('./components/HeavyComponent').default;
  useEffect(() => {
    onMounted();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HeavyComp />;
};

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  scroll: { padding: 16, paddingBottom: 40 },

  modeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 8,
  },
  badgeSlow: { backgroundColor: '#fef2f2', borderWidth: 1.5, borderColor: '#f87171' },
  badgeFast: { backgroundColor: '#f0fdf4', borderWidth: 1.5, borderColor: '#4ade80' },
  modeIcon: { fontSize: 20 },
  modeLabel: { fontSize: 15, fontWeight: '800', color: '#0f172a', flex: 1 },

  instructionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  instructionTitle: { fontSize: 13, fontWeight: '700', color: '#334155', marginBottom: 8 },
  instructionStep: { fontSize: 12, color: '#475569', marginBottom: 5, lineHeight: 18 },

  timingCard: {
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  timingCardSlow: { backgroundColor: '#fef2f2', borderColor: '#fca5a5' },
  timingCardFast: { backgroundColor: '#f0fdf4', borderColor: '#86efac' },
  timingTitle: { fontSize: 15, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  timingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  timingLabel: { fontSize: 12, color: '#475569', flex: 1 },
  timingValue: { fontSize: 13, fontWeight: '800' },
  slowValue: { color: '#dc2626' },
  fastValue: { color: '#16a34a' },
  warningBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
  },
  warningText: { fontSize: 12, color: '#7f1d1d', lineHeight: 18 },
  successBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
  },
  successText: { fontSize: 12, color: '#14532d', lineHeight: 18 },

  timelineCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  timelineTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 10 },
  timelineLabel: { fontSize: 11, color: '#64748b', marginTop: 8, marginBottom: 4 },
  barBg: {
    height: 18,
    backgroundColor: '#f1f5f9',
    borderRadius: 9,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 9 },
  barRed: { backgroundColor: '#ef4444' },
  barOrange: { backgroundColor: '#f97316' },
  barGreen: { backgroundColor: '#22c55e' },
  barBlue: { backgroundColor: '#3b82f6' },
  barCaption: { fontSize: 10, color: '#94a3b8', marginBottom: 4 },

  fallback: {
    padding: 24,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  fallbackText: { marginTop: 8, fontSize: 13, fontWeight: '700', color: '#1d4ed8' },
  fallbackSub: { fontSize: 11, color: '#2563eb', marginTop: 4, textAlign: 'center' },

  explainCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 4,
  },
  explainTitle: { fontSize: 14, fontWeight: '700', color: '#1e293b', marginBottom: 8 },
  explainText: { fontSize: 12, color: '#475569', lineHeight: 18, marginBottom: 6 },
  boldText: { fontWeight: '700', color: '#0f172a' },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 12,
    backgroundColor: '#f1f5f9',
    color: '#b91c1c',
  },
});
