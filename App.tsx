import React, { Suspense, useState, useEffect, Profiler } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// ⚠️ IMPORTANT: Notice we do NOT statically import HeavyComponent at the top!
// Statically importing it would evaluate it at startup and cancel the lazy benefit.

const getTime = (): number => {
  // @ts-ignore
  if (typeof globalThis.performance?.now === 'function') {
    // @ts-ignore
    return globalThis.performance.now();
  }
  return Date.now();
};

const APP_INIT_TIME = getTime();

// 💤 Lazy-loaded component via dynamic import
const LazyHeavyComponent = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>((resolve) => {
      // Small simulated delay to clearly illustrate the Suspense boundary
      setTimeout(() => {
        resolve(import('./components/HeavyComponent'));
      }, 500);
    })
);

// Synchronous version loaded on-demand using standard require
let CachedSyncComponent: React.ComponentType<any> | null = null;
const getSyncComponent = () => {
  if (!CachedSyncComponent) {
    CachedSyncComponent = require('./components/HeavyComponent').default;
  }
  return CachedSyncComponent;
};

// 🔄 Fallback component shown while loading
const LoadingFallback = () => (
  <View style={styles.fallbackContainer}>
    <ActivityIndicator size="small" color="#2563eb" />
    <Text style={styles.fallbackText}>Suspense Active: Showing instant fallback UI...</Text>
  </View>
);

