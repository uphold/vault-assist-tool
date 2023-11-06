import { createElement, useImperativeHandle, useRef } from 'react';
import PropTypes from 'prop-types';

export const getFormStatus = ({ isdisabled, isfocused, ishovered }) => {
  if (isdisabled) {
    return 'disable';
  }

  if (isfocused) {
    return 'focus';
  }

  if (ishovered) {
    return 'hover';
  }

  return 'default';
};

export const getFormVariant = ({ isvalid, variant }) => {
  if (!isvalid) {
    return 'error';
  }

  if (variant) {
    return variant;
  }

  return 'default';
};

export const renderControllerField = (component, props, parentRef) => {
  const Component = ({ field, fieldState }) => {
    const ref = useRef();

    useImperativeHandle(field.ref, () => ref.current?.element || ref.current, []);
    useImperativeHandle(parentRef, () => ref.current, []);

    const componentProps = {
      ...props,
      ...field,
      ...fieldState,
      'data-test': props['data-test'] || props.dataTest || field.name,
      ref,
    };

    // For performance purposes, the override isn't needed if 1 of the functions isn't declared, since they will be automaticaly included on the spread above
    if (props?.onBlur && field?.onBlur) {
      componentProps.onBlur = (event) => {
        field.onBlur(event);
        props.onBlur(event);
      };
    }

    if (props?.onChange && field?.onChange) {
      componentProps.onChange = (event) => {
        field.onChange(event);
        props.onChange(event);
      };
    }

    return createElement(component, componentProps);
  };

  Component.defaultProps = component.defaultProps;

  Component.displayName = `Controller(${component.displayName})`;

  Component.propTypes = {
    ...component.propTypes,
    field: PropTypes.object.isRequired,
    fieldState: PropTypes.object.isRequired,
  };

  return Component;
};
