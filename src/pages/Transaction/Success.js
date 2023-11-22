import { Animation } from '../../components/Animation';
import { Button } from '../../components/Button';
import { CenterView, Content, Header, Navigation } from '../../layouts';
import { Fragment, useState } from 'react';
import { H3 } from '../../components/Typography/H3';
import { HorizontalSeparator } from '../../components/HorizontalSeparator';
import { NavigationAction } from '../../components/Navigation';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { TableBox } from '../../components/TableView/TableBox';
import { TableViewBody } from '../../components/TableView/TableViewBody';
import { TableViewNote } from '../../components/TableView/TableViewNote';
import { TableViewTitle } from '../../components/TableView/TableViewTitle';
import { colors } from '../../lib/styles';
import { formatNumber } from '../../utils/formatNumber';
import { getCurrency, getTransactionLink } from '../../lib/vault';
import { useTranslation } from '../../hooks/useTranslation';
import CustomPropTypes from '../../lib/propTypes';
import PropTypes from 'prop-types';

export const Success = ({ transactionData, onFinish }) => {
  const { t } = useTranslation();
  const [animating, setAnimating] = useState(true);

  const { to, destinationTag, amount, network, hash } = transactionData;

  return animating ? (
    <CenterView>
      <Animation
        animation="successOperation"
        animationOptions={{ loop: false }}
        color={colors.green20}
        layoutMaxWidth="100px"
        onComplete={() => {
          setAnimating(false);
        }}
      />
    </CenterView>
  ) : (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="close" onClick={onFinish} />}
        title={t('transaction.navigation.title')}
      />
      <ScrollableSection>
        <Content paddingTop="12px">
          <Header alignItems="center">
            <H3 marginBottom="sp03" textAlign="center">
              {t('transaction.success.header', { currency: getCurrency(network) })}
            </H3>
          </Header>
          <TableBox padding="sp01 sp03">
            <TableViewTitle>{t('transaction.success.details.label.amount.transferred')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>
                {formatNumber(amount)} {getCurrency(network)}
              </TableViewNote>
            </TableViewBody>
            <HorizontalSeparator margin="sp02 0" />
            <TableViewTitle>{t('transaction.success.details.label.destination.address')}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{to}</TableViewNote>
            </TableViewBody>
            {destinationTag ? (
              <Fragment>
                <HorizontalSeparator margin="sp02 0" />
                <TableViewTitle>{t('transaction.success.details.label.destination.tag')}</TableViewTitle>

                <TableViewBody>
                  <TableViewNote>{destinationTag}</TableViewNote>
                </TableViewBody>
              </Fragment>
            ) : null}
          </TableBox>
        </Content>
        <SectionStickyFooter>
          <Button marginBottom="sp02" onPress={() => window.open(getTransactionLink(network, hash), '_blank')}>
            {t('actions.view.transaction')}
          </Button>
          <Button buttonType="secondary" marginBottom="sp01" onPress={onFinish}>
            {t('actions.end.session')}
          </Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Success.propTypes = {
  onFinish: PropTypes.func.isRequired,
  transactionData: CustomPropTypes.Transaction.isRequired,
};
