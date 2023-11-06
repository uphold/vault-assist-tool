import { Mixed } from '../Mixed';
import { Small } from '../Typography/Small';
import { styles } from '../../lib/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Subtitle = styled(Small)`
  color: ${styles.colors.n05};
`;

const Wrapper = styled(Mixed.div)`
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export const NavigationSubtitle = ({ children, html, ...props }) => {
  const htmlProps = html && { dangerouslySetInnerHTML: { __html: html } };

  return (
    <Wrapper marginTop="sp03" {...props}>
      <Subtitle {...htmlProps} data-test="navigationSubtitle">
        {children}
      </Subtitle>
    </Wrapper>
  );
};

NavigationSubtitle.defaultProps = {
  children: null,
  html: undefined,
};

NavigationSubtitle.propTypes = {
  children: PropTypes.node,
  html: PropTypes.node,
};
