import { BottomSheet } from '../BottomSheet';
import { ListBox } from '../ListBox';
import { NavigationAction } from '../Navigation/NavigationAction';
import { NavigationBar } from '../Navigation/NavigationBar';
import { Portal } from '../Portal';
import { ScrollableSection } from '../ScrollableSection';
import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

export const SelectionBottomSheet = ({ options, portalId, isVisible, onClose, onSelect, ...props }) => {
  const [scrollHeight, setScrollHeight] = useState();
  const currentRef = useRef({});
  const hasSearch = options.length > 10;

  const { items, optionsMap } = useMemo(() => {
    const filteredOptions = options;

    return filteredOptions.reduce(
      (accumulator, { isDisabled, label, subtitle, value }) => ({
        items: [...accumulator.items, value],
        optionsMap: {
          ...accumulator.optionsMap,
          [value]: {
            isDisabled,
            label,
            subtitle,
            value
          }
        }
      }),
      { items: [], optionsMap: {} }
    );
  }, [options]);

  useEffect(() => {
    setScrollHeight(currentRef.current?.clientHeight);
  }, [isVisible]);

  const onConfirm = item => {
    onSelect(item);
    onClose();
  };

  return (
    <Portal id={portalId}>
      <BottomSheet isVisible={isVisible} onRequestClose={onClose}>
        <NavigationBar leftAction={<NavigationAction name="expand" onClick={onClose} />} title={props.label} />

        <ScrollableSection
          layoutMinHeight={scrollHeight}
          overflowY={hasSearch ? 'scroll' : 'auto'}
          padding="0 sp05"
          ref={currentRef}
        >
          {items.length ? (
            <ListBox
              isDisabled={value => optionsMap[value]?.isDisabled}
              items={items}
              onSelect={item => {
                onConfirm(item);
              }}
              subtitle={value => optionsMap[value]?.subtitle}
              title={value => optionsMap[value]?.label}
            />
          ) : null}
        </ScrollableSection>
      </BottomSheet>
    </Portal>
  );
};

SelectionBottomSheet.defaultProps = {
  children: null,
  'data-test': '',
  error: undefined,
  hasAlert: false,
  hideConfirm: true,
  invalid: false,
  isDisabled: false,
  isVisible: false,
  label: undefined,
  labelProp: 'name',
  message: undefined,
  onSelect: () => {},
  portalId: 'dynamicFormPortal',
  type: 'button',
  value: {}
};

SelectionBottomSheet.propTypes = {
  children: PropTypes.node,
  'data-test': PropTypes.string,
  error: PropTypes.object,
  hasAlert: PropTypes.bool,
  hideConfirm: PropTypes.bool,
  invalid: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isVisible: PropTypes.bool,
  label: PropTypes.string,
  labelProp: PropTypes.string,
  message: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  options: PropTypes.array.isRequired,
  portalId: PropTypes.string,
  type: PropTypes.string,
  value: PropTypes.object
};
