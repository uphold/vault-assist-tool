import { Button } from '../../../../components/Button';
import { Content, Header, Navigation } from '../../../../layouts';
import { Fragment } from 'react';
import { H4 } from '../../../../components/Typography/H4';
import { NavigationAction } from '../../../../components/Navigation';
import { OrderedList } from '../../../../components/OrderedList/OrderedList';
import { OrderedListItem } from '../../../../components/OrderedList/OrderedListItem';
import { ScrollableSection } from '../../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../../components/SectionStickyFooter';
import { Semibold } from '../../../../components/Typography/Semibold';
import { formatNumber } from '../../../../utils/formatNumber';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import BigNumber from 'bignumber.js';
import CustomPropTypes from '../../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Root = ({ accountData, onContinueWithdraw }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClickBack = () => {
    history.goBack();
  };

  const { balance, reserve } = accountData;
  const { ownerReserve = '0', totalReserve = '0' } = reserve;

  const remainingBalance = new BigNumber(balance).minus(totalReserve);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('withdraw.xrp.navigation.title')}
      />

      <ScrollableSection>
        <Content paddingTop="12px">
          <Header alignItems="center">
            <H4 marginBottom="sp03" textAlign="center">
              <Semibold>{t('withdraw.xrp.conditions.title')}</Semibold>
            </H4>
          </Header>

          <OrderedList paddingHorizontal="sp03">
            <OrderedListItem number={1}>
              <Semibold>{t('withdraw.xrp.conditions.funds.label')}</Semibold>{' '}
              {t('withdraw.xrp.conditions.funds.text', {
                remainingBalance: <Semibold>({formatNumber(remainingBalance, 2)} XRP)</Semibold>,
                totalReserve: <Semibold>({formatNumber(totalReserve)} XRP)</Semibold>
              })}
            </OrderedListItem>

            <OrderedListItem number={2}>
              <Semibold>{t('withdraw.xrp.conditions.vault.deactivation.label')}</Semibold>{' '}
              {t('withdraw.xrp.conditions.vault.deactivation.text')}
            </OrderedListItem>

            <OrderedListItem number={3}>
              <Semibold>{t('withdraw.xrp.conditions.network.costs.label')}</Semibold>{' '}
              {t('withdraw.xrp.conditions.network.costs.text', {
                ownerReserve: formatNumber(ownerReserve, 0, 0)
              })}
            </OrderedListItem>
          </OrderedList>
        </Content>

        <SectionStickyFooter>
          <Button onPress={() => onContinueWithdraw(accountData)}>{t('actions.continue')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Root.defaultProps = {
  accountData: {
    reserve: {
      baseReserve: 0,
      ownerReserve: 0,
      totalReserve: 0
    }
  }
};

Root.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onContinueWithdraw: PropTypes.func.isRequired
};
