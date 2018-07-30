import { Component } from 'react';
import dva from 'dva';
import createLoading from 'dva-loading';

let app = dva({
  history: window.g_history,
  ...((require('C:/workspaces/lab/bcapp/src/dva.js').config || (() => ({})))()),
});

window.g_app = app;
app.use(createLoading());
app.use(require('C:/workspaces/lab/bcapp/node_modules/dva-immer/lib/index.js').default());
app.model({ namespace: 'index', ...(require('C:/workspaces/lab/bcapp/src/pages/home/models/index.js').default) });

class DvaContainer extends Component {
  render() {
    app.router(() => this.props.children);
    return app.start()();
  }
}

export default DvaContainer;
