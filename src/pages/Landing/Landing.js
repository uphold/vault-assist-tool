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
import PropTypes from 'prop-types';
import styled from 'styled-components';

export const AlertBox = styled(Mixed.div)`
  grid-area: navigation;
  padding: 16px;
`;

export const Landing = ({ onNavigation }) => {
  const history = useHistory();
  const onVaultAccess = () => {
    onNavigation();
    history.push('/access');
  };

  return (
    <Fragment>
      <AlertBox>
        <Alert variant="warning">Always check the legitimacy of Vault assist website before using your keys.</Alert>
      </AlertBox>
      <ScrollableSection>
        <Content>
          <Center>
            <Header>
              <H3>
                <Semibold>Vault</Semibold> Assist
              </H3>
            </Header>
            <Small textAlign="center">
              {`A small paragraph about the assist tool. What's the main purpose of the Vault assist tool and for what it should be used for.`}
            </Small>
          </Center>
        </Content>
        <SectionStickyFooter>
          <Button onPress={onVaultAccess} size="regular">
            Access your Vault
          </Button>
        </SectionStickyFooter>
      </ScrollableSection>
    </Fragment>
  );
};

Landing.propTypes = {
  onNavigation: PropTypes.func.isRequired,
};
