import React, { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';

import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

import {
  Text,
  TextInput,
} from 'react-native-paper';

import { LinearGradient } from 'expo-linear-gradient';

import { Ionicons } from '@expo/vector-icons';

const ticketTypeData = [
  { label: 'Breakdown', value: 'Breakdown' },
  { label: 'Maintenance', value: 'Maintenance' },
  { label: 'Inspection', value: 'Inspection' },
  { label: 'General', value: 'General' },
];

const priorityData = [
  { label: 'Low', value: 'Low' },
  { label: 'Medium', value: 'Medium' },
  { label: 'High', value: 'High' },
  { label: 'Critical', value: 'Critical' },
];

export default function CreateTicketScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [ticketType, setTicketType] = useState('');
  const [priority, setPriority] = useState('');
  const [assignee, setAssignee] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    if (!title.trim()) {
      Alert.alert('Validation Error', 'Please enter ticket title');
      return;
    }

    if (!ticketType) {
      Alert.alert('Validation Error', 'Please select ticket type');
      return;
    }

    if (!priority) {
      Alert.alert('Validation Error', 'Please select priority');
      return;
    }

    Alert.alert('Success', 'Ticket Created Successfully');
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#064e3b', '#065f46']} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <View style={[styles.headerIcon, { backgroundColor: '#10b981' }]}>
              <Ionicons name="construct" size={20} color="#fff" />
            </View>
            <View>
              <Text variant='titleMedium' style={styles.headerTitle}>Create Ticket</Text>
              <Text variant='labelSmall' style={styles.headerSubtitle}>Wind Turbine Maintenance System</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >

        {/* TICKET TYPE */}

        <View style={styles.card}>
          <Text style={styles.label}>Ticket Type</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemTextStyle}
            activeColor="rgba(16,185,129,0.15)"
            data={ticketTypeData}
            labelField="label"
            valueField="value"
            placeholder="Select ticket type"
            value={ticketType}
            onChange={(item) => {
              setTicketType(item.value);
            }}
            renderLeftIcon={() => (
              <Ionicons
                name="layers"
                size={20}
                color="#10b981"
                style={{ marginRight: 12 }}
              />
            )}
          />
        </View>

        {/* PRIORITY */}

        <View style={styles.card}>
          <Text style={styles.label}>Priority</Text>

          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            iconStyle={styles.iconStyle}
            containerStyle={styles.dropdownContainer}
            itemTextStyle={styles.itemTextStyle}
            activeColor="rgba(16,185,129,0.15)"
            data={priorityData}
            labelField="label"
            valueField="value"
            placeholder="Select priority"
            value={priority}
            onChange={(item) => {
              setPriority(item.value);
            }}
            renderLeftIcon={() => (
              <Ionicons
                name="warning"
                size={20}
                color="#10b981"
                style={{ marginRight: 12 }}
              />
            )}
          />
        </View>

        {/* TITLE */}

        <View style={styles.card}>
          <Text style={styles.label}>Ticket Title</Text>

          <TextInput
            mode="flat"
            value={title}
            onChangeText={setTitle}
            placeholder="Enter ticket title"
            placeholderTextColor="#64748b"
            style={styles.input}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{
              colors: {
                primary: '#10b981',
              },
            }}
            left={
              <TextInput.Icon
                icon="clipboard-text"
                color="#10b981"
              />
            }
          />
        </View>

        {/* DESCRIPTION */}

        <View style={styles.card}>
          <Text style={styles.label}>Description</Text>

          <TextInput
            mode="flat"
            multiline
            numberOfLines={6}
            value={description}
            onChangeText={setDescription}
            placeholder="Describe issue in detail..."
            placeholderTextColor="#64748b"
            style={[styles.input, styles.textArea]}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{
              colors: {
                primary: '#10b981',
              },
            }}
          />
        </View>

        {/* ASSIGNEE */}

        <View style={styles.card}>
          <Text style={styles.label}>Assign To</Text>

          <TextInput
            mode="flat"
            value={assignee}
            onChangeText={setAssignee}
            placeholder="Technician name"
            placeholderTextColor="#64748b"
            style={styles.input}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{
              colors: {
                primary: '#10b981',
              },
            }}
            left={
              <TextInput.Icon
                icon="account"
                color="#10b981"
              />
            }
          />
        </View>

        {/* NOTES */}

        <View style={styles.card}>
          <Text style={styles.label}>Additional Notes</Text>

          <TextInput
            mode="flat"
            multiline
            numberOfLines={4}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add additional notes..."
            placeholderTextColor="#64748b"
            style={[styles.input, styles.textArea]}
            textColor="#fff"
            underlineColor="transparent"
            activeUnderlineColor="transparent"
            theme={{
              colors: {
                primary: '#10b981',
              },
            }}
          />
        </View>

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.submitGradient}
          >
            <Ionicons
              name="checkmark-circle"
              size={24}
              color="#fff"
            />

            <Text style={styles.submitText}>
              Create Ticket
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },

  header: { paddingTop: 20, paddingHorizontal: 20, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  headerIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  headerTitle: { color: '#fff', fontWeight: '600', fontSize: 16 },
  headerSubtitle: { color: 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: 11, marginTop: 2 },
  notificationBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },

  scrollContainer: {
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 16,
  },

  card: {
    marginBottom: 18,
    padding: 20,
    borderRadius: 28,
    backgroundColor: 'rgba(15,23,42,0.95)',
    borderWidth: 1,
    borderColor: 'rgba(16,185,129,0.15)',
  },

  label: {
    color: '#cbd5e1',
    marginBottom: 14,
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  dropdown: {
    height: 62,
    backgroundColor: '#111827',
    borderRadius: 18,
    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },

  dropdownContainer: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },

  placeholderStyle: {
    color: '#64748b',
    fontSize: 15,
  },

  selectedTextStyle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },

  itemTextStyle: {
    color: '#fff',
    fontSize: 15,
  },

  iconStyle: {
    width: 20,
    height: 20,
  },

  input: {
    backgroundColor: '#111827',
    borderRadius: 18,
    color: '#fff',
    fontSize: 15,
  },

  textArea: {
    minHeight: 140,
    textAlignVertical: 'top',
  },

  submitButton: {
    marginHorizontal: 16,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOpacity: 0.6,
    shadowRadius: 24,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 12,
  },

  submitGradient: {
    paddingVertical: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },

  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
