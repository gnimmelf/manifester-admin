import Link from './Link.jsx';


export default ({className, ...props}) => (<Link className={"navbar-brand "+(className||'')} {...props} />);
