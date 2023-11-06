import { Mixed } from './Mixed';
import { styles } from '../lib/styles';
import PropTypes from 'prop-types';

export const SectionStickyFooter = ({ children, marginTop, ...props }) => {
  const defaultProps = {
    backgroundColor: 'n01',
    padding: 'sp03 sp03',
    ...props,
  };

  return (
    <Mixed.div layoutBottom={0} layoutLeft={0} layoutPosition="sticky" layoutRight={0} marginTop={marginTop} zIndex={1}>
      <Mixed.div
        background={`linear-gradient(
        180deg,
        ${styles.Utils.getColorWithOpacity(styles.colors.nd30, 0)} 0%,
        ${styles.colors.nd30} 100%
      )`}
        layoutHeight={32}
      />

      <Mixed.div {...defaultProps}>{children}</Mixed.div>
    </Mixed.div>
  );
};

SectionStickyFooter.defaultProps = {
  marginTop: 'auto',
};

SectionStickyFooter.propTypes = {
  children: PropTypes.node.isRequired,
  marginTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};
