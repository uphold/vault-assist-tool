import { AlertIcon } from './AlertIcon';
import { Icon as BaseIcon } from '../Icon';
import { Mixed } from '../Mixed';
import { Small } from '../Typography/Small';
import { getColor } from '../../lib/theme/helpers';
import { isEmpty } from 'lodash';
import { theme } from '../../lib/theme';
import { useEffect, useRef } from 'react';
import { variants } from './variants';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import tippy from 'tippy.js';

const Wrapper = styled(Mixed.div)`
  box-sizing: border-box;
`;

export const Alert = ({ children, onClick, tooltip, variant, ...props }) => {
  const iconRef = useRef(null);
  const tooltipRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!tooltipRef.current || isEmpty(tooltip)) {
      return;
    }

    tooltipRef.current.setContent(tooltip);
    tooltipRef.current.setProps(props);
  }, [props, tooltip, tooltipRef.current]);

  useEffect(() => {
    if (!wrapperRef.current || !iconRef.current || tooltipRef.current || isEmpty(tooltip)) {
      return;
    }

    tooltipRef.current = tippy(iconRef.current, {
      allowHTML: true,
      appendTo: wrapperRef.current,
      arrow: true,
      content: tooltip,
      maxWidth: 'none',
      offset: [-16, 20],
      placement: 'bottom-start',
      theme: 'alert',
      trigger: 'mouseenter',
      triggerTarget: wrapperRef.current,
      zIndex: 1000,
      ...props
    });

    return () => {
      tooltipRef.current.destroy();
      tooltipRef.current = null;
    };
  }, [iconRef.current, tooltip, wrapperRef.current]);

  return (
    <Wrapper
      alignItems="flex-start"
      as={onClick ? Mixed.button : Mixed.div}
      borderRadius="rd02"
      display="flex"
      flexShrink="0"
      layoutPosition="relative"
      layoutWidth="100%"
      onClick={onClick}
      padding="12px 16px"
      ref={wrapperRef}
      variant={variant}
      {...getColor(theme, 'alert', variant)}
      {...props}
    >
      <AlertIcon ref={iconRef} variant={variant} />

      <Small data-test="alertMessage" flex={1} marginLeft="sp03" marginTop={2} textAlign="left">
        {children}
      </Small>

      {!!onClick && (
        <BaseIcon color={getColor(theme, 'alertIcon', variant).backgroundColorCode} name="next" size={24} />
      )}
    </Wrapper>
  );
};

Alert.defaultProps = {
  onClick: undefined,
  tooltip: '',
  variant: 'info'
};

Alert.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  tooltip: PropTypes.string,
  variant: PropTypes.oneOf(Object.values(variants))
};
