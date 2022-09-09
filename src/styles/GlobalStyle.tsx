import { createGlobalStyle } from 'styled-components';
import { reset } from 'styled-reset';

const GlobalStyle = createGlobalStyle`
  ${reset}
  *, *:before, *:after{box-sizing:border-box;}
  
  html{font-size:16px;}
  html,body{height:100%;}
  body{
    font-family: Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif;
    font-weight: 400;
    color: ${(props) => props.theme.white.darker};
    word-break:break-word;
    background-color: #000;
  }
  #root{
    margin: 0 auto;
    height: 100%;
    overflow: hidden auto;
  }
  a, button, input{all: unset;color: ${(props) => props.theme.white.darker}}
  a, button{cursor:pointer;}
`;

export default GlobalStyle;
