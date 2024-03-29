import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --white: #FFF;
    --background: ${props => props.theme.colors.background};
    --header : ${props => props.theme.colors.header};
    --lines: ${props => props.theme.colors.lines};
    --textDefault: ${props => props.theme.colors.textDefault};
    --textAlternative: ${props => props.theme.colors.textAlternative};
    --textEpisodes: ${props => props.theme.colors.textEpisodes};
    --columnName: ${props => props.theme.colors.columnName};
    --buttonBorder: ${props => props.theme.colors.buttonBorder};

    --gray-50: #F7F8FA;
    --gray-100: #E6E8EB;
    --gray-200: #AFB2B1;
    --gray-500: #808080;
    --gray-800: #494D4B;

    --green-500: #04D361;
    
    --purple-300: #9F75FF;
    --purple-400: #9164FA; 
    --purple-500: #8257E5;
    --purple-800: #6F48C9;
  }

  @media (max-width: 1440px) {
    html {
      font-size: 80%;
    }
  }

  @media (max-width: 1080px) {
    html {
      font-size: 93.75%;  //15px
      /*
        não foi setado 15px diretamente pela questão de acessibilidade. Caso o user aumente a fonte pelo sistema operacional,
        não vai surtir efeito se deixarmos fixado o valor em px
      */
    }
  }

  @media (max-width: 720px) {
    html {
      font-size: 87.5%;  //14px
    }
  }

  body {
    background: var(--background);
  }

  body, input, textarea, button {
    font: 500 1rem Inter, sans-serif;
    color: var(--textAlternative);
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    font-family: Lexend, sans-serif;
    color: var(--textDefault);
  }

  h1 {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.5rem;
  }

  button {
    cursor: pointer;
  }
`