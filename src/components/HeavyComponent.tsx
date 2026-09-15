import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeModules, ActivityIndicator } from 'react-native';

const { HeavyMathModule } = NativeModules;

interface Post {
  id: number;
  userId: number;
  title: string;
  body: string;
}

const HeavyComponent = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);

  useEffect(() => {
    // Call the Native Module when the component mounts.
    // The native background thread will do the math, and resolve the promise.
    HeavyMathModule.generateData()
      .then((data: Post[]) => setPosts(data))
      .catch((err: any) => console.error("Native Module Error:", err));
  }, []);

  if (!posts) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Native Thread computing 1000 items...</Text>
      </View>
    );
  }

  const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📡 API Posts</Text>
        <Text style={styles.headerSub}>
          {posts.length} posts fetched from JSONPlaceholder
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✅ Loaded via Suspense + fetch()</Text>
        </View>
      </View>

      {posts.map((post) => (
        <View
          key={post.id}
          style={[
            styles.card,
            { borderLeftColor: colors[post.id % colors.length] },
          ]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.idBadge, { backgroundColor: colors[post.id % colors.length] + '22' }]}>
              <Text style={[styles.idText, { color: colors[post.id % colors.length] }]}>
                #{post.id}
              </Text>
            </View>
            <Text style={styles.userTag}>User {post.userId}</Text>
          </View>
          <Text style={styles.postTitle} numberOfLines={2}>
            {post.title}
          </Text>
          <Text style={styles.postBody} numberOfLines={3}>
            {post.body}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default HeavyComponent;

const styles = StyleSheet.create({
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  scroll: {
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
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#86efac',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#16a34a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  idBadge: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
  },
  userTag: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  postTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  postBody: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 18,
  },
});
