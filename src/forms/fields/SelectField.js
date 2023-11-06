import { Controller } from 'react-hook-form';
import { ErrorSwitch } from '../components/ErrorSwitch';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Message } from '../components/Message';
import { Row } from '../components/Row';
import { Select } from '../components/Select';
import { forwardRef, useMemo } from 'react';
import { renderControllerField } from '../../lib/form';
import PropTypes from 'prop-types';

export const BaseSelectField = forwardRef(
  ({ children, error, hasAlert, isDisabled, invalid, label, labelProp, message, value, ...props }, ref) => {
    const isdisabled = useMemo(() => (isDisabled ? isDisabled.toString() : undefined), [isDisabled]);
    const isvalid = useMemo(() => (!invalid ? 'true' : undefined), [invalid]);

    return (
      <Row hasAlert={hasAlert} hasErrors={invalid} hasMessage={!!message}>
        {label && (
          <Label isdisabled={isdisabled} isvalid={isvalid}>
            {label}
          </Label>
        )}

        <Input isdisabled={isdisabled} isvalid={isvalid}>
          <Select
            {...props}
            disabled={isDisabled}
            isdisabled={isdisabled}
            isvalid={isvalid}
            ref={ref}
            value={value?.[labelProp] || ''}
          />
        </Input>

        {invalid ? <ErrorSwitch errors={error}>{children}</ErrorSwitch> : message && <Message>{message}</Message>}
      </Row>
    );
  }
);

BaseSelectField.defaultProps = {
  children: null,
  'data-test': '',
  error: undefined,
  hasAlert: false,
  invalid: false,
  isDisabled: false,
  label: undefined,
  labelProp: 'name',
  message: undefined,
  onClick: () => {},
  type: 'button',
  value: {},
};

BaseSelectField.displayName = 'forwardRef(BaseSelectField)';

BaseSelectField.propTypes = {
  children: PropTypes.node,
  'data-test': PropTypes.string,
  error: PropTypes.object,
  hasAlert: PropTypes.bool,
  invalid: PropTypes.bool,
  isDisabled: PropTypes.bool,
  label: PropTypes.string,
  labelProp: PropTypes.string,
  message: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  value: PropTypes.object,
};

export const SelectField = ({ control, defaultValue, name, shouldUnregister, ...props }) => (
  <Controller
    control={control}
    defaultValue={defaultValue}
    name={name}
    render={renderControllerField(BaseSelectField, props)}
    shouldUnregister={shouldUnregister}
  />
);

SelectField.defaultProps = {
  control: {},
  defaultValue: {},
  shouldUnregister: true,
};

SelectField.propTypes = {
  control: PropTypes.object,
  defaultValue: PropTypes.object,
  name: PropTypes.string.isRequired,
  shouldUnregister: PropTypes.bool,
};
