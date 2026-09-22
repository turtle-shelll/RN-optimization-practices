import { Linking } from 'react-native';

const getLinkingConfig = (onIntercept) => ({
    // 1. Tell it what prefix to look for (matches the AndroidManifest)
    prefixes: [
        'myfirstapp://',
        'https://myfirstapp.loca.lt', // <--- Added for App Links & Universal Links
    ],

    // Custom Subscription to intercept links manually!
    subscribe(listener) {
        const onReceiveURL = ({ url }) => {
            // 1. Intercept the URL and pass it to our custom callback
            // We also pass the listener so the callback can execute the routing later
            if (onIntercept) {
                onIntercept(url, listener);
            } else {
                listener(url);
            }
        };

        // Listen to incoming links from the background
        const subscription = Linking.addEventListener('url', onReceiveURL);

        return () => {
            // Clean up the event listener
            subscription.remove();
        };
    },

    // 2. Map specific URL paths to your Route Names
    config: {
        screens: {
            Heavy: 'heavy',    // myfirstapp://heavy -> goes to Heavy Screen
            Tab2: 'second',    // myfirstapp://second -> goes to Tab2 Screen
            Tab3: 'third',     // myfirstapp://third -> goes to Tab3 Screen
            Tab4: 'fourth',    // myfirstapp://fourth -> goes to Tab4 Screen
            Tab5: 'fifth',     // myfirstapp://fifth -> goes to Tab5 Screen
        },
    },
});

export { getLinkingConfig };