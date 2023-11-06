import { BottomSheet } from '../../components/BottomSheet';
import { Button } from '../../components/Button';
import { Content, Navigation } from '../../layouts';
import { Error } from '../../forms/components/Error';
import { Fragment, useState } from 'react';
import { Icon } from '../../components/Icon';
import { Mixed } from '../../components/Mixed';
import { NavigationAction, NavigationBar } from '../../components/Navigation';
import { ScrollableSection } from '../../components/ScrollableSection';
import { SectionStickyFooter } from '../../components/SectionStickyFooter';
import { Small } from '../../components/Typography/Small';
import { TextField } from '../../forms/fields/TextField';
import { useErrors } from '../../hooks/useErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import styled from 'styled-components';

export const Instructions = styled(Mixed.div)`
  margin-bottom: 24px;
  @media (min-height: 600px) {
    @media (min-width: 884px) {
      text-align: center;
    }
  }
`;

export const Access = () => {
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(false);

  const onClickBack = () => {
    history.goBack();
  };

  const form = useForm({
    resolver: yupResolver(true),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = form;

  const onSubmit = handleSubmit((data) => {
    const { address } = data;

    console.log(address);

    // onConfirm({
    //   details: {
    //     address,
    //   },
    // });
  });

  const dismissBottomsheet = () => setIsVisible(false);

  useErrors(form, errors?.[0]);

  return (
    <Fragment>
      <Navigation leftAction={<NavigationAction name="back" onClick={onClickBack} />} title="Vault Assist" />
      <ScrollableSection>
        <Content paddingTop="0">
          <Instructions>
            <Small>Enter the Vault address to check your balance and move funds.</Small>
          </Instructions>
          <TextField
            action={{
              icon: <Icon marginRight="10px" name="infoCircle" size={24} />,
              onClick: () => setIsVisible(true),
            }}
            control={control}
            data-test="address"
            label="XRP Vault Address"
            name="address"
            placeholder="Enter your address"
          >
            <Error type="required">Error: Required error</Error>

            <Error>Error: Invalid error</Error>
          </TextField>
        </Content>
        <SectionStickyFooter>
          <Button onPress={onSubmit}>Submit</Button>
        </SectionStickyFooter>
      </ScrollableSection>
      <BottomSheet isVisible={isVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title="XRP Vault address"
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp06">
            Each cryptocurrency held in your Vault corresponds to an underlying wallet address. You can locate this
            address within the Uphold app when accessing the Vault page for the specific asset. Alternatively, you can
            also find this address in the email sent to you when you initially created the Vault for that particular
            cryptocurrency.
          </Small>
          <Button onPress={dismissBottomsheet}>Ok, got it</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};
