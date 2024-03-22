import { BaseSelectField } from './SelectField';
import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Controller } from 'react-hook-form';
import { Fragment, forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { ListBox } from '../../components/ListBox';
import { Mixed } from '../../components/Mixed';
import { NavigationAction } from '../../components/Navigation/NavigationAction';
import { NavigationBar } from '../../components/Navigation/NavigationBar';
import { Portal } from '../../components/Portal';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { renderControllerField } from '../../lib/form';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';

const BaseDynamicSelectField = forwardRef(({ options, portalId, hideConfirm, ...props }, ref) => {
  const { t } = useTranslation();

  const [isVisible, setVisibility] = useState(false);
  const [scrollHeight, setScrollHeight] = useState();
  const [selectedItem, setSelectedItem] = useState(props.value?.value);
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
    setSelectedItem(props.value?.value);
  }, [isVisible, props.value]);

  useEffect(() => {
    setScrollHeight(currentRef.current?.clientHeight);
  }, [isVisible]);

  const onClose = () => setVisibility(false);
  const onOpen = () => setVisibility(true);

  const onConfirm = item => {
    if (hideConfirm) {
      props.onChange(optionsMap[item]);
    } else {
      props.onChange(optionsMap[selectedItem]);
    }

    onClose();
  };

  return (
    <Fragment>
      <BaseSelectField {...props} onClick={onOpen} />

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
                  setSelectedItem(item);
                  if (hideConfirm) {
                    onConfirm(item);
                  }
                }}
                ref={ref}
                selectedItem={selectedItem}
                subtitle={value => optionsMap[value]?.subtitle}
                title={value => optionsMap[value]?.label}
              />
            ) : null}

            {!hideConfirm ? (
              <SectionStickyFooter>
                <Button onClick={onConfirm}>{t('actions.confirm')}</Button>
              </SectionStickyFooter>
            ) : (
              <Mixed.div paddingBottom="sp03" />
            )}
          </ScrollableSection>
        </BottomSheet>
      </Portal>
    </Fragment>
  );
});

BaseDynamicSelectField.defaultProps = {
  hideConfirm: false,
  portalId: 'dynamicFormPortal'
};

BaseDynamicSelectField.displayName = 'forwardRef(BaseDynamicSelectField)';

BaseDynamicSelectField.propTypes = {
  ...BaseSelectField.propTypes,
  hideConfirm: PropTypes.bool,
  options: PropTypes.array.isRequired,
  portalId: PropTypes.string
};

export const DynamicSelectField = ({ control, defaultValue, name, shouldUnregister, ...props }) => (
  <Controller
    control={control}
    defaultValue={defaultValue}
    name={name}
    render={renderControllerField(BaseDynamicSelectField, props)}
    shouldUnregister={shouldUnregister}
  />
);

DynamicSelectField.defaultProps = {
  control: {},
  defaultValue: undefined,
  shouldUnregister: true
};

DynamicSelectField.propTypes = {
  control: PropTypes.object,
  defaultValue: PropTypes.object,
  name: PropTypes.string.isRequired,
  shouldUnregister: PropTypes.bool
};
