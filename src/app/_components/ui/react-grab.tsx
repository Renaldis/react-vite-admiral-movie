import { FloatButton } from "antd";
import { AimOutlined } from "@ant-design/icons";

import { useEffect } from "react";

const ReactGrab = () => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && window.__REACT_GRAB__) {
                window.__REACT_GRAB__.deactivate();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const handleClick = () => {
        if (window.__REACT_GRAB__) {
            window.__REACT_GRAB__.activate();
        }
    };

    return (
        <FloatButton
            type="primary"
            icon={<AimOutlined />}
            onClick={handleClick}
        />
    );
}

export default ReactGrab;