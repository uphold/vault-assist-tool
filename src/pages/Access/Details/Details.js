import { Blockchain, getCurrency } from '../../../lib/vault';
import { Button } from '../../../components/Button';
import { Content, Header, Navigation } from '../../../layouts';
import { Fragment } from 'react';
import { H3 } from '../../../components/Typography/H3';
import { HorizontalSeparator } from '../../../components/HorizontalSeparator';
import { NavigationAction } from '../../../components/Navigation';
import { ScrollableSection } from '../../../components/ScrollableSection';
import { SectionStickyFooter } from '../../../components/SectionStickyFooter';
import { Semibold } from '../../../components/Typography/Semibold';
import { TableBox } from '../../../components/TableView/TableBox';
import { TableViewBody } from '../../../components/TableView/TableViewBody';
import { TableViewNote } from '../../../components/TableView/TableViewNote';
import { TableViewText } from '../../../components/TableView/TableViewText';
import { TableViewTitle } from '../../../components/TableView/TableViewTitle';
import { formatNumber } from '../../../utils/formatNumber';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../../hooks/useTranslation';
import CustomPropTypes from '../../../lib/propTypes';
import PropTypes from 'prop-types';

export const Details = ({ accountData, onConfirm }) => {
  const { t } = useTranslation();
  const history = useHistory();

  const onClickBack = () => {
    history.goBack();
  };

  const { address, balance, reserve, network } = accountData;
  const { totalReserve = 0 } = reserve;

  const remainingBalance = Number(balance) - Number(totalReserve);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('access.navigation.title')}
      />

      <ScrollableSection>
        <Content paddingTop="0">
          <Header alignItems="center">
            <H3 marginBottom="sp02">
              <Semibold>{getCurrency(network)}</Semibold> {t('access.details.title2')}
            </H3>
          </Header>

          <TableBox>
            <TableViewTitle>{t('access.details.address.label', { currency: getCurrency(network) })}</TableViewTitle>

            <TableViewBody>
              <TableViewNote lineHeight="28px" style={{ wordBreak: 'break-all' }}>
                {address}
              </TableViewNote>
            </TableViewBody>

            <HorizontalSeparator />

            <TableViewTitle>{t('access.details.balance.label', { currency: getCurrency(network) })}</TableViewTitle>

            <TableViewBody>
              <TableViewText>{`${formatNumber(remainingBalance)} ${getCurrency(network)}`}</TableViewText>
            </TableViewBody>

            {network === Blockchain.XRPL ? (
              <Fragment>
                <HorizontalSeparator />

                <TableViewTitle>{t('access.details.reserve.label', { currency: getCurrency(network) })}</TableViewTitle>

                <TableViewBody>
                  <TableViewText>{`${formatNumber(totalReserve)} ${getCurrency(network)}`}</TableViewText>
                </TableViewBody>
              </Fragment>
            ) : null}
          </TableBox>
        </Content>

        <SectionStickyFooter>
          <Button onPress={onConfirm}>{t('actions.withdraw', { currency: getCurrency(network) })}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Details.defaultProps = {
  accountData: {
    reserve: {
      totalReserve: 0
    }
  }
};

Details.propTypes = {
  accountData: CustomPropTypes.Account.isRequired,
  onConfirm: PropTypes.func.isRequired
};
