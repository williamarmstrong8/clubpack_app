import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '@/components/ui/ScreenWrapper';
import { Text } from '@/components/ui/Text';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { COLORS, SPACING } from '@/constants/theme';
import { USER } from '@/data/mockData';
import { Image } from 'expo-image';
import { Camera, X } from 'lucide-react-native';

export default function EditProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState(USER.name);
  const [username, setUsername] = useState(USER.username);
  const [bio, setBio] = useState(USER.bio);
  const [location, setLocation] = useState(USER.location);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.back();
    }, 1000);
  };

  return (
    <ScreenWrapper style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/profile');
            }
          }} 
          style={styles.closeButton}
        >
          <X size={24} color={COLORS.light.text} />
        </TouchableOpacity>
        <Text variant="h3">Edit Profile</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
           <View>
              <Image source={{ uri: USER.avatarUrl }} style={styles.avatar} />
              <TouchableOpacity style={styles.changeAvatarBtn}>
                 <Camera size={20} color="#FFF" />
              </TouchableOpacity>
           </View>
        </View>

        <View style={styles.form}>
           <Input 
              label="Name" 
              value={name} 
              onChangeText={setName} 
           />
           <Input 
              label="Username" 
              value={username} 
              onChangeText={setUsername} 
           />
           <Input 
              label="Bio" 
              value={bio} 
              onChangeText={setBio} 
              multiline
              numberOfLines={3}
              style={{ height: 80, paddingVertical: 12 }}
           />
           <Input 
              label="Location" 
              value={location} 
              onChangeText={setLocation} 
           />
        </View>
      </ScrollView>

      <View style={styles.footer}>
         <Button 
            label="Save Changes" 
            onPress={handleSave} 
            isLoading={isLoading}
         />
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.light.border,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  content: {
    padding: SPACING.l,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  changeAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.primary,
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: COLORS.light.background,
  },
  form: {
    gap: SPACING.s,
  },
  footer: {
    padding: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.light.border,
  },
});
