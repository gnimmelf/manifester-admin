import _debug from "debug";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Observable, Subject } from "rxjs";

const debug = _debug("rxstate");
const debugComp = _debug("rxstate.component");

// Knowledge:
// http://rxfiddle.net/
// https://github.com/MichalZalecki/connect-rxjs-to-react/blob/master/src/state/RxState.js
// http://natpryce.com/articles/000814.html
// https://www.gitbook.com/book/btroncone/learn-rxjs/details
// https://medium.com/@baphemot/understanding-reactjs-component-life-cycle-823a640b3e8d

export function createAction() {
  return new Subject();
}

export function createActions(actionNames) {
  return actionNames.reduce((acc, name) => ({ ...acc, [name]: createAction() }), {});
}

export function createState(reducer$, initialState$=Observable.of({})) {
  const publisher$ = initialState$
    .merge(reducer$)
    .debug(debug, "> SCAN")
    .scan((state, [scope, reducer]) =>
      ({ ...state, [scope]: reducer(state[scope]) }))
    .debug(debug, ">> STATE")
    .publishReplay(1)
    .refCount();

    return publisher$;
}

export function connect(selector=(state)=>state, actionSubjects, hooks={})
// The `selector` is meant to reduce the full app `state` into a customized state object for the component.
{
  // Wrap each `actionSubject.next()` in anonymous function so it can be invoked by the action(-stream)-key
  const actions = Object.keys(actionSubjects)
    .reduce((acc, key) => ({ ...acc, [key]: (value) => actionSubjects[key].next(value) }), {});

  return function wrapWithConnect(WrappedComponent)
  /*
  NOTE! `WrappedComponent` can be pure JSX or a full component!
  */
  {
    return class Connect extends Component {
      static contextTypes = {
        state$: PropTypes.object.isRequired,
      };

      hook(eventName, ...rest) {
        if (hooks[eventName]) {
          debugComp(`HOOK.${eventName} invoked!`, selector);
          hooks[eventName]({...this.props, ...this.state, ...actions});
        }
      }

      componentDidMount() {
        this.hook('componentDidMount');
      }

      componentWillMount() {
        // Use `selector` to filter app-state (`this.context.state$`), and set `this.state` for this component
        const self = this;
        this.subscription = this.context.state$.map(selector).subscribe((componentState) => {
          debugComp("COMPONENTSTATE", componentState);
          self.setState(componentState);
        })
      }

      componentWillUnmount() {
        this.subscription.unsubscribe();
        this.hook('componentWillUnmount');
      }

      render() {

        debugComp("RENDER.props", this.props)
        debugComp("RENDER.state", this.state)
        debugComp("RENDER.actions", actions)

        // Apply everything as `props`:  `props` before `state`, then `actions`!
        const props = {...this.props, ...this.state, ...actions};
        return (<WrappedComponent {...props} />);
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


// TODO! This shouldn't be here!
Observable.prototype.debug = function (debugInstance, ...rest) {
    return this.do(
        function (next) {
            debugInstance(...rest, next);
        },
        function (err) {
            debugInstance('ERROR >>> ',...rest , err);
        },
        function () {
            debugInstance('Completed.', ...rest);
        }
    );
};