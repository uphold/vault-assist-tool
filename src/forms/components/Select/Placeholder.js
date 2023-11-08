import { getColor, getTypography } from '../../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../../lib/form';
import { theme } from '../../../lib/theme';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PlaceholderLabel = styled.p`
  ${({ ...props }) => getTypography(theme, 'input', getFormVariant(props), getFormStatus(props))};
  ${({ ...props }) => getColor(theme, 'placeholder', getFormVariant(props), getFormStatus(props))};
  flex: 1;
`;

export const Placeholder = ({ placeholder }) => <PlaceholderLabel>{placeholder}</PlaceholderLabel>;

Placeholder.defaultProps = {
  placeholder: '',
};

Placeholder.propTypes = {
  placeholder: PropTypes.string,
};
