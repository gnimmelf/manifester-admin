import _debug from "debug";
import { Observable, Subject } from "rxjs";
import normalizeUrl from 'normalize-url';
import { toast } from "my-ui-components";
import {
  objOmit,
  autoReduce,
  takeOneWhen,
} from "../lib/utils";
import {
  cmsActions,
} from "../actions";
import { xhr, xhrHandler } from "../lib/xhr";
import settings from "../lib/settings";
import history$ from '../lib/history$';

const debug = _debug("reducers:cmsreducer")

const initialState = {
  schemaNames: undefined,
  currentSchema: undefined,
  schemas: undefined,
  schemaGroups: undefined,
};

export default Observable.of(() => initialState)
  .merge(

    cmsActions.fetchSchemas$
      .flatMap(() => xhr('schemas', 'content.*')())
      .map(xhrHandler({
        200: (data) => data,
        401: (data) => false,
      }))
      .map(({schemas}) => state => {

        const childrenKey = "children";

        const groups = [];

        ;(schemas || []).forEach(schemaName => {

          const parts = schemaName.replace(/\.json$/, '').split(".");
          let children = groups;
          let group;

          parts.forEach((part, idx) => {

            const found = children.find(group => group.id == part);

            if (found) {
              group = found;
            }
            else {
              group = { id: part, name: part };
              group[childrenKey] = [];
              if (idx == parts.length-1) {
                // It's a leaf
                group[childrenKey].push({ id: schemaName, name: part, isLeaf: true });
              }
              children.push(group);
            }
            children = group[childrenKey];
          });
        });

        return {
          ...state,
          schemaNames: schemas,
          schemaGroups: groups,
        };
      }),

    cmsActions.selectSchema$
      // TODO! Schema should be loaded implicitly by selecting data...
      .flatMap((schemaName) => xhr('schemas', schemaName)())
      .map(xhrHandler({
        200: (data) => data,
      }))
      .map(({schema}) =>  state => ({
        ...state,
        currentSchema: schema
      })),

    cmsActions.loadData$
      .map(payload => state => state),

    cmsActions.saveData$
      .map(payload => state => state),
  );

