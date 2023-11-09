import { Icon } from './Icon';
import { Mixed } from './Mixed';
import { Motion } from './Motion';
import { Small } from './Typography/Small';
import { forwardRef } from 'react';
import { styles } from '../lib/styles';
import PropTypes from 'prop-types';

const variants = {
  box: (isSelected) => ({
    borderColor: isSelected ? styles.colors.p06 : styles.colors.n06,
    color: isSelected ? styles.colors.n01 : styles.colors.n06,
  }),
  hover: (isSelected) =>
    !isSelected && {
      boxShadow: '0 8px 16px var(--shadowColor)',
    },
};

export const ListBox = forwardRef(({ items, isDisabled, onSelect, selectedItem, subtitle, title, ...props }, ref) =>
  items.map((item, index) => (
    <Motion.button
      animate="box"
      backgroundColor="nd40"
      borderRadius="rd02"
      borderStyle="solid"
      borderWidth={item === selectedItem ? 2 : 1}
      cursor={isDisabled(item) && 'not-allowed'}
      custom={item === selectedItem}
      initial="box"
      key={index}
      layoutWidth="100%"
      marginTop={index > 0 && 'sp03'}
      onClick={!isDisabled(item) ? () => onSelect(item) : () => {}}
      paddingBottom={item === selectedItem ? 14 : 15}
      paddingLeft={item === selectedItem ? 18 : 17}
      paddingRight={item === selectedItem ? 18 : 17}
      paddingTop={item === selectedItem ? 19 : 18}
      ref={ref}
      transition={{
        box: { duration: 0.3, ease: 'easeIn' },
      }}
      variants={variants}
      whileHover="hover"
      {...props}
    >
      <Mixed.div alignItems="center" display="flex" justifyContent="space-between">
        <Small color="currentColor" fontWeight="600">
          {title(item)}
        </Small>

        {item === selectedItem && (
          <Mixed.div
            alignItems="center"
            backgroundColor="p06"
            borderRadius="50%"
            layoutHeight="20px"
            layoutWidth="20px"
          >
            <Icon color="n01" marginLeft="auto" name="alertSuccess" size={20} />
          </Mixed.div>
        )}
      </Mixed.div>

      {!!subtitle && (
        <Small
          color="n05"
          dangerouslySetInnerHTML={{ __html: subtitle(item) }}
          marginTop="sp01"
          onClick={(event) => event.target.tagName.toLowerCase() === 'a' && event.stopPropagation()}
          textAlign="left"
        />
      )}
    </Motion.button>
  ))
);

ListBox.defaultProps = {
  isDisabled: undefined,
  items: [],
  selectedItem: undefined,
  subtitle: undefined,
};

ListBox.displayName = 'forwardRef(ListBox)';

ListBox.propTypes = {
  isDisabled: PropTypes.func,
  items: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.object])),
  onSelect: PropTypes.func.isRequired,
  selectedItem: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  subtitle: PropTypes.func,
  title: PropTypes.func.isRequired,
};
