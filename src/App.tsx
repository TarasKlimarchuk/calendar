import { createGlobalStyle } from 'styled-components';

import { Calendar } from './components';

const GlobalStyles = createGlobalStyle`
  :root {
    font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyles />
      <Calendar />
    </>
  );
};

export default App;
