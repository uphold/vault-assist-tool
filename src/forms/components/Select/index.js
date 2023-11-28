import { Body } from './Body';
import { DropdownIcon } from './DropdownIcon';
import { Placeholder } from './Placeholder';
import { forwardRef } from 'react';
import { getColor } from '../../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../../lib/form';
import { theme } from '../../../lib/theme';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import omit from 'lodash/omit';
import styled from 'styled-components';

const DropdownWrapper = styled.div`
  align-items: center;
  display: flex;
  height: 44px;
  justify-content: center;
  width: 52px;
`;

const Wrapper = styled.button`
  ${({ ...props }) => getColor(theme, 'select', getFormVariant(props), getFormStatus(props))};
  align-items: center;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex: 1;
  min-height: 44px;
  padding-top: 6px;
  padding-bottom: 6px;
  padding-left: 14px;
  text-align: left;

  ${({ disabled }) => disabled && { cursor: 'not-allowed' }}
`;

export const Select = forwardRef((props, ref) => {
  const BodyComponent = !isEmpty(props.value) ? Body : Placeholder;

  return (
    <Wrapper ref={ref} {...props}>
      <BodyComponent {...omit(props, 'onClick')} />

      <DropdownWrapper>
        <DropdownIcon disabled={props.disabled} />
      </DropdownWrapper>
    </Wrapper>
  );
});

Select.defaultProps = {
  disabled: false,
  value: {}
};

Select.displayName = 'forwardRef(Select)';

Select.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.object, PropTypes.string])
};
