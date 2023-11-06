import { forwardRef, useMemo } from 'react';
import { getColor, getTypography } from '../../lib/theme/helpers';
import { getNumeralFormatter } from '../../lib/cleave';
import { theme } from '../../lib/theme';
import PropTypes from 'prop-types';
import mixins, { shouldForwardProp } from '../../lib/mixins';
import styled from 'styled-components';

const getInputPadding = ({ size }) =>
  ({ large: '14px 0 14px 14px', medium: '12px 0 12px 14px', small: '14px 0 14px 14px' }[size]);
const getInputPaddingLeft = (hasLabelIcon, isHidden) => {
  if (isHidden) {
    return '0px';
  }

  return hasLabelIcon ? '22px' : '14px';
};
const getInputTypography = ({ size }) => getTypography(theme, { large: 'h3', medium: 'h4', small: 'small' }[size]);

const Input = styled.input.withConfig({ shouldForwardProp })`
  ${getInputTypography};
  ${mixins};

  &:focus {
    outline: 0;
  }

  &::placeholder {
    ${getColor(theme, 'placeholder')};
  }
`;

export const InputAmount = forwardRef(
  ({ hasLabelIcon, isBold, isFaded, isHidden, onChange, options, value, ...props }, ref) => {
    const numeralFormatter = useMemo(() => getNumeralFormatter(options), [options]);

    const formattedValue = useMemo(() => {
      if (options.numeral && numeralFormatter) {
        return numeralFormatter.format(value === '.' ? '0.' : value || '');
      }

      return value;
    }, [value, options]);

    const onValueChange = (event) => {
      let value = (event.target.value || '').replace(/,$/, '.');

      value = value === '.' ? '0.' : value;

      let rawValue = value;

      if (options.numeral && numeralFormatter) {
        value = numeralFormatter.format(value);

        rawValue = numeralFormatter.getRawValue(value).replace(/,/g, '');
      }

      onChange(rawValue);
    };

    return (
      <Input
        autoComplete="off"
        border="0"
        borderRadius="rd02"
        boxSizing="border-box"
        color={isFaded ? 'n045' : 'n06'}
        fontWeight={isBold ? '600' : undefined}
        inputMode="decimal"
        layoutLeft="0"
        layoutWidth="100%"
        margin="0"
        onChange={onValueChange}
        padding={getInputPadding(props)}
        paddingLeft={getInputPaddingLeft(hasLabelIcon, isHidden)}
        ref={ref}
        type="tel"
        value={formattedValue}
        {...props}
      />
    );
  }
);

InputAmount.defaultProps = {
  hasLabelIcon: false,
  isBold: false,
  isFaded: false,
  isHidden: false,
  onChange: () => {},
  options: {},
  size: 'large',
  value: '',
};

InputAmount.displayName = 'forwardRef(InputAmount)';

InputAmount.propTypes = {
  hasLabelIcon: PropTypes.bool,
  isBold: PropTypes.bool,
  isFaded: PropTypes.bool,
  isHidden: PropTypes.bool,
  onChange: PropTypes.func,
  options: PropTypes.object,
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  value: PropTypes.string,
};
