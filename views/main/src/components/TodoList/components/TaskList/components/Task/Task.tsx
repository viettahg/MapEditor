import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import ButtonDelete from './components/ButtonDelete';
import Checkbox from './components/Checkbox';
import { ITask } from '../../../../../../store/reducers/tasks.reducers';
import { DeleteTask, ToggleTask } from '../../../../../../store/actions/tasks.actions';

export interface ITaskProps extends ITask {
}

interface IItemProps {
  completed: boolean;
}

const Item = styled.li<IItemProps>`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  margin: 0 -15px;
  cursor: pointer;
  font-size: 20px;
  border-radius: 2px;
  text-decoration: ${(props: IItemProps) => (props.completed ? 'line-through' : 'none')};
  &:hover {
    background: #cbcbcb;
  }
`;

const Title = styled.div`
  flex: 1 1 auto;
`;

const Task: React.FC<ITaskProps> = ({ id, title, completed }) => {
  const dispatch = useDispatch();

  const handleClickOnItem = () => {
    dispatch({ type: ToggleTask.Success, payload: { id } });
  };

  const handleClickOnDeleteButton = () => {
    dispatch({ type: DeleteTask.Success, payload: { id } });
  };

  return (
    <Item completed={completed} onClick={handleClickOnItem}>
      <Checkbox completed={completed} />
      <Title>{title}</Title>
      <ButtonDelete onClick={handleClickOnDeleteButton} />
    </Item>
  );
};

export default Task;
