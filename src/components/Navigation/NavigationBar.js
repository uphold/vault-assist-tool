import { Mixed } from '../Mixed';
import { SectionTitle } from '../SectionTitle';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Header = styled(Mixed.div)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  min-height: 32px;
  padding-bottom: 8px;
`;

const NavigationWrapper = styled(Mixed.div)`
  padding: 16px;
`;

const NavigationAction = styled(Mixed.div)`
  display: flex;
  flex: 0.5;

  &:last-child {
    justify-content: flex-end;
  }
`;

const NavigationTitle = styled(SectionTitle)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const NavigationBar = ({
  children,
  leftAction: LeftActionComponent,
  rightAction: RightActionComponent,
  title,
  ...props
}) => {
  const hasLeftAction = !isEmpty(LeftActionComponent);
  const hasRightAction = !isEmpty(RightActionComponent);

  return (
    <NavigationWrapper {...props}>
      <Header>
        <NavigationAction>{hasLeftAction && LeftActionComponent}</NavigationAction>

        {title && (
          <NavigationTitle
            data-test="navigationTitle"
            marginHorizontal={hasLeftAction || hasRightAction ? 'sp03' : '0'}
          >
            {title}
          </NavigationTitle>
        )}

        <NavigationAction>{hasRightAction && RightActionComponent}</NavigationAction>
      </Header>

      {!isEmpty(children) && children}
    </NavigationWrapper>
  );
};

NavigationBar.defaultProps = {
  children: null,
  leftAction: null,
  rightAction: null,
  title: ''
};

NavigationBar.propTypes = {
  children: PropTypes.node,
  leftAction: PropTypes.node,
  rightAction: PropTypes.node,
  title: PropTypes.node
};
