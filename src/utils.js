const delay = (milliseconds, payload) => {
    return new Promise(function(resolve) {
        setTimeout(resolve.bind(null, payload), milliseconds);
    });
};

const retryOnReject = (promise, retryConditionFn, retryAttemptsLeft = 2, msBetweenRetry = 200) => {
    if ( retryAttemptsLeft === 0) {
        return Promise.reject('Gave up!');
    }
    return promise
        .then((data) => Promise.resolve(data))
        .catch((error) => {
            if (retryConditionFn(error)) {
                return delay(msBetweenRetry).then( () => retryOnReject(promise, retryConditionFn, retryAttemptsLeft-1));
            } else {
                throw error;
            }
        });
};

const retryOn403Condition = (error) => error && error.response && error.response.status === 403;

export {
    delay,
    retryOnReject,
    retryOn403Condition,
};
