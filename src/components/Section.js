import { LoadingSpinner } from './Loading/LoadingSpinner';
import { LoadingWrapper } from './Loading/LoadingWrapper';
import { Mixed } from './Mixed';
import PropTypes from 'prop-types';

export const Section = ({ children, isLoading, ...props }) => (
  <Mixed.div {...props}>
    {isLoading ? (
      <LoadingWrapper>
        <LoadingSpinner />
      </LoadingWrapper>
    ) : (
      children
    )}
  </Mixed.div>
);

Section.defaultProps = {
  children: null,
  display: 'flex',
  flex: '1',
  flexDirection: 'column',
  isLoading: false,
  layoutPosition: 'relative',
  overflow: 'hidden',
};

Section.propTypes = {
  children: PropTypes.node,
  isLoading: PropTypes.bool,
};
