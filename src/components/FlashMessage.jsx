import _debug from "debug";
import { connect } from "../state/RxState";

import { Alert, Button } from 'my-ui-components';

import flashCss from '../css/flash-message.css';

import { flashMessageActions } from "../actions";

const debug = _debug("component:flashmessage")

const FlashMessage = ({queue, ...props}) => {
  debug("FLASHMESSAGE.props", queue, props)
  return (
    <With message={queue[0]}>
      <If condition={ message }>
        <With content={message.content} status={message.status||'dark'}>
          <Alert color={status} {...props} onClick={props.pop$}>
            <div styleName="flashCss.alert-content">
              {content}
            </div>
            <Button color="dark" size="sm" styleName="flashCss.dismiss-button">OK</Button>
          </Alert>
        </With>
      </If>
    </With>
  );
}

export default connect(({ flashMessage }) => flashMessage, flashMessageActions)(FlashMessage);