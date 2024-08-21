import { Blockchain, getCurrency } from '../../../../lib/vault';
import { Button } from '../../../../components/Button';
import { Content, Header, Navigation } from '../../../../layouts';
import { Fragment, useState } from 'react';
import { H4 } from '../../../../components/Typography/H4';
import { Mixed } from '../../../../components/Mixed';
import { NavigationAction } from '../../../../components/Navigation';
import { ScrollableSection } from '../../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../../components/SectionStickyFooter';
import { SelectionBottomSheet } from '../../../../components/SelectionBottomSheet';
import { Semibold } from '../../../../components/Typography/Semibold';
import { Small } from '../../../../components/Typography/Small';
import { Svg } from '../../../../components/Svg';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../../hooks/useTranslation';
import BigNumber from 'bignumber.js';
import CustomPropTypes from '../../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Notice = ({ accountData, onContinueWithdraw }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const [isBottomSheetVisible, setIsBottomSheetvisible] = useState(false);

  const { balance, reserve, trustlines } = accountData;
  const { totalReserve = '0' } = reserve;
  const remainingBalance = new BigNumber(balance).minus(totalReserve);

  const onClickBack = () => {
    history.goBack();
  };

  const assetOptions = trustlines.map((token, index) => ({
    data: { blockchain: Blockchain.XRPL, token },
    isDisabled: false,
    label: getCurrency(token.currency),
    subtitle: 'XRPL Token',
    value: index
  }));

  const tokens = trustlines.map(({ currency }) => getCurrency(currency)).join(', ');

  return (
    <Fragment>
      <Navigation leftAction={<NavigationAction name="back" onClick={onClickBack} />} />

      <ScrollableSection>
        <Content paddingTop="12px">
          <Header alignItems="center">
            <Mixed.div paddingVertical="sp03">
              <Mixed.div>
                {trustlines.map(({ currency }, index) => (
                  <Mixed.span key={index} marginLeft={index > 0 ? '-95px' : undefined}>
                    <Svg size={56} tokenSymbol={getCurrency(currency)} />
                  </Mixed.span>
                ))}
                <Mixed.span marginLeft="-95px">
                  <Svg size={56} tokenSymbol="XRP" />
                </Mixed.span>
              </Mixed.div>
            </Mixed.div>
            <H4 marginBottom="sp03" textAlign="center">
              <Semibold>{t('withdraw.xrp.notice.title')}</Semibold>
            </H4>
          </Header>

          {remainingBalance.gt(0) ? (
            <Content paddingTop="12px">
              <Small marginBottom="sp03" textAlign="center">
                {t('withdraw.xrp.notice.description1', { tokens })}
              </Small>
              <Small textAlign="center">{t('withdraw.xrp.notice.description2')}</Small>
            </Content>
          ) : (
            <Content paddingTop="12px">
              <Small textAlign="center">{t('withdraw.xrp.notice.description.noxrp', { tokens })}</Small>
            </Content>
          )}
        </Content>

        <SectionStickyFooter>
          <Button onPress={() => setIsBottomSheetvisible(true)}>{t('actions.withdraw.tokens')}</Button>
          {remainingBalance.gt(0) && (
            <Button buttonType="secondary" marginTop="sp03" onPress={() => onContinueWithdraw(accountData)}>
              {t('actions.withdraw.xrp')}
            </Button>
          )}
        </SectionStickyFooter>
      </ScrollableSection>
      <SelectionBottomSheet
        isVisible={isBottomSheetVisible}
        label={t('withdraw.xrp.notice.token.label')}
        onClose={() => setIsBottomSheetvisible(false)}
        onSelect={item => onContinueWithdraw({ ...accountData, token: assetOptions[item].data.token })}
        options={assetOptions}
      />
    </Fragment>
  );
};

Notice.defaultProps = {
  accountData: {
    reserve: {
      baseReserve: 0,
      ownerReserve: 0,
      totalReserve: 0
    }
  }
};

Notice.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onContinueWithdraw: PropTypes.func.isRequired
};
