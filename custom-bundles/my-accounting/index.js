import accounting from './accounting';
import moment from './moment';

moment.locale('nb');
console.log('moment locale', moment.locale(), moment.weekdays());

accounting.locale('nb');
console.log('accounting locale', accounting.locale(), accounting.currency('1000.50'));

export {accounting, moment};