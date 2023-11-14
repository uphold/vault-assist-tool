import { Children } from 'react';
import { Mixed } from './Mixed';
import { styles } from '../lib/styles';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const List = styled(Mixed.ul)`
  list-style: none;
`;

const ListItem = styled.li`
  display: flex;
  margin-bottom: 8px;
  gap: 12px;

  ${({ hasIconComponent }) => {
    return !hasIconComponent
      ? `&::before {
          content: '•';
          color: ${styles.colors.n04};
          height: 6px;
          width: 6px;
        }`
      : '';
  }}
`;

export const UnorderedList = ({ children, customIcon, ...props }) => {
  const childrenArray = Children.toArray(children);
  const hasIconComponent = !!customIcon;

  return (
    <List {...props}>
      {childrenArray.map((child, index) => (
        <ListItem hasIconComponent={hasIconComponent} key={index}>
          {hasIconComponent && customIcon}

          {child}
        </ListItem>
      ))}
    </List>
  );
};

UnorderedList.propTypes = {
  children: PropTypes.node.isRequired,
  customIcon: PropTypes.node.isRequired,
};
