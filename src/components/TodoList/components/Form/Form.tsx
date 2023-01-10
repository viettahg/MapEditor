import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { AddTask } from '../../../../store/actions/tasks.actions';

const Container = styled.div`
  margin: 15px 0;
  display: flex;
`;

const Input = styled.input`
  margin-right: 15px;
  flex: 1 1 auto;
  width: 1%;
  border: solid 2px #000;
  font-size: 20px;
  border-radius: 3px;
  padding: 0.35em 0.5em;
`;

const Button = styled.button`
  width: 120px;
  border-radius: 3px;
  background: #414141;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
`;

const Form: React.FC = () => {
  const [value, onChange] = useState('');
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const onSubmit = () => {
    if (value === '') {
      return;
    }
    dispatch({ type: AddTask.Success, payload: { value } });
    onChange('');
  };

  return (
    <Container>
      <Input type="text" onChange={handleChange} value={value} />
      <Button id="button" onClick={onSubmit}>Add</Button>
    </Container>
  );
};

export default Form;
