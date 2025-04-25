import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import Slider from '@react-native-community/slider';
import DropDownPicker from 'react-native-dropdown-picker';



interface SettingsMenuProps {
    visible: boolean;
    onClose: () => void;
    settings: {
        fontSize: number;
        showTranslation: boolean;
        showTafsir: boolean;
        currentSurah: number;
    };
    onSettingChange: (setting: string, value: any) => void;
}

export default function SettingsMenu({ visible, onClose, settings, onSettingChange }: SettingsMenuProps) {
    const backgroundColor = useThemeColor({}, 'cardBackground');
    const textColor = useThemeColor({}, 'text');
    const tintColor = useThemeColor({}, 'tint');
    const borderColor = useThemeColor({}, 'borderColor');
    const [open, setOpen] = useState(false);
    // Import list of Surahs from a local file "surahs.json" in assets/data
    const dataJson = require('../assets/data/surahs.json');



    const surahs = dataJson.map((item: any) => ({
        number: item.number,
        name: `${item.titleAr} (${item.count})`,
    }));
    const surahs2 = dataJson.map((item: any) => ({
        number: item.number,
        value: item.number,
        label: `${item.titleAr} (${item.count})`,
    }));
    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[styles.modalContent, { backgroundColor }]}>
                    <Text style={[styles.title, { color: textColor }]}>إعدادات</Text>

                    <View style={styles.section}>
                      
                        <Text style={[styles.sectionTitle, { color: textColor }]}>اختر السورة</Text>
                        <View >
          
                            <DropDownPicker
                                open={open}
                                value={settings.currentSurah}
                                items={surahs2}
                                setOpen={setOpen}
                                setValue={(callback) => {
                                    const val = typeof callback === 'function' ? callback(settings.currentSurah) : callback;
                                    onSettingChange('currentSurah', val);
                                }}
                                setItems={() => {}}
                                searchable={true}
                                searchPlaceholder="ابحث عن السورة..."
                                placeholder="اختر السورة"
                                style={{
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                    margin: 0,
                                }}
                                textStyle={{
                                    color: textColor,
                                }}
                                dropDownContainerStyle={{
                                    borderColor: borderColor,
                                    backgroundColor: backgroundColor,
                                    minHeight: 250,
                                }}
                                listItemLabelStyle={{
                                    color: textColor,
                                }}
                                searchTextInputStyle={{
                                    color: textColor,
                                    backgroundColor: backgroundColor,
                                    borderColor: borderColor,
                                }}
                                
                                zIndex={1000}
                            />
                           
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={[styles.sectionTitle, { color: textColor }]}>حجم الخط</Text>
                        <Slider
                            style={styles.slider}
                            minimumValue={16}
                            maximumValue={32}
                            step={1}
                            value={settings.fontSize}
                            onValueChange={(value) => onSettingChange('fontSize', value)}
                            minimumTrackTintColor={tintColor}
                            maximumTrackTintColor={borderColor}
                        />
                        <Text style={[styles.fontSize, { color: textColor }]}>{Math.round(settings.fontSize)}</Text>
                    </View>

                    <View style={styles.section}>
                        <View style={styles.switchRow}>
                            <Text style={[styles.switchLabel, { color: textColor }]}>إظهار الترجمة</Text>
                            <Switch
                                value={settings.showTranslation}
                                onValueChange={(value) => onSettingChange('showTranslation', value)}
                                trackColor={{ false: borderColor, true: tintColor }}
                            />
                        </View>

                        <View style={styles.switchRow}>
                            <Text style={[styles.switchLabel, { color: textColor }]}>إظهار التفسير</Text>
                            <Switch
                                value={settings.showTafsir}
                                onValueChange={(value) => onSettingChange('showTafsir', value)}
                                trackColor={{ false: borderColor, true: tintColor }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.closeButton, { backgroundColor: tintColor }]}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>تم</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '90%',
        borderRadius: 12,
        padding: 20,
        alignItems: 'stretch',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        marginBottom: 10,
    },
    pickerContainer: {
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 10,
    },
    picker: {
        height: 60,
    },
    slider: {
        width: '100%',
        height: 40,
    },
    fontSize: {
        textAlign: 'center',
        marginTop: 5,
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        fontSize: 16,
    },
    closeButton: {
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
