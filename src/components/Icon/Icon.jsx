import { iconLists } from "./icons";

function Icon({
    name,
    fill = '#ffffff',
    size = 20,
    className = '',
}) {
    const IconComponent = iconLists[name];

    if (!IconComponent) return null;

    return (
        <span
            className={`inline-flex items-center ${className}`}
            style={{ width: size, height: size }}
        >
            <IconComponent fill={fill} />
        </span>
    );
}

export default Icon;