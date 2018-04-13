import React from "react";
import { Alert } from 'reactstrap';

export default ({status='success', itemList, heading, ingress}) => (
  <If condition={ itemList && itemList.length }>
    <Alert color={status}>
      <If condition={heading}>
        <h4 className="alert-heading">{heading}</h4>
      </If>

      <If condition={heading}>
        <p>{ingress}</p>
        <hr />
      </If>

      <pre>
        {(itemList instanceof Array ? itemList :[itemList]).map((item, i) => {
          return (
            <div key={i}>
              {item}
            </div>
          );
        })}
      </pre>

    </Alert>
  </If>
);
