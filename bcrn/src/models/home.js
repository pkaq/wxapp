
export default {
    namespace: 'home',
    state: {
        exchange: ['SH'],
        commission: ['0.0025'],
        coverNumber: 100,
        coverPrice: '0',
        holdingNumber: 100,
        holdingPrice: '0',
        finalCost: 0
    },
    reducers: {
        calcuate(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    }
};




