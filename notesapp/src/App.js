import React, { useEffect, useReducer } from 'react'
import { API } from 'aws-amplify'
import { List } from 'antd'
import 'antd/dist/antd.css'
import { listTodos } from './graphql/queries'


import logo from './logo.svg';
import './App.css';

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
    case 'ERROR':
      return { ...state, loading: false, error: true }
    default:
      return state
  }
}



function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function fetchNotes() {
    try {
      const notesData = await API.graphql({
        query: listTodos
      })
      dispatch({
        type: 'SET_NOTES', notes:
          notesData.data.listTodos.items
      })
    } catch (err) {
      console.log('error: ', err)
      dispatch({ type: 'ERROR' })
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
      <List.Item style={styles.item}>
        <List.Item.Meta
          title={item.name}
          description={item.description}
        />
      </List.Item>
    )
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  return (
    <div style={styles.container}>
      <List
        loading={state.loading}
        dataSource={state.notes}
        renderItem={renderItem}
      />
    </div>
  )
}

export default App;
