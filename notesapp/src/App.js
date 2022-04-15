import React, { useEffect, useReducer } from 'react'
import { API } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { List, Input, Button } from 'antd'
import 'antd/dist/antd.min.css'
import { listTodos } from './graphql/queries'
import { createTodo as CreateTodo, deleteTodo as DeleteTodo, updateTodo as UpdateTodo, } from './graphql/mutations'
import { onCreateTodo } from './graphql/subscriptions'

import './App.css';

const CLIENT_ID = uuid()

const initialState = {
  notes: [],
  loading: true,
  error: false,
  form: { name: '', description: '' }
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_NOTES':
      return {
        ...state, notes: action.notes, loading: false
      }
    case 'ADD_NOTE':
      return { ...state, notes: [action.note, ...state.notes] }
    case 'RESET_FORM':
      return { ...state, form: initialState.form }
    case 'SET_INPUT':
      return {
        ...state, form: {
          ...state.form, [action.name]:
            action.value
        }
      }
    case 'ERROR':
      return { ...state, loading: false, error: true }
    default:
      return state
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function fetchTodos() {
    try {
      const notesData = await API.graphql({
        query: listTodos
      })
      console.log('successfully load note!')
      dispatch({
        type: 'SET_NOTES', notes:
          notesData.data.listTodos.items
      })
    } catch (err) {
      console.log('error: ', err)
      dispatch({ type: 'ERROR' })
    }
  }

  async function createTodo() {
    const { form } = state
    if (!form.name || !form.description) {
      return alert('please enter a name and description')
    }
    const note = {
      ...form, clientId: CLIENT_ID, completed:
        false, id: uuid()
    }
    dispatch({ type: 'ADD_NOTE', note })
    dispatch({ type: 'RESET_FORM' })
    try {
      await API.graphql({
        query: CreateTodo,
        variables: { input: note }
      })
      console.log('successfully created note!')
    } catch (err) {
      console.log("error: ", err)
    }
  }

  async function updateTodo(note) {
    const index = state.notes.findIndex(n => n.id === note.id)
    const notes = [...state.notes]
    notes[index].completed = !note.completed
    dispatch({ type: 'SET_NOTES', notes })
    try {
      await API.graphql({
        query: UpdateTodo,
        variables: {
          input: {
            id: note.id, completed:
              notes[index].completed
          }
        }
      })
      console.log('note successfully updated!')
    } catch (err) {
      console.log('error: ', err)
    }
  }


  async function deleteTodo({ id }) {
    const index = state.notes.findIndex(n => n.id === id)
    const notes = [
      ...state.notes.slice(0, index),
      ...state.notes.slice(index + 1)];
    dispatch({ type: 'SET_NOTES', notes })
    try {
      await API.graphql({
        query: DeleteTodo,
        variables: { input: { id } }
      })
      console.log('successfully deleted note!')
    } catch (err) {
      console.log({ err })
    }
  }

  const styles = {
    container: { padding: 20 },
    input: { marginBottom: 10 },
    item: { textAlign: 'left' },
    p: { color: '#1890ff' }
  }

  function renderItem(item) {
    return (
      <List.Item
        style={styles.item}
        actions={[
          <p style={styles.p} onClick={() =>
            deleteTodo(item)}>Delete</p>,
          <p style={styles.p} onClick={() => updateTodo(item)}>
            {item.completed ? 'completed' : 'mark completed'}
          </p>
        ]}
      >
        <List.Item.Meta
          title={item.name}
          description={item.description}
        />
      </List.Item>
    )
  }

  function onChange(e) {
    dispatch({
      type: 'SET_INPUT', name: e.target.name, value:
        e.target.value
    })
  }

  useEffect(() => {
    fetchTodos()
    const subscription = API.graphql({
      query: onCreateTodo

    })
      .subscribe({
        next: noteData => {
          const note = noteData.value.data.onCreateTodo
          if (CLIENT_ID === note.clientId) return
          dispatch({ type: 'ADD_NOTE', note })
        }
      })
    return () => subscription.unsubscribe()
  }, [])

  return (
    <div style={styles.container}>
      <Input
        onChange={onChange}
        value={state.form.name}
        placeholder="Note Name"
        name='name'
        style={styles.input}
      />
      <Input
        onChange={onChange}
        value={state.form.description}
        placeholder="Note description"
        name='description'
        style={styles.input}
      />
      <Button
        onClick={createTodo}
        type="primary"
      >Create Note</Button>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  )
}

export default App;
