import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar,
} from 'react-native';

import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { authService } from '../../src/services/auth';
import type { LoginCredentials } from '../../src/types';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing Info', 'Enter email and password');
      return;
    }

    setLoading(true);
    try {
      const credentials: LoginCredentials = { email, password };
      console.log('Attempting login...');
      const result = await authService.login(credentials);
      console.log('Login successful, navigating to dashboard...');
      router.replace('/(ptw)' as any);
    } catch (e: any) {
      console.error('Login failed:', e);
      Alert.alert('Login Failed', e?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND */}
      <LinearGradient
        colors={['#050816', '#0B1220', '#070A12']}
        style={StyleSheet.absoluteFillObject}
      />

      {/* GLOWS */}
      <View style={styles.glowA} />
      <View style={styles.glowB} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* HERO */}
          <View style={styles.hero}>
            <LinearGradient
              colors={['#7C3AED', '#06B6D4']}
              style={styles.logoRing}
            >
              <Ionicons name="flash" size={34} color="#fff" />
            </LinearGradient>

            <Text style={styles.title}>InfyEnergy</Text>
            <Text style={styles.subtitle}>
              Wind Intelligence Control System
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.welcome}>Welcome back</Text>
            <Text style={styles.subtext}>Sign in to continue</Text>

            {/* EMAIL */}
            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={18} color="#8b5cf6" />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email"
                placeholderTextColor="#64748b"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="off"
                keyboardType="email-address"
                spellCheck={false}
                style={styles.input}
                textColor="#fff"
                underlineColor="transparent"
              />
            </View>

            {/* PASSWORD */}
            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={18} color="#8b5cf6" />

              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                placeholderTextColor="#64748b"
                secureTextEntry={!showPassword}
                autoCorrect={false}
                autoComplete="off"
                spellCheck={false}
                style={styles.input}
                textColor="#fff"
                underlineColor="transparent"
              />

              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={18}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>

            {/* FORGOT */}
            <TouchableOpacity style={styles.forgot}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {/* BUTTON */}
            <TouchableOpacity onPress={handleLogin} disabled={loading}>
              <LinearGradient
                colors={['#7C3AED', '#4F46E5']}
                style={styles.button}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Sign In</Text>
                    <Ionicons name="arrow-forward" size={18} color="#fff" />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* TRUST */}
            <View style={styles.trust}>
              <Ionicons name="shield-checkmark" size={14} color="#06B6D4" />
              <Text style={styles.trustText}>Secure encrypted login</Text>
            </View>
          </View>

          {/* FOOTER (FIXED — no weird extra spacing issue) */}
          <Text style={styles.footer}>
            Contact administrator for access
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050816',
  },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 40,
  },

  glowA: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 300,
    backgroundColor: 'rgba(124,58,237,0.12)',
    top: -80,
    right: -60,
  },

  glowB: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 300,
    backgroundColor: 'rgba(6,182,212,0.10)',
    bottom: -80,
    left: -60,
  },

  hero: {
    alignItems: 'center',
    marginBottom: 26,
  },

  logoRing: {
    width: 92,
    height: 92,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 14,
  },

  subtitle: {
    color: '#94a3b8',
    fontSize: 13,
    marginTop: 6,
  },

  card: {
    backgroundColor: 'rgba(15,23,42,0.75)',
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  welcome: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  subtext: {
    color: '#94a3b8',
    marginBottom: 16,
    marginTop: 4,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0B1220',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 54,
    marginTop: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
  },

  input: {
    flex: 1,
    backgroundColor: 'transparent',
    fontSize: 14,
  },

  forgot: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },

  forgotText: {
    color: '#8b5cf6',
    fontSize: 12,
    fontWeight: '600',
  },

  button: {
    height: 56,
    borderRadius: 16,
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  trust: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
    gap: 6,
  },

  trustText: {
    color: '#64748b',
    fontSize: 11,
  },

  footer: {
    textAlign: 'center',
    color: '#475569',
    marginTop: 18,
    fontSize: 12,
  },
});