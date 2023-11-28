import { Icon } from '../Icon';
import { Mixed } from '../../components/Mixed';
import { forwardRef } from 'react';
import { getColor } from '../../lib/theme/helpers';
import { theme } from '../../lib/theme';
import { upperFirst } from 'lodash';
import { variants } from './variants';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Wrapper = styled(Mixed.div)`
  align-items: center;
  border-radius: 50%;
  display: flex;
  height: 20px;
  justify-content: center;
  width: 20px;
`;

export const AlertIcon = forwardRef(({ variant }, ref) => {
  const name = `alert${upperFirst(variant)}`;

  return (
    <Wrapper ref={ref} variant={variant} {...getColor(theme, 'alertIcon', variant)}>
      <Icon color={getColor(theme, 'alertIcon', variant).colorCode} name={name} />
    </Wrapper>
  );
});

AlertIcon.defaultProps = {
  variant: 'info'
};

AlertIcon.displayName = 'forwardRef(AlertIcon)';

AlertIcon.propTypes = {
  variant: PropTypes.oneOf(Object.values(variants))
};
