// @flow
import React, { type Node } from 'react';

// $FlowFixMe
const { Provider, Consumer } = React.createContext({ data: {}, setResponse: () => {} });

type ProviderProps = {
  children: Node
};
type ProviderState = {
  data: Object
};

class LoadsProvider extends React.Component<ProviderProps, ProviderState> {
  state = { data: {} };

  setResponse = (key: string, { response = null, error = null }: { response?: any, error?: any }) => {
    this.setState({ data: { ...this.state.data, [key]: { response, error } } });
  };

  render = () => {
    const { children } = this.props;
    return <Provider value={{ data: this.state.data, setResponse: this.setResponse }}>{children}</Provider>;
  };
}

type ConsumerProps = {
  cacheKey: string,
  children: Function
};

class LoadsConsumer extends React.Component<ConsumerProps> {
  render = () => {
    const { cacheKey, children } = this.props;
    return (
      <Consumer>
        {context => {
          return children({
            ...context.data[cacheKey],
            hasResponseInCache: typeof context.data[cacheKey] !== 'undefined',
            setResponse: data => context.setResponse(cacheKey, data)
          });
        }}
      </Consumer>
    );
  };
}

export default class extends React.PureComponent<{}> {
  static Provider = LoadsProvider;
  static Consumer = LoadsConsumer;
}