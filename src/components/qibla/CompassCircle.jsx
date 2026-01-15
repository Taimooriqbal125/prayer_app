import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useDerivedValue
} from 'react-native-reanimated';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

const CompassCircle = ({ relativeAngle = 0, qiblaFound = false }) => {
    // Smooth rotation animation
    const rotation = useDerivedValue(() => {
        return withSpring(-relativeAngle, {
            damping: 20,
            stiffness: 80,
        });
    }, [relativeAngle]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }],
    }));

    const compassSize = 280;
    const center = compassSize / 2;
    const outerRadius = 130;
    const innerRadius = 110;

    return (
        <View style={styles.container}>
            <AnimatedSvg
                width={compassSize}
                height={compassSize}
                viewBox={`0 0 ${compassSize} ${compassSize}`}
                style={animatedStyle}
            >
                {/* Outer Circle (Gold) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={outerRadius}
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="8"
                />

                {/* Inner Circle (Beige) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={innerRadius}
                    fill="#F5F5DC"
                    stroke="#C0C0C0"
                    strokeWidth="2"
                />

                {/* Cardinal Direction Markers */}
                {/* North (N) */}
                <Line
                    x1={center}
                    y1={center - outerRadius + 20}
                    x2={center}
                    y2={center - innerRadius}
                    stroke="#1A5246"
                    strokeWidth="3"
                />
                <SvgText
                    x={center}
                    y={center - outerRadius + 15}
                    fontSize="20"
                    fontWeight="bold"
                    fill="#1A5246"
                    textAnchor="middle"
                >
                    N
                </SvgText>

                {/* East (E) */}
                <Line
                    x1={center + innerRadius}
                    y1={center}
                    x2={center + outerRadius - 20}
                    y2={center}
                    stroke="#999"
                    strokeWidth="2"
                />
                <SvgText
                    x={center + outerRadius - 15}
                    y={center + 5}
                    fontSize="16"
                    fill="#666"
                    textAnchor="middle"
                >
                    E
                </SvgText>

                {/* South (S) */}
                <Line
                    x1={center}
                    y1={center + innerRadius}
                    x2={center}
                    y2={center + outerRadius - 20}
                    stroke="#999"
                    strokeWidth="2"
                />
                <SvgText
                    x={center}
                    y={center + outerRadius - 5}
                    fontSize="16"
                    fill="#666"
                    textAnchor="middle"
                >
                    S
                </SvgText>

                {/* West (W) */}
                <Line
                    x1={center - outerRadius + 20}
                    y1={center}
                    x2={center - innerRadius}
                    y2={center}
                    stroke="#999"
                    strokeWidth="2"
                />
                <SvgText
                    x={center - outerRadius + 15}
                    y={center + 5}
                    fontSize="16"
                    fill="#666"
                    textAnchor="middle"
                >
                    W
                </SvgText>

                {/* Degree Markings (every 30°) */}
                {[...Array(12)].map((_, i) => {
                    const angle = i * 30;
                    const rad = (angle - 90) * (Math.PI / 180);
                    const markLength = i % 3 === 0 ? 15 : 8;

                    return (
                        <Line
                            key={i}
                            x1={center + Math.cos(rad) * innerRadius}
                            y1={center + Math.sin(rad) * innerRadius}
                            x2={center + Math.cos(rad) * (innerRadius - markLength)}
                            y2={center + Math.sin(rad) * (innerRadius - markLength)}
                            stroke="#999"
                            strokeWidth="1"
                        />
                    );
                })}
            </AnimatedSvg>

            {/* Center Needle (Fixed, points North) */}
            <View style={styles.needleContainer}>
                <View style={[styles.needle, qiblaFound && styles.needleActive]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    needleContainer: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
    },
    needle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderBottomWidth: 80,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#B8860B',
        marginTop: -40,
    },
    needleActive: {
        borderBottomColor: '#2E8B57', // Green when Qibla found
    },
});

export default CompassCircle;
