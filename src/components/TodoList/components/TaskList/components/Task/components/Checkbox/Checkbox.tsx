import React from 'react';
import styled from 'styled-components';
import CheckMark from '../../../../../../../../icons/CheckMark';

interface IProps {
  completed: boolean;
}

const CheckboxInput = styled.div<IProps>`
  border: solid 2px #000;
  border-radius: 2px;
  padding: 3px 2px 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 24px;
  width: 24px;
  min-width: 24px;
  margin-right: 10px;
  box-sizing: border-box;
  & svg {
    opacity: ${(props: IProps) => (props.completed ? 1 : 0)};
    width: 100%;
  }
`;

const Checkbox: React.FC<IProps> = ({ completed }) => {
  return (
    <CheckboxInput completed={completed}>
      <CheckMark />
    </CheckboxInput>
  );
};

export default Checkbox;
