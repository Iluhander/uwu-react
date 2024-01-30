export default function fakeSetState(input, ref, key) {
    if (typeof input === 'function') {
        ref.current[key] = input(ref.current[key]);
    }
    else {
        ref.current[key] = input;
    }
}
