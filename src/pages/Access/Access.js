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
import { addressSchema } from '../../forms/schemas';
import { useErrors } from '../../hooks/useErrors';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
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
  const { t } = useTranslation();
  const history = useHistory();
  const [isVisible, setIsVisible] = useState(false);

  const onClickBack = () => {
    history.goBack();
  };

  const form = useForm({
    mode: 'onChange',
    resolver: yupResolver(addressSchema),
  });

  const { control, handleSubmit } = form;

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

  useErrors(form);

  return (
    <Fragment>
      <Navigation
        leftAction={<NavigationAction name="back" onClick={onClickBack} />}
        title={t('access.navigation.title')}
      />
      <ScrollableSection>
        <Content paddingTop="0">
          <Instructions>
            <Small>{t('access.description')}</Small>
          </Instructions>
          <TextField
            action={{
              icon: <Icon marginRight="10px" name="infoCircle" size={24} />,
              onClick: () => setIsVisible(true),
            }}
            control={control}
            data-test="address"
            label={t('access.fields.address.label.xrp')}
            name="address"
            placeholder={t('access.fields.address.placeholder')}
          >
            <Error type="required">{t('access.fields.address.errors.required')}</Error>

            <Error>{t('access.fields.address.errors.invalid')}</Error>
          </TextField>
        </Content>
        <SectionStickyFooter>
          <Button onPress={onSubmit}>{t('actions.submit')}</Button>
        </SectionStickyFooter>
      </ScrollableSection>
      <BottomSheet isVisible={isVisible} onRequestClose={dismissBottomsheet}>
        <NavigationBar
          leftAction={<NavigationAction name="expand" onClick={dismissBottomsheet} />}
          title={t('access.fields.address.details.header')}
        />
        <ScrollableSection padding="sp02 sp05">
          <Small marginBottom="sp06">{t('access.fields.address.details.description')}</Small>
          <Button onPress={dismissBottomsheet}>{t('actions.okay')}</Button>
        </ScrollableSection>
      </BottomSheet>
    </Fragment>
  );
};
