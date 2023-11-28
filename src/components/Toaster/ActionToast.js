import { Button, ButtonType } from '../Button';
import { Icon } from '../Icon';
import { Mixed } from '../Mixed';
import { Motion } from '../Motion';
import { Paragraph } from '../Typography/Paragraph';
import { Small } from '../Typography/Small';
import { isEmpty } from 'lodash';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { useState } from 'react';
import PropTypes from 'prop-types';

export const ActionToast = ({ action, description, icon, id, secondaryAction, title }) => {
  const [isCloseButtonVisible, setIsCloseButtonVisible] = useState(false);
  const dismissToast = () => toast.dismiss(id);
  const history = useHistory();

  const onClick = ({ action = () => {}, location, shouldDismissToast = false }) => {
    if (shouldDismissToast) {
      dismissToast();
    }

    if (!isEmpty(location)) {
      history.push(location);
    }

    action();
  };

  return (
    <Mixed.div
      backgroundColor="n01"
      cursor="default"
      data-test={id}
      display="flex"
      onMouseEnter={() => setIsCloseButtonVisible(true)}
      onMouseLeave={() => setIsCloseButtonVisible(false)}
      padding="sp05"
    >
      <Motion.button
        animate={{ opacity: isCloseButtonVisible ? 1 : 0 }}
        layoutPosition="absolute"
        layoutRight="8px"
        layoutTop="8px"
        onClick={dismissToast}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <Icon color="n045" name="close" size={20} />
      </Motion.button>

      {icon && <Icon color={icon.color} flexShrink="0" name={icon.name} size={48} />}

      <Mixed.div paddingLeft={icon ? 'sp03' : 0}>
        <Mixed.div marginBottom="sp05">
          <Paragraph color="n06" fontWeight={600} marginBottom="sp01">
            {title}
          </Paragraph>

          <Small color="n05" whiteSpace="pre-line">
            {description}
          </Small>
        </Mixed.div>

        <Mixed.div display="flex">
          <Button layoutWidth="auto" onClick={() => onClick(action)} padding="sp02 sp05">
            {action.label}
          </Button>

          {secondaryAction && (
            <Button
              buttonType={ButtonType.Ghost}
              layoutWidth="auto"
              marginLeft="sp03"
              onClick={() => onClick(secondaryAction)}
              padding="sp02 sp05"
            >
              {secondaryAction.label}
            </Button>
          )}
        </Mixed.div>
      </Mixed.div>
    </Mixed.div>
  );
};

ActionToast.defaultProps = {
  icon: undefined,
  secondaryAction: undefined
};

ActionToast.propTypes = {
  action: PropTypes.shape({
    action: PropTypes.func,
    label: PropTypes.string,
    shouldDismissToast: PropTypes.bool
  }).isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.shape({
    color: PropTypes.string,
    name: PropTypes.string
  }),
  id: PropTypes.string.isRequired,
  secondaryAction: PropTypes.shape({
    action: PropTypes.func,
    label: PropTypes.string,
    shouldDismissToast: PropTypes.bool
  }),
  title: PropTypes.string.isRequired
};
