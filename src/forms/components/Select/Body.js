import { Value } from '../Select/Value';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
`;

export const Body = ({ isdisabled, value, ...props }) => {
  return (
    <Wrapper {...props}>
      <Value isdisabled={isdisabled}>{value}</Value>
    </Wrapper>
  );
};

Body.defaultProps = {
  isdisabled: false,
  value: '',
};

Body.propTypes = {
  isdisabled: PropTypes.bool,
  value: PropTypes.string,
};
