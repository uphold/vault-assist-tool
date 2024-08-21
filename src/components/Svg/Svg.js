import { forwardRef } from 'react';
import { styles } from '../../lib/styles';
import { svgs } from '../../lib/svgs';
import { useTheme } from '../../hooks/useTheme';
import PropTypes from 'prop-types';

export const Svg = forwardRef(
  ({ color, customComponent, height, tokenSymbol, name, size, testID, width, ...props }, ref) => {
    const { name: themeName } = useTheme();
    const { icons, images, tokens } = svgs;

    const svg = customComponent || images[name] || icons[name];

    const Component = svg?.[themeName] || svg;

    if (tokenSymbol) {
      const TokenIcon = tokens[tokenSymbol] || tokens.Default;

      return (
        <TokenIcon
          height={height || size}
          ref={ref}
          width={width || size}
          {...(testID && { 'data-testid': testID })}
          {...props}
        />
      );
    }

    if (!Component) {
      return null;
    }

    return (
      <Component
        fill={color ? styles.colors?.[color] || color : undefined}
        height={height || size}
        ref={ref}
        width={width || size}
        {...(testID && { 'data-testid': testID })}
        {...props}
      />
    );
  }
);

Svg.defaultProps = {
  color: undefined,
  customComponent: undefined,
  height: undefined,
  name: undefined,
  size: 20,
  testID: undefined,
  tokenSymbol: undefined,
  width: undefined
};

Svg.displayName = 'Memo(Svg)';

Svg.propTypes = {
  color: PropTypes.string,
  customComponent: PropTypes.node,
  height: PropTypes.number,
  name: PropTypes.string,
  size: PropTypes.number,
  testID: PropTypes.string,
  tokenSymbol: PropTypes.string,
  width: PropTypes.number
};
