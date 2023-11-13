import { Controller } from 'react-hook-form';
import { ErrorSwitch } from '../components/ErrorSwitch';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { MaskedInputField } from './MaskedInputField';
import { Message } from '../components/Message';
import { Mixed } from '../../components/Mixed';
import { Row } from '../components/Row';
import { forwardRef, useMemo, useState } from 'react';
import { renderControllerField } from '../../lib/form';
import { useAutoFocus } from '../../hooks/useAutoFocus';
import PropTypes from 'prop-types';

const BaseTextField = forwardRef(
  (
    {
      action,
      autoFocus,
      children,
      error,
      invalid,
      isDisabled,
      label,
      message: defaultMessage,
      messagePosition,
      isCounterVisible,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const isdisabled = useMemo(() => (isDisabled ? isDisabled.toString() : undefined), [isDisabled]);
    const isfocused = useMemo(() => (isFocused ? isFocused.toString() : undefined), [isFocused]);
    const isvalid = useMemo(() => (!invalid ? 'true' : undefined), [invalid]);

    const message = useMemo(() => {
      if (!isFocused && !defaultMessage) {
        return;
      }

      if (!isCounterVisible || !props?.maxLength) {
        return defaultMessage;
      }

      return props.maxLength - (props?.value.length || 0);
    }, [defaultMessage, isCounterVisible, isFocused, props?.maxLength, props?.value]);

    const onBlur = (event) => {
      event.stopPropagation();
      setIsFocused(false);

      props.onBlur(event);
    };

    const onFocus = (event) => {
      event.stopPropagation();
      setIsFocused(true);

      props.onFocus(event);
    };

    useAutoFocus(ref, autoFocus);

    return (
      <Row hasErrors={invalid} hasMessage={!!message}>
        {label && (
          <Label isdisabled={isdisabled} isfocused={isfocused} isvalid={isvalid}>
            {label}
          </Label>
        )}

        <Input isdisabled={isdisabled} isfocused={isfocused} isvalid={isvalid}>
          <MaskedInputField
            {...props}
            disabled={isDisabled}
            isdisabled={isdisabled}
            isfocused={isfocused}
            isvalid={isvalid}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
          />

          {action && <Mixed.button onClick={action.onClick}>{action.icon}</Mixed.button>}
        </Input>

        {invalid && children ? (
          <ErrorSwitch errors={error}>{children}</ErrorSwitch>
        ) : (
          message && <Message textAlign={messagePosition}>{message}</Message>
        )}
      </Row>
    );
  }
);

BaseTextField.defaultProps = {
  action: undefined,
  autoFocus: false,
  children: null,
  error: undefined,
  invalid: false,
  isCounterVisible: false,
  isDisabled: false,
  label: undefined,
  mask: undefined,
  maxLength: undefined,
  message: undefined,
  messagePosition: undefined,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  options: {},
  type: 'text',
  value: '',
};

BaseTextField.displayName = 'forwardRef(BaseTextField)';

BaseTextField.propTypes = {
  action: PropTypes.object,
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  error: PropTypes.object,
  invalid: PropTypes.bool,
  isCounterVisible: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  mask: PropTypes.object,
  maxLength: PropTypes.number,
  message: PropTypes.node,
  messagePosition: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
};

export const TextField = ({ control, defaultValue, name, shouldUnregister, ...props }) => (
  <Controller
    control={control}
    defaultValue={defaultValue || ''}
    name={name}
    render={renderControllerField(BaseTextField, props)}
    shouldUnregister={shouldUnregister}
  />
);

TextField.defaultProps = {
  control: {},
  defaultValue: '',
  shouldUnregister: true,
};

TextField.propTypes = {
  control: PropTypes.object,
  defaultValue: PropTypes.any,
  name: PropTypes.string.isRequired,
  shouldUnregister: PropTypes.bool,
};
