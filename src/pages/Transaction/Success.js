import { Animation } from '../../components/Animation';
import { Blockchain, getCurrency, getTransactionLink, transactionTypes } from '../../lib/vault';
import { Button } from '../../components/Button';
import { CenterView, Content, Header, Navigation } from '../../layouts';
import { Fragment, useMemo, useState } from 'react';
import { H3 } from '../../components/Typography/H3';
import { HorizontalSeparator } from '../../components/HorizontalSeparator';
import { NavigationAction } from '../../components/Navigation';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Small } from '../../components/Typography/Small';
import { TableBox } from '../../components/TableView/TableBox';
import { TableViewBody } from '../../components/TableView/TableViewBody';
import { TableViewNote } from '../../components/TableView/TableViewNote';
import { TableViewTitle } from '../../components/TableView/TableViewTitle';
import { colors } from '../../lib/styles';
import { formatNumber } from '../../utils/formatNumber';
import { useTranslation } from '../../hooks/useTranslation';
import CustomPropTypes from '../../lib/propTypes';
import PropTypes from 'prop-types';

export const Success = ({ transactionData, onFinish }) => {
  const { t } = useTranslation();
  const [animating, setAnimating] = useState(true);

  const { to, destinationTag, amount, transactionType, tokenAmount: token, network, hash } = transactionData;

  const { header, description, transferAmount, transferLabel } = useMemo(() => {
    switch (network) {
      case Blockchain.XRPL:
        if (transactionType === transactionTypes[Blockchain.XRPL].Payment) {
          // token sent, trust line closed
          if (token) {
            return {
              description: t('transaction.success.token.description', { currency: getCurrency(token?.currency) }),
              header: t('transaction.success.token.header', { currency: getCurrency(token?.currency) }),
              transferAmount: `${formatNumber(token?.value)} ${getCurrency(token?.currency)}`,
              transferLabel: t('transaction.success.details.label.amount.transferred')
            };
          }

          // xrp transfer only
          return {
            description: t('transaction.success.transfer.description'),
            header: t('transaction.success.transfer.header', { currency: getCurrency(network) }),
            transferAmount: `${formatNumber(amount)} ${getCurrency(network)}`,
            transferLabel: t('transaction.success.details.label.amount.transferred')
          };
        }

        if (transactionType === transactionTypes[Blockchain.XRPL].TrustSet) {
          // only trust line closed
          return {
            description: t('transaction.success.token.description', { currency: getCurrency(token?.currency) }),
            header: t('transaction.success.trustline.header', { currency: getCurrency(token?.currency) }),
            transferAmount: `${formatNumber(amount)} ${getCurrency(network)}`,
            transferLabel: t('transaction.success.details.label.amount.transferred')
          };
        }

        // fully close account
        return {
          header: t('transaction.success.header', { currency: getCurrency(network) }),
          transferAmount: `${formatNumber(amount)} ${getCurrency(network)}`,
          transferLabel: t('transaction.success.details.label.reserve.credited')
        };

      case Blockchain.HEDERA:
        return {
          header: t('transaction.success.header', { currency: getCurrency(network) }),
          transferAmount: `${formatNumber(amount)} ${getCurrency(network)}`,
          transferLabel: t('transaction.success.details.label.amount.transferred')
        };

      default:
        return {
          header: t('transaction.success.pending.header', { currency: getCurrency(network) }),
          transferAmount: `${formatNumber(amount)} ${getCurrency(network)}`,
          transferLabel: t('transaction.success.details.label.amount.transferred')
        };
    }
  }, [amount, network, token, transactionType]);

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
            <H3 marginBottom={description ? '0' : 'sp03'} textAlign="center">
              {header}
            </H3>
          </Header>
          {description && (
            <Small marginBottom="sp05" textAlign="center">
              {description}
            </Small>
          )}

          <TableBox padding="sp01 sp03">
            <TableViewTitle>{transferLabel}</TableViewTitle>

            <TableViewBody>
              <TableViewNote>{transferAmount}</TableViewNote>
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
  transactionData: CustomPropTypes.Transaction.isRequired
};
