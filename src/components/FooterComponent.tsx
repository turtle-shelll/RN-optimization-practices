import { StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';

const FooterComponent = () => {
    const [timeElapsed, setTimeElapsed] = useState(0);

    // useEffect(() => {
    //     const start = Date.now();
    //     // Update the timer rapidly (every 10ms)
    //     const interval = setInterval(() => {
    //         setTimeElapsed(Date.now() - start);
    //     }, 100);

    //     return () => clearInterval(interval);
    // }, []);

    return (
        <View style={styles.footer}>
            <Text style={styles.title}>Live JS Thread Timer</Text>
            <Text style={styles.timer}>{timeElapsed} ms</Text>
            <Text style={styles.subtitle}>
                If this timer freezes or jumps wildly, the JS thread is blocked.
                If it ticks smoothly, the JS thread is free!
            </Text>
        </View>
    );
};

export default FooterComponent;

const styles = StyleSheet.create({
    footer: {
        padding: 24,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        borderTopWidth: 2,
        borderColor: '#1e293b'
    },
    title: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    timer: {
        color: '#10b981', // Emerald green
        fontSize: 40,
        fontWeight: '900',
        fontVariant: ['tabular-nums'], // keeps numbers fixed width so it doesn't jiggle
        marginVertical: 8
    },
    subtitle: {
        color: '#64748b',
        fontSize: 11,
        textAlign: 'center',
        paddingHorizontal: 20
    }
});