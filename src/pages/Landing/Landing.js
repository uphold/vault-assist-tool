import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Center, CenterView, Content, Header } from '../../layouts';
import { Fragment } from 'react';
import { H3 } from '../../components/Typography/H3';
import { Mixed } from '../../components/Mixed';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Semibold } from '../../components/Typography/Semibold';
import { Small } from '../../components/Typography/Small';
import { Svg } from '../../components/Svg';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const AlertBox = styled(Mixed.div)`
  grid-area: navigation;
  padding: 16px;
`;

export const Landing = ({ onConfirm }) => {
  const { t } = useTranslation();

  return (
    <Fragment>
      <AlertBox>
        <Alert variant="warning">{t('landing.warning.check')}</Alert>
      </AlertBox>
      <ScrollableSection>
        <CenterView>
          <Content>
            <Center>
              <Header>
                <Svg height={193} name="vault" width={360} />
                <H3>
                  <Semibold>{t('landing.title1')}</Semibold> {t('landing.title2')}
                </H3>
              </Header>
              <Small marginBottom="sp03" textAlign="center">
                {t('landing.description')}
              </Small>
              <Small textAlign="center">{t('landing.description2')}</Small>
            </Center>
          </Content>
        </CenterView>
        <SectionStickyFooter>
          <Button onPress={onConfirm} size="regular">
            {t('actions.accessVault')}
          </Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Landing.propTypes = {
  onConfirm: PropTypes.func.isRequired,
};
