import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import CategoryCard from '../components/adhkar/CategoryCard';
import InvocationList from '@/components/adhkar/InvocationList';
import { fetchAdhkar } from '../utils/api';



// Temporary mock data - Replace with actual API call later

const mockData = [
    {
        category: "أذكار الصباح والمساء",
        source: "/audio/ar_7esn_AlMoslem_by_Doors_028.mp3",
        invocations: [
            {
                texte: "((أَسْتَغْفِرُ اللَّهَ وَأَتُوبُ إِلَيْهِ)) (مِائَةَ مَرَّةٍ فِي الْيَوْمِ).",
                id: 22,
                audio: "/audio/96.mp3"
            }
            // ... more invocations
        ]
    }
    // ... more categories
];

export default function AdhkarScreen() {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const backgroundColor = useThemeColor({}, 'background');
    const [loading, setLoading] = useState(true);
    const [adhkar, setAdhkar] = useState<any[]>([]); // Adjust type as needed
    const tintColor = useThemeColor({}, 'tint');

    useEffect(() => {
        // setLoading(true); // Set loading true when fetching starts
        fetchAdhkar().then(data => {
            // Ensure data and data.verses exist before setting state
            if (data) {
                // fromated data
              const formatedData: any[] = [];
                data.forEach((item: any) => {
                    // Cherche si la catégorie + source existe déjà dans formatedData
                    let group = formatedData.find(g => g.category === item.category && g.source === item.source);

                    if (!group) {
                        // Si pas trouvé, on crée un nouveau groupe
                        group = {
                            category: item.category,
                            source: item.source,
                            invocations: []
                        };
                        formatedData.push(group);
                    }

                    // Ajoute l'invocation dans le bon groupe
                    group.invocations.push({
                        texte: item.texte,
                        id: item.id,
                        audio: item.audio
                    });
                });

           
                setLoading(true); // Set loading true when fetching starts
                setAdhkar(formatedData);
                setLoading(false); // Set loading false when data is fetched
            }
        }).catch(error => {
            console.error("Failed to fetch surah:", error);
            setAdhkar([]); // Clear verses on error
            setLoading(false); // Also set loading false on error
        });
    }, []);

    const selectedCategoryData = adhkar.find(cat => cat.category === selectedCategory);

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={tintColor} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {!selectedCategory ? (
                <FlatList
                    data={adhkar}
                    keyExtractor={item => item.category}
                    renderItem={({ item }) => (
                        <CategoryCard
                            category={item.category}
                            audioSource={item.source}
                            onPress={() => setSelectedCategory(item.category)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            ) : (
                <InvocationList
                    category={selectedCategoryData?.category || ''}
                    invocations={selectedCategoryData?.invocations || []}
                    categoryAudio={selectedCategoryData?.source || ''}
                    onBack={() => setSelectedCategory(null)}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: 16,
    },
});