function MainScreen() {
  const [testMode, setTestMode] = useState<'idle' | 'sync' | 'lazy'>('idle');
  const [initialAppBoot, setInitialAppBoot] = useState<number | null>(null);

  // Profiler metrics
  const [renderMetrics, setRenderMetrics] = useState<{
    mode: string;
    actualDuration: number;
    baseDuration: number;
    firstPaintDelay: number;
  } | null>(null);

  const [mountStartTime, setMountStartTime] = useState<number>(0);

  // Measure initial App Shell Mount
  useEffect(() => {
    const bootTime = getTime() - APP_INIT_TIME;
    setInitialAppBoot(bootTime);
    console.log(`[Shell Boot] App shell mounted in: ${bootTime.toFixed(2)}ms`);
  }, []);

  const handleRunSync = () => {
    setRenderMetrics(null);
    const start = getTime();
    setMountStartTime(start);
    setTestMode('sync');
  };

  const handleRunLazy = () => {
    setRenderMetrics(null);
    const start = getTime();
    setMountStartTime(start);
    setTestMode('lazy');
  };

  const handleReset = () => {
    setTestMode('idle');
    setRenderMetrics(null);
  };

  const handleProfilerRender: React.ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration
  ) => {
    const totalLatency = getTime() - mountStartTime;
    setTimeout(() => {
      setRenderMetrics({
        mode: id,
        actualDuration,
        baseDuration,
        firstPaintDelay: totalLatency,
      });
    }, 0);
  };

  const SyncComponent = testMode === 'sync' ? getSyncComponent() : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sync vs. Lazy Benchmark</Text>
          <Text style={styles.headerSubtitle}>
            Understand how Lazy + Suspense prevents thread blocking
          </Text>
        </View>

        {/* Base App Shell Boot Time */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📱 App Shell Startup</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>Time to First Screen (Shell):</Text>
            <Text style={styles.metricHighlight}>
              {initialAppBoot !== null ? `${initialAppBoot.toFixed(2)} ms` : 'Measuring...'}
            </Text>
          </View>
        </View>

        {/* Benchmark Selector */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>🔬 Run Performance Test</Text>
          <Text style={styles.cardDescription}>
            Compare mounting 800 heavy computational nodes synchronously vs through Suspense + Lazy:
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.syncButton, testMode === 'sync' && styles.buttonActive]}
              onPress={handleRunSync}
            >
              <Text style={styles.buttonText}>1. Without Lazy (Sync)</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.lazyButton, testMode === 'lazy' && styles.buttonActive]}
              onPress={handleRunLazy}
            >
              <Text style={styles.buttonText}>2. With Lazy + Suspense</Text>
            </TouchableOpacity>
          </View>

          {testMode !== 'idle' && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>Reset / Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Live Profiler Results */}
        {renderMetrics && (
          <View style={[styles.card, styles.resultsCard]}>
            <Text style={styles.resultsTitle}>
              📊 Results for: {renderMetrics.mode === 'SyncProfiler' ? 'Without Lazy (Sync)' : 'With Lazy + Suspense'}
            </Text>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Render Cost (actualDuration):</Text>
              <Text style={styles.metricValue}>{renderMetrics.actualDuration.toFixed(2)} ms</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Subtree Complexity (baseDuration):</Text>
              <Text style={styles.metricValue}>{renderMetrics.baseDuration.toFixed(2)} ms</Text>
            </View>

            <View style={styles.metricRow}>
              <Text style={styles.metricLabel}>Total Mount Latency:</Text>
              <Text style={styles.metricValue}>{renderMetrics.firstPaintDelay.toFixed(2)} ms</Text>
            </View>

            <View style={styles.explanationBox}>
              {renderMetrics.mode === 'SyncProfiler' ? (
                <Text style={styles.explanationText}>
                  ⚠️ <Text style={styles.boldText}>Without Lazy:</Text> The JavaScript engine had to
                  build all 800 nodes in one synchronous blocking pass before updating the screen.
                </Text>
              ) : (
                <Text style={styles.explanationText}>
                  ✅ <Text style={styles.boldText}>With Lazy + Suspense:</Text> The UI showed the
                  fallback spinner immediately, keeping the JS thread unblocked while preparing the heavy module.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Component Display Area */}
        {testMode === 'sync' && SyncComponent && (
          <Profiler id="SyncProfiler" onRender={handleProfilerRender}>
            <SyncComponent />
          </Profiler>
        )}

        {testMode === 'lazy' && (
          <Profiler id="LazyProfiler" onRender={handleProfilerRender}>
            <Suspense fallback={<LoadingFallback />}>
              <LazyHeavyComponent />
            </Suspense>
          </Profiler>
        )}

        {/* Key Lessons / Insights */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>🧠 Why you didn't see a difference before:</Text>

          <Text style={styles.infoBullet}>
            1️⃣ <Text style={styles.boldText}>Static Import Trap:</Text> If you write{' '}
            <Text style={styles.codeText}>import HeavyComponent from '...'</Text> at the top of the file,
            JavaScript bundles and evaluates it at launch, which cancels out any benefit of{' '}
            <Text style={styles.codeText}>React.lazy()</Text>.
          </Text>

          <Text style={styles.infoBullet}>
            2️⃣ <Text style={styles.boldText}>Initial Render vs Deferred:</Text> In React Native, all JS
            is local inside the APK. If you render a lazy component on frame 1, it starts loading on frame 1 anyway.
            The real power of <Text style={styles.codeText}>lazy</Text> is for{' '}
            <Text style={styles.boldText}>tabs, modals, and secondary screens</Text> so they don't slow down the initial app launch.
          </Text>

          <Text style={styles.infoBullet}>
            3️⃣ <Text style={styles.boldText}>User-Perceived Speed (TTFP):</Text> Suspense lets you show
            instant UI skeletons so the app feels fast, rather than staring at a frozen blank screen.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainScreen />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 6,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 12,
    lineHeight: 18,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  metricLabel: {
    fontSize: 13,
    color: '#475569',
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  metricHighlight: {
    fontSize: 14,
    fontWeight: '700',
    color: '#16a34a',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncButton: {
    backgroundColor: '#dc2626',
  },
  lazyButton: {
    backgroundColor: '#2563eb',
  },
  buttonActive: {
    borderWidth: 2,
    borderColor: '#000000',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  resetButton: {
    marginTop: 6,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
  },
  resetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  fallbackContainer: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#eff6ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  fallbackText: {
    marginTop: 6,
    fontSize: 12,
    color: '#1d4ed8',
    fontWeight: '600',
  },
  resultsCard: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
  },
  resultsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#166534',
    marginBottom: 8,
  },
  explanationBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 6,
  },
  explanationText: {
    fontSize: 12,
    color: '#334155',
    lineHeight: 18,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    marginTop: 6,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 8,
  },
  infoBullet: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: '700',
    color: '#0f172a',
  },
  codeText: {
    fontFamily: 'monospace',
    color: '#b91c1c',
    backgroundColor: '#fee2e2',
  },
});
