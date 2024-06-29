import { act, renderHook } from '@testing-library/react';
import { ReqStatus, useReq } from '../lib/esm/index.mjs';
import { useEffect } from 'react';

const getDelay = () => Math.floor(Math.random() * 500);

const res = (after = getDelay(), data = {}, status = 200) =>
  new Promise((res) => setTimeout(() => res({ data, status }), after));

const rej = (after = getDelay(), data = {}, status = 500) =>
  new Promise((_, rej) => setTimeout(() => rej({ data, status }), after));

class Attempted {
  constructor(...fns) {
    this.fns = fns;
    
    this.call = (time, data) => {
      const fn = this.fns.shift();

      return (fn ? fn(time, data) : rej(-1));
    }
  }
}

class Case {
  static generate(amount, ...args) {
    return [
      ...Array(amount).fill().map(() => new Case(false, ...args)),
      ...Array(amount).fill().map(() => new Case(true, ...args))
    ];
  }

  constructor(instant, func, time = getDelay(), config = {}, data = Math.random()) {
    this.time = time;
    this.data = data;

    const fn = () => func(this.time, this.data);
    this.hook = instant ?
      () => useReq(fn, config) :
      () => {
        const res = useReq(fn, {
          ...config,
          notInstantReq: true
        });

        useEffect(res.exec, []);

        return res;
      }
  }
}

const cases = {
  success: {
    common: Case.generate(5, res),
    retried: [
      new Case(true, new Attempted(rej, res).call, 50, { attempts: 2 }),
      new Case(true, new Attempted(rej, () => rej(1e3), res).call, 50, { attempts: 4, timeout: 2e2 })
    ]
  },
  error: {
    common: Case.generate(5, rej),
    retried: Case.generate(5, rej, 40, { attempts: 3 }),
    timeout: {
      common: Case.generate(5, res, 1e3, { timeout: 2e2 }),
      retried: [new Case(true, new Attempted(() => res(1e4)).call, -1, { timeout: 2e2 })]
    }
  }
};

test('responds in a normal case', async () => {
  for (let { data, time, hook } of cases.success.common) {
    const { result } = renderHook(hook);

    expect(result.current?.status).toBe(ReqStatus.LOADING);

    await res(time + 100);
    expect(result.current?.status).toBe(ReqStatus.LOADED);
    expect(result.current?.data).toBe(data);
  }
});

test('responds in a retry case', async () => {
  for (let { data, time, hook } of cases.success.retried) {
    const { result } = renderHook(hook);

    expect(result.current?.status).toBe(ReqStatus.LOADING);

    await res(time + 300);
    expect(result.current?.status).toBe(ReqStatus.LOADED);
    expect(result.current?.data).toBe(data);
  }
});

test('responds in a error case', async () => {
  for (let { time, hook } of cases.error.common) {
    const { result } = renderHook(hook);

    expect(result.current?.status).toBe(ReqStatus.LOADING);

    await res(time + 100);
    expect(result.current?.status).toBe(ReqStatus.ERROR);
  }
});

test('fails due to a timeout', async () => {
  for (let { time, hook } of cases.error.timeout.common) {
    const { result } = renderHook(hook);

    expect(result.current?.status).toBe(ReqStatus.LOADING);

    await res(300);
    expect(result.current?.status).toBe(ReqStatus.TIMEOUT);
  }
});

test('fails due to a timeout after retries', async () => {
  for (let { time, hook } of cases.error.timeout.retried) {
    const { result } = renderHook(hook);

    expect(result.current?.status).toBe(ReqStatus.LOADING);

    await res(300);
    expect(result.current?.status).toBe(ReqStatus.TIMEOUT);
  }
});

const mockFetchFunction = () => Promise.resolve({ data: 'success' });

test('useReq with setData', async () => {
  const { result } = renderHook(() => useReq(mockFetchFunction));

  act(() => {
    result.current.setData('newData');
  });

  expect(result.current.data).toBe('newData');
});

const reducerFn = (oldData, newData) => `${oldData} + ${newData}`;

test('useReq with reducer', async () => {
  const { result } = renderHook(() =>
    useReq(mockFetchFunction, { reducer: reducerFn, initialData: 'initial' })
  );

  await res(300);
  expect(result.current.data).toBe('initial + success');
});

const customStatus = {
  INITIAL: 'INITIAL',
  LOADING: 'LOADING',
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  TIMEOUT: 'TIMEOUT',
};

test('useReq with initialData and initialStatus', async () => {
  const { result } = renderHook(() =>
    useReq(mockFetchFunction, { initialData: 'initial', initialStatus: customStatus.INITIAL })
  );

  expect(result.current.data).toBe('initial');
  expect(result.current.status).toBe(customStatus.INITIAL);
});

test('useReq with setStatus', async () => {
  const { result } = renderHook(() =>
    useReq(() => res(250))
  );

  expect(result.current.status).toBe(ReqStatus.LOADING);

  act(() => {
    result.current.setStatus(ReqStatus.ERROR);
  });

  expect(result.current.status).toBe(ReqStatus.ERROR);

  await res(300);

  expect(result.current.status).toBe(ReqStatus.ERROR);
});
