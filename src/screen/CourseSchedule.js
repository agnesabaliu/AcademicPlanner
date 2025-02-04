import React, { useState, useEffect } from 'react';

import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput, Button } from 'react-native';

import { Icon } from 'react-native-elements';

import AsyncStorage from '@react-native-async-storage/async-storage';

const CourseSchedule = () => {

  const [courses, setCourses] = useState([]);

  
  const [modalVisible, setModalVisible] = useState(false);
  
  const [currentCourse, setCurrentCourse] = useState({
  
    id: null,
  
    name: '',
  
    time: '',
  
    days: '',
  
    location: ''
  
  });


  
  useEffect(() => {
  
    loadCourses();
  
  }, []);


  
  const loadCourses = async () => {
  
    try {
  
      const savedCourses = await AsyncStorage.getItem('@courses');
  
      if (savedCourses) setCourses(JSON.parse(savedCourses));
  
  
    } catch (e) {
  
      console.error('Failed to load courses', e);
  
    }
  
  };

  
  const saveCourses = async (coursesToSave) => {
  
    try {
  
      await AsyncStorage.setItem('@courses', JSON.stringify(coursesToSave));
  
    } catch (e) {
  
      console.error('Failed to save courses', e);
  
    }
  
  };

  
  const handleAddCourse = () => {
  
    setCurrentCourse({
  
      id: null,
  
      name: '',
  
      time: '',
  
      days: '',
  
      location: ''
  
    });
  
    setModalVisible(true);
  
  };


  
  const handleSaveCourse = () => {
  
    if (!currentCourse.name || !currentCourse.time || !currentCourse.days || !currentCourse.location) {
  
      alert('Ju lutem plotësoni të gjitha fushat!');
  
      return;
  
    }

  
    if (currentCourse.id !== null) {
  
      const updatedCourses = courses.map(course => 
  
        course.id === currentCourse.id ? currentCourse : course
  
      );
  
      setCourses(updatedCourses);
  
      saveCourses(updatedCourses);
  
    } else {
  
      const newCourse = { ...currentCourse, id: Date.now().toString() };
  
      const updatedCourses = [...courses, newCourse];
  
      setCourses(updatedCourses);
  
      saveCourses(updatedCourses);
  
  
    }
  
    setModalVisible(false);
  
  };

  
  const handleEditCourse = (course) => {
  
    setCurrentCourse(course);
  
    setModalVisible(true);
  
  };

  
  const handleDeleteCourse = (courseId) => {
  
    const updatedCourses = courses.filter(course => course.id !== courseId);
  
    setCourses(updatedCourses);

    saveCourses(updatedCourses);

  };


  
  return (
  
  <View style={styles.container}>
  
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
  
        
        <Icon name="add" size={30} color="white" />
      
      </TouchableOpacity>

      
      <FlatList
      
      data={courses}
      
      keyExtractor={(item) => item.id}
      
      ListEmptyComponent={
      
        <Text style={styles.emptyMessage}>Nuk ka kurse të regjistruara. Shtoni një kurs të ri!</Text>
      
      }
      
      renderItem={({ item }) => (
      
      <View style={styles.courseItem}>
      
            <View style={styles.courseInfo}>
      
              <Text style={styles.courseName}>{item.name}</Text>
      
              <Text>{item.days} {item.time}</Text>
      
              <Text>{item.location}</Text>
      
            </View>
      
            <View style={styles.actions}>
      
              <TouchableOpacity onPress={() => handleEditCourse(item)}>
      
                <Icon name="edit" type="material" color="#4CAF50" />
      
              </TouchableOpacity>
      
              <TouchableOpacity onPress={() => handleDeleteCourse(item.id)}>
      
                <Icon name="delete" type="material" color="#F44336" />
      
              </TouchableOpacity>
      
            </View>
      
          </View>
      
    )}
    
    />




      <Modal visible={modalVisible} animationType="slide" transparent={true}>

        <View style={styles.modalOverlay}>

          <View style={styles.modalContent}>

            <View style={styles.modalHeader}>

              <Text style={styles.modalTitle}>

                {currentCourse.id ? 'Edit Course' : 'Add Course'}

              </Text>

              <TouchableOpacity onPress={() => setModalVisible(false)}>

                <Icon name="close" type="material" color="#999" />

              </TouchableOpacity>

            </View>

            <TextInput
              style={styles.input}
              
              placeholder="Course Name"

              value={currentCourse.name}

              onChangeText={(text) => setCurrentCourse({...currentCourse, name: text})}

            />

            <TextInput

              style={styles.input}

              placeholder="Time (e.g., 9:00 AM - 10:30 AM)"

              value={currentCourse.time}

              onChangeText={(text) => setCurrentCourse({...currentCourse, time: text})}

            />

            <TextInput

              style={styles.input}

              placeholder="Days (e.g., Mon, Wed, Fri)"

              value={currentCourse.days}

              onChangeText={(text) => setCurrentCourse({...currentCourse, days: text})}

            />

            <TextInput

              style={styles.input}

              placeholder="Location"

              value={currentCourse.location}

              onChangeText={(text) => setCurrentCourse({...currentCourse, location: text})}

            />

            
            <View style={styles.modalButtons}>
            
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#999" />
            
              <Button title="Save" onPress={handleSaveCourse} color="#2196F3" />
            
            </View>
            
          </View>

        </View>

      </Modal>

    </View>

  );

};

const styles = StyleSheet.create({

  container: {

    flex: 1,

    padding: 20,
    
  },

  addButton: {

    position: 'absolute',

    right: 20,

    bottom: 20,

    backgroundColor: '#2196F3',

    borderRadius: 30,

    width: 60,

    height: 60,

    justifyContent: 'center',

    alignItems: 'center',

    
    zIndex: 1,
  
  },
  
  courseItem: {
  
    flexDirection: 'row',
  
    justifyContent: 'space-between',
  
    padding: 15,
  
    marginVertical: 5,
  
    backgroundColor: '#f8f8f8',
  
    borderRadius: 5,
  
  },
  
  courseInfo: {
  
    flex: 1,
  
  },
  
  courseName: {
  
    fontSize: 16,
  
    fontWeight: 'bold',
  
    marginBottom: 5,
  
  },
  
  actions: {
  
    flexDirection: 'row',
  
    gap: 15,
  
    alignItems: 'center',
  
  },
  
  modalOverlay: {
  
    flex: 1,
  
    justifyContent: 'center',
  
    alignItems: 'center',
  
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  
  },
  
  modalContent: {
  
    width: '90%',
  
    backgroundColor: 'white',
  
    padding: 20,
  
    borderRadius: 10,
  
  },
  
  modalHeader: {
  
    flexDirection: 'row',
  
    justifyContent: 'space-between',
  
    alignItems: 'center',
  
    marginBottom: 20,
  
  },
  
  modalTitle: {
  
    fontSize: 20,
  
    fontWeight: 'bold',
  
  },
  
  input: {
  
    height: 40,
  
    borderColor: '#ddd',
  
    borderWidth: 1,
  
    marginBottom: 15,
  
    padding: 10,
  
  
    borderRadius: 5,
  
  },
  
  modalButtons: {
  
    flexDirection: 'row',
  
    justifyContent: 'space-around',
  
    marginTop: 20,
  
  },
  
  emptyMessage: {
  
    textAlign: 'center',
  
    marginTop: 20,
  
    fontSize: 16,
  
    color: '#888',
  
  },

});

export default CourseSchedule;

