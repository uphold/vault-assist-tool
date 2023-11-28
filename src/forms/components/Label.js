import { getColor, getTypography } from '../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../lib/form';
import { styles } from '../../lib/styles';
import { theme } from '../../lib/theme';
import mixins from '../../lib/mixins';
import styled from 'styled-components';

export const Label = styled.label`
  ${({ ...props }) => getColor(theme, 'label', getFormVariant(props), getFormStatus(props))};
  ${({ ...props }) => getTypography(theme, 'small', getFormVariant(props), getFormStatus(props))};
  ${mixins}
  background-color: transparent;
  font-weight: 500;
  transition: color 0.3s ease-in-out;

  &::before {
    border-top: 2px solid ${styles.colors.nd30};
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 8px;
    z-index: -1;
  }
`;

Label.defaultProps = {
  layoutLeft: 8,
  layoutPosition: 'absolute',
  layoutTop: 0,
  margin: 0,
  padding: '0 sp02',
  zIndex: 1
};
