import React, { Component } from "react";
import PropTypes from "prop-types";
import Rx from "rxjs";

// Knowledge:
// https://github.com/MichalZalecki/connect-rxjs-to-react/blob/master/src/state/RxState.js
// http://natpryce.com/articles/000814.html

export function createAction() {
  return new Rx.Subject();
}

export function createActions(actionNames) {
  return actionNames.reduce((acc, name) => ({ ...acc, [name]: createAction() }), {});
}

export function createState(reducer$, initialState$ = Rx.Observable.of({})) {
  return initialState$
    .merge(reducer$)
    .scan((state, [scope, reducer]) =>
      ({ ...state, [scope]: reducer(state[scope]) }))
    .publishReplay(1)
    .refCount();
}

export function makeSelector(...scopes)
/*
The `selector` is meant to reduce the full app `state` into a customized state object for the component.
Here we just bulk-select the state-props by component-name scopes, or return the entire app-`state` object if no
`scopes` are provided...
*/
{
  return scopes.length ?
    state => state :
    state => scopes.reduce((acc, key) => ({ ...acc, [key]: state[key] }), {});
}

export function connect(selector = makeSelector(), actionSubjects) {
  const actions = Object.keys(actionSubjects)
    .reduce((acc, key) => ({ ...acc, [key]: value => actionSubjects[key].next(value) }), {});

  return function wrapWithConnect(WrappedComponent)
  /*
  NOTE! `WrappedComponent` can be pure JSX or a full component!
  */
  {
    return class Connect extends Component {
      static contextTypes = {
        state$: PropTypes.object.isRequired,
      };

      componentWillMount() {
        this.subscription = this.context.state$.map(selector).subscribe(::this.setState);
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        return (
          <WrappedComponent {...this.state} {...this.props} {...actions} />
        );
      }
    };
  };
}

export class Provider extends Component
/*
This is the overarching component that keeps the app state.
It ensures that the `state$` is provided as a context on all children.
*/
{
  static propTypes = {
    state$: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    state$: PropTypes.object.isRequired,
  };

  getChildContext() {
    return { state$: this.props.state$ };
  }

  render() {
    return this.props.children;
  }
}