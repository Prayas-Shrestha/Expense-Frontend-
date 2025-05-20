// screens/my-info.tsx
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import * as ImagePicker from 'expo-image-picker';

export default function MyInfoScreen() {
    const router = useRouter();
    const [info, setInfo] = useState({
        documentName: "",
        documentNumber: "",
        dob: "",
        address: "",
        age: "",
        gender: "",
        photo: null as string | null,
    });

    useEffect(() => {
        (async () => {
            const saved = await AsyncStorage.getItem("myInfo");
            if (saved) setInfo(JSON.parse(saved));
        })();
    }, []);

    const pickImage = async () => {
        // Request permission
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        // Launch image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setInfo({ ...info, photo: result.assets[0].uri });
        }
    };

    const saveInfo = async () => {
        await AsyncStorage.setItem("myInfo", JSON.stringify(info));
        router.back();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.back} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.header}>My Information</Text>

            {/* Photo Upload Section */}
            <View style={styles.photoSection}>
                <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
                    {info.photo ? (
                        <Image source={{ uri: info.photo }} style={styles.photo} />
                    ) : (
                        <View style={styles.photoPlaceholder}>
                            <Ionicons name="camera" size={40} color="#666" />
                            <Text style={styles.photoText}>Add Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

            {(Object.keys(info).filter(key => key !== 'photo') as (keyof typeof info)[]).map((key) => (
                <View key={key} style={styles.fieldBox}>
                    <Text style={styles.label}>{key.replace(/([A-Z])/g, " $1")}:</Text>
                    <TextInput
                        style={styles.input}
                        value={info[key] ?? ""}
                        onChangeText={(text) => setInfo({ ...info, [key]: text })}
                        placeholder={`Enter ${key}`}
                    />
                </View>
            ))}

            <TouchableOpacity style={styles.saveButton} onPress={saveInfo}>
                <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, paddingTop: 50, backgroundColor: "#fff", flexGrow: 1 },
    back: { position: "absolute", top: 50, left: 20 },
    header: { fontSize: 22, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    photoSection: {
        alignItems: 'center',
        marginBottom: 20,
    },
    photoButton: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    photo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    photoPlaceholder: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    photoText: {
        marginTop: 5,
        color: '#666',
        fontSize: 12,
    },
    fieldBox: { marginBottom: 15 },
    label: { fontSize: 14, fontWeight: "600", marginBottom: 5 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 14,
    },
    saveButton: {
        backgroundColor: "#6CC551",
        marginTop: 20,
        padding: 14,
        alignItems: "center",
        borderRadius: 8,
    },
    saveText: { color: "white", fontSize: 16, fontWeight: "bold" },
});
