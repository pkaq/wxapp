/**
 * Created by liangfangzheng on 2018/6/17.
 */

import { navReducer } from '../../App';

export default {
    namespace: 'router',
    state: {
        ...navReducer(),
    },
    reducers: {
        apply(state, {payload: action}) {
            return navReducer(state, action);
        },
    },
};