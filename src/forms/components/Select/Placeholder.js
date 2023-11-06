import { color, getTypography } from '../../../lib/theme/helpers';
import { getFormStatus, getFormVariant } from '../../../lib/form';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const PlaceholderLabel = styled.p`
  ${({ theme, ...props }) => getTypography(theme, 'input', getFormVariant(props), getFormStatus(props))};
  ${color('placeholder')};
  flex: 1;
`;

export const Placeholder = ({ placeholder }) => <PlaceholderLabel>{placeholder}</PlaceholderLabel>;

Placeholder.defaultProps = {
  placeholder: '',
};

Placeholder.propTypes = {
  placeholder: PropTypes.string,
};
