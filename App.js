/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
// import asyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import Config from 'react-native-config';

const COLORS = {primary: '1f145c', white: 'fff'};

const App = () => {
  const [textInput, setTextInput] = React.useState('');
  const [todos, setTodos] = React.useState([
    {id: 1, task: 'first todo', completed: true},
    {id: 2, task: 'seocnd todo', completed: false},
  ]);
  const fetch = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/todos');
      console.log(res.data);
      setTodos(res.data);
    } catch (error) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetch();
  }, []);
  const ListItem = ({todo}) => (
    <View style={styles.ListItem}>
      <View style={{flex: 1}}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 15,
            color: COLORS.primary,
            textDecorationLine: todo?.completed ? 'line-through' : 'none',
          }}>
          {todo?.task}
        </Text>
      </View>
      {!todo?.completed && (
        <TouchableOpacity
          style={styles.done}
          onPress={() => markTodoComplete(todo?.id)}>
          <Text>Done</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={styles.delete}
        onPress={() => deleteTodo(todo?.id)}>
        <Text>delete</Text>
      </TouchableOpacity>
    </View>
  );

  const addTodo = async () => {
    if (!textInput) {
      Alert.alert(Error, 'Please enter todo');
    } else {
      const newTodo = {
        id: Math.random(),
        task: textInput,
        completed: false,
      };

      //Not work!!
      // await axios.get('http://localhost:3000/api/todos', newTodo);
      // await axios.post('http://localhost:3000/api/todos', newTodo);
      // console.log(res.data);

      setTodos([...todos, newTodo]);
      setTextInput('');
    }
  };

  const markTodoComplete = todoId => {
    // console.log(todoId);
    const newTodos = todos.map(item => {
      if (item.id === todoId) {
        return {...item, completed: true};
      }
      return item;
    });
    setTodos(newTodos);
  };

  const deleteTodo = async todoId => {
    console.log(todoId);
    const newTodos = todos.filter(item => item.id !== todoId);
    setTodos(newTodos);
    await axios.delete('http://localhost:3000/api/todos', {
      params: {
        id: todoId,
      },
    });
  };

  const clearTodos = todoId => {
    // Alert.alert('Confirm', 'Clear Todos?', [
    //   {
    //     text: 'yes',
    //     onPress: () => setTodos([]),
    //   },
    //   {text: 'No'},
    // ]);
    setTodos([]);
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{backgroundColor: COLORS.white, flex: 1}}>
      <View style={styles.header}>
        <Text
          style={{
            fontWeight: 'bold',
            fontSize: 20,
            color: COLORS.primary,
          }}>
          Todo App
        </Text>
        <TouchableOpacity style={styles.delete} onPress={clearTodos}>
          <Text>Clear</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 100}}
        renderItem={({item}) => <ListItem todo={item} />}
      />
      <View style={styles.footer}>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="add todo"
            value={textInput}
            onChangeText={text => setTextInput(text)}
            onSubmitEditing={e => {
              addTodo();
              setTextInput('');
            }}
            onKeyPress={e => {
              if (e.nativeEvent.key === 'Enter') {
                console.log('hhhhhh');
                addTodo();
                setTextInput('');
              }
            }}
          />
        </View>
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <View style={styles.iconContainer}>
            <Text>ADD</Text>
          </View>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  ListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    elevation: 12,
    borderRadius: 7,
    marginVertical: 20,
    borderWidth: 3,
    borderColor: 'black',
  },
  header: {
    marginTop: 26,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderColor: '#e5e5e5',
    margin: 15,
  },
  footer: {
    // position: 'absolute',
    // bottom: 0,
    // margin: 9,
    color: COLORS.white,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    // borderWidth: 3,
    // borderColor: 'black',
    // borderRadius: 10,
  },
  inputContainer: {
    backgroundColor: COLORS.white,
    elevation: 40,
    flex: 1,
    height: 50,
    marginVertical: 20,
    marginRight: 20,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  iconContainer: {
    height: 50,
    width: 50,
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    elevation: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: '17px',
    height: 45,
    width: 45,
    borderRadius: 5,
  },
  done: {
    height: 25,
    width: 45,
    backgroundColor: 'green',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 5,
  },
  delete: {
    height: 25,
    width: 45,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 5,
    borderRadius: 5,
  },
});

export default App;
