import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

export default function Loader() {



    return (
        <View style={styles.container}>

            <View style={styles.loadingContainer}>
                <Animatable.Text
                    animation="bounceIn"
                    iterationCount="infinite"
                    style={styles.loadingText}
                >
                    Loading...
                </Animatable.Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {

        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: "absolute",
        top: 260
    },
    loadingContainer: {
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
