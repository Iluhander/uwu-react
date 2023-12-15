# Iluhander React lib
Custom [react](https://react.dev/) lib, mainly focused on making requests. It provides facilities for creating:
- _blazingly fast_ hooks for making requests (with timeouts, attempts, reducers and more)
- convinient forms (with auto saving, data injecting and more)
- controlling app state (using enums and checking functions)
- and more

## Guides

### useReq

useReq allows you to control your requests. You can provide a fetchFunction and a config object, containing the following fields:

- _StatusObj_: your custom status enum. By default, _ReqStatus_ is used
- _getSuccessStatus_: function, receiving the data field from fetchFunction result and returning a new status
- _getFailedStatus_: function, receiving status code of a failed fetchFunction and returning a new status
- _notInstantReq_: flag, telling should the fetchFunction be called only after calling exec
- _initialData_: initial data, stored in hook
- _reducer_: function, receiving old data and new fetchFunction data, and returning the new data
- _timeout_: timeout in ms for fetchFunction. After the time runs out, status sets to StatusObj.TIMEOUT
- _attempts_: amount of times useReq should try to call fetchFunction, ignoring it's error

useReq will return an object, containing the following fields:

- _data_: data, fetched by the fetchFunction
- _status_: status (field of StatusObj)
- _exec_: function for starting a new request
- _setData_: function, allowing to directly change the data in useReq (without making a request)

For example, here's how to create custom hook for patching data with [axios](https://axios-http.com/):
```javascript
const usePatchSomeData = () =>
  useReq((newData) => axios.patch('/your_endpoint', newData), {
    notInstantReq: true,
    getFailedStatus: (code) => {
      if (code === 409) {
        return YourStatusObj.CONFLICT;
      }

      return YourStatusObj.INTERNAL_ERR;
    },
    attempts: 3
  });
```

And here is how to use it in a react component
```javascript
const { data, status, exec } = usePatchSomeData();

const handleSomeEvent = (eventData) => {
  exec(eventData);
}

```

### useSendFormByCD

useSendFormByCD automatically sends your form data, when it's updated.

You can provide a fetchFunction, your form ref and a config object, containing the following fields:

- _beforeSending_: function, which modifies the form data before it gets sent
- _compare_: function, comparing previous and new form data. By default, _areEqualShallow is used_
- _coolDown_: how often (in ms) the hook should check the form data
- _name_: localStorage key. If you set it, the hook will automatically save data in local storage in between of calling the fetchFunction
- _localSavingCoolDown_: how often the hook should save the form data locally

Here is how you can use it:

```javascript
const usePatchPostData = (formRef) =>
  useSendFormByCD((newData) => axios.patch('your_endpoint', newData), formRef, {
    name: `locallySavingKey`,
    localSavingCoolDown: 1500
  });
```

Please notice: the docs are currently in development. You can find more information in jsdocs.
