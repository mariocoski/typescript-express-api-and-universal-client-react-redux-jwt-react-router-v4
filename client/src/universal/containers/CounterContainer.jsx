import React from 'react';
import {
  Header
} from 'semantic-ui-react';
const CounterContainer = (props) => (<div>
     <Header
        as='h1'
        content='Counter'
        inverted
        style={{ fontSize: '3.5em', fontWeight: 'normal', marginBottom: 0, marginTop: '3em' }}
    />
</div>);

export default CounterContainer;