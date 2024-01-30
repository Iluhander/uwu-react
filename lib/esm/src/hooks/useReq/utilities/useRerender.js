import { useState } from "react";
const inc = (val) => val + 1;
export default function useRerender() {
    const [_, setState] = useState(0);
    return () => setState(inc);
}
