import { Button } from '../../components/Button';
import { Center, CenterView, Header } from '../../layouts';
import { H3 } from '../../components/Typography/H3';
import { Mixed } from '../../components/Mixed';
import { Paragraph } from '../../components/Typography/Paragraph';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Semibold } from '../../components/Typography/Semibold';
import { Svg } from '../../components/Svg';
import { colors } from '../../lib/styles';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Section = styled(ScrollableSection)`
  grid-area: content;
`;

export const Pending = ({ onFinish }) => {
  const { t } = useTranslation();

  return (
    <Section>
      <CenterView>
        <Center>
          <Mixed.div paddingVertical="sp03">
            <Svg color={colors.blue30} height={100} name="pending" width={100} />
          </Mixed.div>

          <Header alignItems="center">
            <H3 marginBottom="sp02">
              <Semibold>{t('transaction.pending.header')}</Semibold>
            </H3>
          </Header>

          <Paragraph textAlign="center">{t('transaction.pending.description')}</Paragraph>
        </Center>
      </CenterView>

      <SectionStickyFooter>
        <Button onPress={onFinish}>{t('actions.close')}</Button>
      </SectionStickyFooter>
    </Section>
  );
};

Pending.propTypes = {
  onFinish: PropTypes.func.isRequired
};
