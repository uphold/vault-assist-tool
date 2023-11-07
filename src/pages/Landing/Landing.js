import { Alert } from '../../components/Alert';
import { Button } from '../../components/Button';
import { Center, Content, Header } from '../../layouts';
import { Fragment } from 'react';
import { H3 } from '../../components/Typography/H3';
import { Mixed } from '../../components/Mixed';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Semibold } from '../../components/Typography/Semibold';
import { Small } from '../../components/Typography/Small';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const AlertBox = styled(Mixed.div)`
  grid-area: navigation;
  padding: 16px;
`;

export const Landing = ({ onNavigation }) => {
  const { t } = useTranslation();
  const history = useHistory();
  const onVaultAccess = () => {
    onNavigation();
    history.push('/access');
  };

  return (
    <Fragment>
      <AlertBox>
        <Alert variant="warning">{t('landing.warning.check')}</Alert>
      </AlertBox>
      <ScrollableSection>
        <Content>
          <Center>
            <Header>
              <H3>
                <Semibold>{t('landing.title1')}</Semibold> {t('landing.title2')}
              </H3>
            </Header>
            <Small textAlign="center">{t('landing.description')}</Small>
          </Center>
        </Content>
        <SectionStickyFooter>
          <Button onPress={onVaultAccess} size="regular">
            {t('actions.accessVault')}
          </Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Landing.propTypes = {
  onNavigation: PropTypes.func.isRequired,
};
