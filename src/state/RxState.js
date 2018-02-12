import React, { Component } from "react";
import PropTypes from "prop-types";
import Rx from "rxjs";
import { log } from '../lib/utils';

// Knowledge:
// http://rxfiddle.net/
// https://github.com/MichalZalecki/connect-rxjs-to-react/blob/master/src/state/RxState.js
// http://natpryce.com/articles/000814.html
// https://www.gitbook.com/book/btroncone/learn-rxjs/details

export const isObservable = obs => obs instanceof Rx.Observable;

export function createAction() {
  return new Rx.Subject();
}

export function createActions(actionNames) {
  return actionNames.reduce((acc, name) => ({ ...acc, [name]: createAction() }), {});
}

export function createState(reducer$) {
  const publisher$ = Rx.Observable
    .merge(reducer$)
    .scan((promisedState, [scope, reducer]) => {
    
      return promisedState.then(state => {
        const reduced = reducer(state[scope]);

        if (reduced instanceof Promise) {
          return reduced.then(resolved => ({ ...state, [scope]: resolved }));
        }
        else {
          return Promise.resolve({ ...state, [scope]: reduced });
        }        
      });     

    }, Promise.resolve({}))
    .flatMap(promisedState => Rx.Observable.from(promisedState))
    //.startWith({})
    .publishReplay(1)
    .refCount();

    return publisher$;
}

export function scopeState(...scopes)
/*
Here we just bulk-select the state-props by component-name scopes,
or return the entire app-`state` object if no `scopes` are provided...
*/
{
  console.log("Scopes", scopes)
  const selector = !scopes.length ?
    state => state :
    state => scopes.reduce((acc, key) => ({ ...acc, [key]: state[key] }), {});

  return selector;
}

export function connect(selector, actionSubjects)
// The `selector` is meant to reduce the full app `state` into a customized state object for the component.
{
  if (typeof selector != 'function') {
    // Assume either string or array...
    selector =  typeof selector == 'string' ?
      scopeState(selector) :
      scopeState(...selector)
  }

  // Wrap each `actionSubject.next()` in anonymous function so it can be invoked by the action(-stream)-key
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
        // Use `selector` to filter app-state (`this.context.state$`), and set `this.state` for this component
        this.subscription = this.context.state$.map(selector).subscribe(::this.setState);
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {
        const props = {
          ...this.state,
          ...this.props,
          ...actions
        }

        console.log("render PROPS", props)

        return (
          <WrappedComponent {...props} />
        );
      }
    };
  };
}

export class RxStateProvider extends Component
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