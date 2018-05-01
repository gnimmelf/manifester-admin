import _debug from "debug";

import Form from 'my-jsonschema-form';
import { Button, ButtonGroup } from 'my-ui-components';

import appCss from '../../css/app.css';

const debug = _debug("components:partials:cmsjsonschemaform")

const CmsJsonSchemaForm = function(props) {
  debug("ACCOUNTFORM.props", props)
  return (
    <div styleName="appCss.form-container">
      <Choose>
        <When condition={props.schema}>

          <Form
              schema={props.schema}
              formData={props.formData}
              errorSchema={props.errorSchema}
              onSubmit={props.submit$}>
            <ButtonGroup>
              <Button onClick={props.reset$} id="reset">Reset</Button>
              <Button color="primary" type="submit">Save</Button>
            </ButtonGroup>
          </Form>

        </When>
      </Choose>
    </div>
  )
}

export default CmsJsonSchemaForm;