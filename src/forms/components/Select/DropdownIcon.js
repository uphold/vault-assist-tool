import { Icon } from '../../../components/Icon';
import PropTypes from 'prop-types';

export const DropdownIcon = ({ disabled, ...props }) => (
  <Icon color={disabled ? 'n04' : 'n045'} name="dropdown" {...props} />
);

DropdownIcon.defaultProps = {
  disabled: false,
};

DropdownIcon.propTypes = {
  disabled: PropTypes.bool,
};
