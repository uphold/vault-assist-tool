import { Controller } from 'react-hook-form';
import { ErrorSwitch } from '../components/ErrorSwitch';
import { Input } from '../components/Input';
import { InputTextArea } from '../components/InputTextArea';
import { Label } from '../components/Label';
import { Message } from '../components/Message';
import { Row } from '../components/Row';
import { forwardRef, useMemo, useState } from 'react';
import { renderControllerField } from '../../lib/form';
import { useAutoFocus } from '../../hooks/useAutoFocus';
import PropTypes from 'prop-types';

const BaseTextAreaField = forwardRef(
  ({ autoFocus, children, error, invalid, isDisabled, label, message, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false);

    const isdisabled = useMemo(() => (isDisabled ? isDisabled.toString() : undefined), [isDisabled]);
    const isfocused = useMemo(() => (isFocused ? isFocused.toString() : undefined), [isFocused]);
    const isvalid = useMemo(() => (!invalid ? 'true' : undefined), [invalid]);

    const onBlur = event => {
      event.stopPropagation();
      setIsFocused(false);

      props.onBlur(event);
    };

    const onFocus = event => {
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

        <Input isdisabled={isdisabled} isfocused={isFocused} isvalid={isvalid}>
          <InputTextArea
            {...props}
            disabled={isDisabled}
            isdisabled={isdisabled}
            isfocused={isfocused}
            isvalid={isvalid}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
          />
        </Input>

        {invalid ? <ErrorSwitch errors={error}>{children}</ErrorSwitch> : message && <Message>{message}</Message>}
      </Row>
    );
  }
);

BaseTextAreaField.defaultProps = {
  autoFocus: false,
  children: null,
  'data-test': '',
  error: undefined,
  invalid: false,
  isDisabled: false,
  label: undefined,
  maxLength: 1024,
  message: undefined,
  onBlur: () => {},
  onFocus: () => {},
  placeholder: '',
  type: 'textarea'
};

BaseTextAreaField.displayName = 'forwardRef(BaseTextAreaField)';

BaseTextAreaField.propTypes = {
  autoFocus: PropTypes.bool,
  children: PropTypes.node,
  'data-test': PropTypes.string,
  error: PropTypes.object,
  invalid: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.node,
  maxLength: PropTypes.number,
  message: PropTypes.node,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  type: PropTypes.string
};

export const TextAreaField = ({ control, defaultValue, name, shouldUnregister, ...props }) => (
  <Controller
    control={control}
    defaultValue={defaultValue || ''}
    name={name}
    render={renderControllerField(BaseTextAreaField, props)}
    shouldUnregister={shouldUnregister}
  />
);

TextAreaField.defaultProps = {
  control: {},
  defaultValue: '',
  shouldUnregister: true
};

TextAreaField.propTypes = {
  control: PropTypes.object,
  defaultValue: PropTypes.any,
  name: PropTypes.string.isRequired,
  shouldUnregister: PropTypes.bool
};
