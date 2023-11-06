import { IMaskMixin } from 'react-imask';
import { InputText } from '../components/InputText';
import { forwardRef } from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line new-cap
const MaskedInput = IMaskMixin(({ inputRef, ...props }) => <InputText {...props} ref={inputRef} />);

export const MaskedInputField = forwardRef(({ mask, onChange, options, ...props }, ref) => {
  const handlePrepare = (value, masked) => {
    if (options.lowercase) {
      value = value.toLowerCase();
    }

    if (options.trim && value === ' ' && !masked.value?.length) {
      value = '';
    }

    if (options.noEmptySpace) {
      value = value.replace(/ /g, '');
    }

    return value;
  };

  return <MaskedInput {...props} {...mask} onAccept={onChange} prepare={handlePrepare} ref={ref} />;
});

MaskedInputField.displayName = 'MaskedInputField';

MaskedInputField.defaultProps = {
  mask: { mask: String },
  onChange: () => {},
  options: {},
};

MaskedInputField.propTypes = {
  mask: PropTypes.object,
  onChange: PropTypes.func,
  options: PropTypes.object,
};
