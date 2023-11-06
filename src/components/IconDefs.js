import { map, upperFirst } from 'lodash';
import icons from '../assets/icons';
import styled from 'styled-components';

const Wrapper = styled.svg`
  height: 0;
  position: absolute;
  width: 0;
`;

export const IconDefs = () => (
  <Wrapper>
    <defs>
      {map(icons, ({ size, source }, key) => (
        <symbol id={`icon${upperFirst(key)}`} key={key} viewBox={`0 0 ${size} ${size}`}>
          {source}
        </symbol>
      ))}
    </defs>
  </Wrapper>
);
