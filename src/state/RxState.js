import React, { Component } from "react";
import PropTypes from "prop-types";
import { Observable, Subject } from "rxjs";
import { log } from '../lib/utils';

// Knowledge:
// http://rxfiddle.net/
// https://github.com/MichalZalecki/connect-rxjs-to-react/blob/master/src/state/RxState.js
// http://natpryce.com/articles/000814.html
// https://www.gitbook.com/book/btroncone/learn-rxjs/details

export function createAction() {
  return new Subject();
}

export function createActions(actionNames) {
  return actionNames.reduce((acc, name) => ({ ...acc, [name]: createAction() }), {});
}

export function createState(reducer$, initialState$=Observable.of({})) {
  const publisher$ = initialState$
    .map(state => state instanceof Promise ? state : Promise.resolve(state))
    .merge(reducer$)
    .do(log("> SCAN"))
    .scan((promisedState, [scope, reducer]) => {

      console.log("SCAN", promisedState, scope, reducer)

      return promisedState.then(state => {

        console.log("STATE:", state)

        const reduced = reducer(state[scope]);

        console.log("REDUCED", state, scope, reduced)

        if (reduced instanceof Promise) {
          return reduced.then(value => ({ ...state, [scope]: value }));
        }
        else {
          return Promise.resolve({ ...state, [scope]: reduced });
        }
      });

    })
    .do(log("STATE >"))
    .flatMap(promisedState => Observable.from(promisedState))
    .do(log("STATE >>"))
    .publishReplay(1)
    .refCount();

    return publisher$;
}

export function connect(selector=(state)=>state, actionSubjects)
// The `selector` is meant to reduce the full app `state` into a customized state object for the component.
{
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
        const self = this;
        this.subscription = this.context.state$.map(selector).subscribe((scopedState) => {
          console.log("SCOPEDSTATE", scopedState);
          self.setState(scopedState);
        })
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
      }

      render() {

        console.log("RENDER.props", this.props)
        console.log("RENDER.state", this.state)

        const props = {
          ...this.props,
          ...this.state,
          ...actions
        }

        console.log("WRAPPEDCOMPONENT.props", props)

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