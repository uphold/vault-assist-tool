import { Mixed } from './Mixed';
import { colors } from '../lib/styles';
import { memo, useMemo } from 'react';
import { svgs } from '../lib/svgs';
import PropTypes from 'prop-types';
import icons from '../assets/icons';

export const Icon = memo(({ color, name, size, ...props }) => {
  const capitalize = input => input?.replace?.(/^(.)/, char => char.toUpperCase()) || input;

  const { coreIcon, iconSize, nameRef, source, viewBox } = useMemo(() => {
    const { size: imageSize, source } = icons[name] || {};
    const coreIcon = svgs.icons?.[name];

    const iconSize = coreIcon ? 24 : imageSize;
    const nameRef = `#icon${capitalize(name)}`;
    const viewBox = `0 0 ${imageSize} ${imageSize}`;

    return {
      coreIcon,
      iconSize: size || iconSize,
      nameRef,
      source,
      viewBox
    };
  }, [name, size]);

  const svgProps = useMemo(
    () => ({
      fill: colors[color] || color || 'currentColor',
      height: iconSize,
      width: iconSize
    }),
    [color, iconSize]
  );

  if (coreIcon) {
    // eslint-disable-next-line new-cap
    const Icon = Mixed(coreIcon);

    return <Icon {...svgProps} {...props} />;
  }

  if (!source) {
    return null;
  }

  return (
    <Mixed.svg data-test={name} viewBox={viewBox} {...svgProps} {...props}>
      <use xlinkHref={nameRef} />
    </Mixed.svg>
  );
});

Icon.displayName = 'Memo(Icon)';

Icon.defaultProps = {
  color: 'n05',
  size: 0
};

Icon.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
  size: PropTypes.number
};
