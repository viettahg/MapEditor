import React, { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import Form from './components/Form';

import TaskList from './components/TaskList';
import { IStore } from '../../store';
import { GetTasks } from '../../store/actions/tasks.actions';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
`;

const Title = styled.h1`
  margin: 15px 0;
`;

const TodoList: FC = () => {
  const { tasks, isLoading, error } = useSelector((state: IStore) => state.tasks);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: GetTasks.Pending });
  }, []);

  console.log('isLoading ', isLoading, tasks.length)
  
  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error !== null) {
    return <p>{error}</p>;
  }

  

  return (
    <Container id="todo-list">
      <Title>My TODO List</Title>
      <TaskList list={tasks} />
      <Form />
    </Container>
  );
};

export default TodoList;
