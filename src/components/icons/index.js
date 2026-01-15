import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

export const HomeIcon = ({ size = 24, color = 'black', focused }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill={focused ? color : 'none'} stroke={color} />
        <Path d="M9 22V12h6v10" stroke={focused ? 'white' : color} />
    </Svg>
);

export const DuaIcon = ({ size = 24, color = 'black', focused }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill={focused ? color : 'none'} />
        <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill={focused ? color : 'none'} />
    </Svg>
);

export const QiblaIcon = ({ size = 24, color = 'black', focused }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" fill={focused ? color : 'none'} />
        <Path d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" stroke={focused ? 'white' : color} fill={focused ? 'white' : 'none'} />
    </Svg>
);

export const TisbihIcon = ({ size = 24, color = 'black', focused }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="10" stroke={color} fill={focused ? color : 'none'} />
        <Circle cx="12" cy="12" r="2" fill={focused ? 'white' : color} stroke="none" />
        <Circle cx="12" cy="5" r="1" fill={focused ? 'white' : color} stroke="none" />
        <Circle cx="19" cy="12" r="1" fill={focused ? 'white' : color} stroke="none" />
        <Circle cx="12" cy="19" r="1" fill={focused ? 'white' : color} stroke="none" />
        <Circle cx="5" cy="12" r="1" fill={focused ? 'white' : color} stroke="none" />
    </Svg>
);

export const SettingsIcon = ({ size = 24, color = 'black', focused }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={focused ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="3" fill={focused ? color : 'none'} />
        <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" fill={focused ? color : 'none'} />
    </Svg>
);

// Prayer Times Icons
export const SunIcon = ({ size = 24, color = 'black' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Circle cx="12" cy="12" r="5" />
        <Path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </Svg>
);

export const SunsetIcon = ({ size = 24, color = 'black' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M17 18a5 5 0 0 0-10 0" />
        <Path d="M12 2v7" />
        <Path d="M4.22 10.22l1.42 1.42" />
        <Path d="M1 18h2" />
        <Path d="M21 18h2" />
        <Path d="M18.36 10.22l1.42 1.42" />
        <Path d="M23 22H1" />
        <Path d="M8 6l4-4 4 4" />
    </Svg>
);

export const MoonIcon = ({ size = 24, color = 'black' }) => (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </Svg>
);
