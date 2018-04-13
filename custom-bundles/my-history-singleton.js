import createHistory from 'history/createBrowserHistory';

// Used in routing with history alterations from components in different bundles

// Knowledge
// https://medium.freecodecamp.org/an-introduction-to-the-redux-first-routing-model-98926ebf53cb
// https://medium.freecodecamp.org/you-might-not-need-react-router-38673620f3d
// https://github.com/yenshih/history-query-enhancer

// Implementations
// https://github.com/grahammendick/navigation
// https://github.com/kriasoft/universal-router/blob/master/docs/api.md
// https://github.com/krasimir/navigo

const history = createHistory();

export default history;

